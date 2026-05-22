"use client";

import {
  SUPPORTED_LANGUAGES,
  type CodeChange,
  type RoomAccessResponse,
  type RoomPresenceUser,
  type RoomSnapshot,
  type SupportedLanguage
} from "@codeshare/shared";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import type * as Monaco from "monaco-editor";
import type { editor } from "monaco-editor";
import { io, type Socket } from "socket.io-client";

import { formatTimeRemaining } from "@/lib/format";
import { siteConfig } from "@/lib/site";

import { OwnerPanel } from "./owner-panel";
import { ToastRack } from "./toast-rack";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-[72vh] w-full flex-col items-center justify-center bg-[#09131e]/50 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-[color:var(--accent)]/20 opacity-75"></div>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--accent)]/20 border-t-[color:var(--accent)]"></div>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent)] animate-pulse">
          Loading editor...
        </p>
      </div>
      <div className="absolute inset-x-6 top-6 flex flex-col gap-3 opacity-20">
        <div className="h-4 w-1/4 rounded bg-[color:var(--muted)]/20 animate-pulse"></div>
        <div className="h-4 w-1/2 rounded bg-[color:var(--muted)]/20 animate-pulse"></div>
        <div className="h-4 w-1/3 rounded bg-[color:var(--muted)]/20 animate-pulse"></div>
        <div className="h-4 w-2/3 rounded bg-[color:var(--muted)]/20 animate-pulse"></div>
      </div>
    </div>
  )
});

type EditorShellProps = {
  session: RoomAccessResponse;
  onSaveRoom: (input: {
    visibility: "public" | "private";
    password?: string;
    expiryHours: number;
    language: SupportedLanguage;
  }) => Promise<RoomSnapshot>;
  onDeleteRoom: () => Promise<void>;
  onRoomSnapshot: (room: RoomSnapshot) => void;
};

type ToastItem = {
  id: number;
  message: string;
};

function getLanguageLabel(language: SupportedLanguage) {
  return language === "plaintext" ? "Plain text" : language;
}

