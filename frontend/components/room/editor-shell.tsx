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
  ssr: false
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
      showToast(successMessage);
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
              <button type="button" onClick={() => copyText(code, "Copied!")} className="button-secondary px-4 py-2">
                Copy Code
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