export function EditorShell({ session, onSaveRoom, onDeleteRoom, onRoomSnapshot }: EditorShellProps) {
  const router = useRouter();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const applyingRemoteRef = useRef(false);
  const pendingChangesRef = useRef<CodeChange[]>([]);
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clientIdRef = useRef(typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`);

  const [code, setCode] = useState(session.room.code);
  const [language, setLanguage] = useState<SupportedLanguage>(session.room.language);
  const [users, setUsers] = useState<RoomPresenceUser[]>([]);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [ownerPanelOpen, setOwnerPanelOpen] = useState(false);
  const [ownerBusy, setOwnerBusy] = useState(false);

  function showToast(message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 2200);
  }

  useEffect(() => {
    setCode(session.room.code);
    setLanguage(session.room.language);
  }, [session.room.code, session.room.language]);

  useEffect(() => {
    const socket = io(siteConfig.apiUrl, {
      transports: ["websocket"],
      auth: {
        accessToken: session.accessToken,
        clientId: clientIdRef.current
      }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      flushPendingChanges();
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (error) => {
      setConnected(false);
      const errorMessage = error.message || "Connection failed.";
      showToast(errorMessage);

      const isFatal =
        errorMessage.toLowerCase().includes("full") ||
        errorMessage.toLowerCase().includes("not found") ||
        errorMessage.toLowerCase().includes("token") ||
        errorMessage.toLowerCase().includes("unauthorized") ||
        errorMessage.toLowerCase().includes("expired");

      if (isFatal) {
        socket.disconnect();
      }
    });

    socket.on("room:snapshot", (payload: { code: string; language: SupportedLanguage }) => {
      syncEditorFromServer(payload.code, payload.language);
    });

    socket.on("room:presence", (payload: { users: RoomPresenceUser[] }) => {
      startTransition(() => setUsers(payload.users));
    });

    socket.on("room:ops", (payload: { changes: CodeChange[]; clientId: string }) => {
      if (payload.clientId === clientIdRef.current) {
        return;
      }

      applyRemoteChanges(payload.changes);
    });

    socket.on("room:language", (payload: { language: SupportedLanguage }) => {
      updateLanguageState(payload.language);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session.accessToken]);

  useEffect(() => {
    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!session.room.isOwner) {
      return;
    }

    function handleOpenOwnerPanel() {
      setOwnerPanelOpen(true);
    }

    window.addEventListener("codeshare:open-owner-panel", handleOpenOwnerPanel);

    return () => {
      window.removeEventListener("codeshare:open-owner-panel", handleOpenOwnerPanel);
    };
  }, [session.room.isOwner]);

  function syncEditorFromServer(nextCode: string, nextLanguage: SupportedLanguage) {
    updateLanguageState(nextLanguage);

    const model = editorRef.current?.getModel();

    if (!model) {
      setCode(nextCode);
      return;
    }

    if (model.getValue() === nextCode) {
      return;
    }

    applyingRemoteRef.current = true;
    model.setValue(nextCode);
    applyingRemoteRef.current = false;
    setCode(nextCode);
  }

  function updateLanguageState(nextLanguage: SupportedLanguage) {
    setLanguage(nextLanguage);
    const model = editorRef.current?.getModel();

    if (model && monacoRef.current) {
      monacoRef.current.editor.setModelLanguage(model, nextLanguage);
    }
  }

  function applyRemoteChanges(changes: CodeChange[]) {
    const model = editorRef.current?.getModel();

    if (!model || !monacoRef.current) {
      return;
    }

    applyingRemoteRef.current = true;
    model.pushEditOperations(
      [],
      changes.map((change) => {
        const start = model.getPositionAt(change.rangeOffset);
        const end = model.getPositionAt(change.rangeOffset + change.rangeLength);

        return {
          range: new monacoRef.current!.Range(start.lineNumber, start.column, end.lineNumber, end.column),
          text: change.text,
          forceMoveMarkers: true
        };
      }),
      () => null
    );
    applyingRemoteRef.current = false;

    const updatedCode = model.getValue();
    setCode(updatedCode);
    onRoomSnapshot({
      ...session.room,
      code: updatedCode,
      language
    });
  }

  function flushPendingChanges() {
    if (!socketRef.current?.connected || pendingChangesRef.current.length === 0) {
      return;
    }

    socketRef.current.emit("room:ops", {
      roomId: session.room.id,
      slug: session.room.slug,
      version: 0,
      changes: pendingChangesRef.current,
      clientId: clientIdRef.current
    });
    pendingChangesRef.current = [];
  }

  function scheduleFlush() {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
    }

    flushTimerRef.current = setTimeout(() => {
      flushPendingChanges();
    }, 110);
  }

  async function copyText(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast(successMessage);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      showToast("Clipboard access failed.");
    }
  }

  async function handleSaveRoom(input: {
    visibility: "public" | "private";
    password?: string;
    expiryHours: number;
    language: SupportedLanguage;
  }) {
    setOwnerBusy(true);

    try {
      const room = await onSaveRoom(input);
      onRoomSnapshot(room);
      updateLanguageState(room.language);
      setOwnerPanelOpen(false);
      showToast("Room settings saved.");
    } finally {
      setOwnerBusy(false);
    }
  }

  async function handleDeleteRoom() {
    setOwnerBusy(true);

    try {
      await onDeleteRoom();
      router.push("/");
    } finally {
      setOwnerBusy(false);
    }
  }

  function handleEditorMount(instance: editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
    editorRef.current = instance;
    monacoRef.current = monaco;

    const model = instance.getModel();

    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }

    instance.onDidChangeModelContent((event) => {
      if (applyingRemoteRef.current || session.accessLevel === "viewer") {
        return;
      }

      const nextCode = instance.getValue();
      setCode(nextCode);
      onRoomSnapshot({
        ...session.room,
        code: nextCode,
        language
      });

      pendingChangesRef.current.push(
        ...event.changes.map((change) => ({
          rangeOffset: change.rangeOffset,
          rangeLength: change.rangeLength,
          text: change.text
        }))
      );
      scheduleFlush();
    });
  }

  function handleLanguageChange(nextLanguage: SupportedLanguage) {
    updateLanguageState(nextLanguage);
    onRoomSnapshot({
      ...session.room,
      code,
      language: nextLanguage
    });
    socketRef.current?.emit("room:language", {
      roomId: session.room.id,
      language: nextLanguage
    });
  }

  return (
    <>
      <OwnerPanel
        key={`${session.room.updatedAt}-${session.room.visibility}-${session.room.language}`}
        open={ownerPanelOpen}
        room={{ ...session.room, code, language }}
        busy={ownerBusy}
        onClose={() => setOwnerPanelOpen(false)}
        onSave={handleSaveRoom}
        onDelete={handleDeleteRoom}
      />
      <ToastRack items={toasts} />
      <section className="container-shell py-8">
        {!connected && (
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-[color:var(--coral)]/40 bg-[color:var(--coral)]/10 px-4 py-3 text-sm text-[color:var(--coral)] backdrop-blur-md">
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              >
                <path d="m2 22 20-20" />
                <path d="M8.56 8.56A4 4 0 0 1 12 8v0a4 4 0 0 1 4 4v0c0 .5-.1.97-.27 1.41" />
                <path d="M22 12a10 10 0 0 0-4.87-8.66" />
                <path d="M2 12a10 10 0 0 0 5 8.66" />
                <path d="M12 16a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2z" />
              </svg>
              <span>
                <strong>Offline Mode:</strong> Connection lost. Changes will be buffered locally and synchronized when online.
              </span>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--coral)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--coral)]"></span>
            </span>
          </div>
        )}
        <div className="glass-panel rounded-[2rem] p-4 shadow-panel sm:p-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm font-medium">{session.room.slug}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-[color:var(--muted)]">
                {session.room.visibility}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-[color:var(--muted)]">
                {formatTimeRemaining(session.room.expiresAt)}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-[color:var(--muted)]">
                {users.length} active
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-[color:var(--muted)]">
                {connected ? "Connected" : "Reconnecting"}
              </span>
              {session.accessLevel === "viewer" ? (
                <span className="rounded-full border border-[color:var(--gold)] px-3 py-1 text-sm text-[color:var(--gold)]">
                  Read only
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={language}
                onChange={(event) => handleLanguageChange(event.target.value as SupportedLanguage)}
                disabled={session.accessLevel === "viewer"}
                className="form-select rounded-full border px-4 py-2 text-sm outline-none"
              >
                {SUPPORTED_LANGUAGES.map((item) => (
                  <option key={item} value={item}>
                    {getLanguageLabel(item)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => copyText(code, "Copied!")}
                className={`button-secondary px-4 py-2 flex items-center gap-2 transition-all duration-200 ${
                  copied ? "border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:var(--accent)]/10" : ""
                }`}
              >
                {copied ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {users.map((user) => (
              <span key={user.socketId} className="rounded-full border border-white/10 px-3 py-1 text-xs font-mono text-[color:var(--muted)]">
                {user.displayName}
              </span>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10">
            <MonacoEditor
              height="72vh"
              defaultLanguage={language}
              defaultValue={code}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                scrollbar: {
                  alwaysConsumeMouseWheel: false
                },
                padding: { top: 18, bottom: 18 },
                readOnly: session.accessLevel === "viewer"
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
