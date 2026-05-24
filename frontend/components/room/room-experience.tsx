"use client";

import {
  DEFAULT_LANGUAGE,
  isReservedRoomSlug,
  type RoomAccessResponse,
  type RoomSnapshot,
  type SupportedLanguage
} from "@codeshare/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { accessRoom, ApiError, createRoom, deleteRoom, getRoomMetadata, updateRoomSettings } from "@/lib/api";
import { emitActiveRoomOwner } from "@/lib/room-events";
import { clearRoomSecrets, getOwnerToken, getViewerKey, setOwnerToken, setViewerKey } from "@/lib/storage";

import { EditorShell } from "./editor-shell";
import { RoomGate } from "./room-gate";

type RoomExperienceProps = {
  slug: string;
};

export function RoomExperience({ slug }: RoomExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewerFromUrl = searchParams.get("viewer") ?? "";
  const isLauncherSlug = isReservedRoomSlug(slug);

  const [session, setSession] = useState<RoomAccessResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [gateMode, setGateMode] = useState<"create" | "password" | null>(null);
  const [error, setError] = useState("");
  const [defaultLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [viewerLink, setViewerLink] = useState("");
  const activeRoomSlug = session?.room.slug ?? slug;

  useEffect(() => {
    void hydrateRoom();
  }, [slug, viewerFromUrl]);

  useEffect(() => {
    const viewerKey = getViewerKey(activeRoomSlug);
    setViewerLink(viewerKey ? `${window.location.origin}/room/${activeRoomSlug}?viewer=${viewerKey}` : "");
  }, [activeRoomSlug, session?.room.viewerKey]);

  useEffect(() => {
    emitActiveRoomOwner({
      slug: activeRoomSlug,
      isOwner: session?.accessLevel === "owner"
    });

    return () => {
      emitActiveRoomOwner({
        slug: activeRoomSlug,
        isOwner: false
      });
    };
  }, [activeRoomSlug, session?.accessLevel, slug]);

  async function hydrateRoom() {
    setBusy(true);
    setError("");

    try {
      const metadata = await getRoomMetadata(slug);
      const storedOwnerToken = getOwnerToken(slug);
      const storedViewerKey = viewerFromUrl || getViewerKey(slug);

      if (!metadata.exists) {
        setGateMode("create");
        return;
      }

      if (storedViewerKey || storedOwnerToken || metadata.visibility === "public") {
        try {
          const access = await accessRoom(slug, {
            ownerToken: storedOwnerToken || undefined,
            viewerKey: storedViewerKey || undefined
          });

          handleSession(access);
          return;
        } catch (accessError) {
          const shouldPromptForPassword =
            !(accessError instanceof ApiError) || (accessError instanceof ApiError && accessError.status === 401);

          if (shouldPromptForPassword) {
            setGateMode(metadata.visibility === "private" ? "password" : null);
          } else {
            throw accessError;
          }
        }
      }

      setGateMode(metadata.visibility === "private" ? "password" : null);

      if (metadata.visibility === "public") {
        const access = await accessRoom(slug, {});
        handleSession(access);
      }
    } catch (roomError) {
      setError(roomError instanceof Error ? roomError.message : "Unable to open room.");
    } finally {
      setBusy(false);
    }
  }

  function handleSession(access: RoomAccessResponse) {
    const roomSlug = access.room.slug;

    if (access.ownerToken) {
      setOwnerToken(roomSlug, access.ownerToken);
    }

    if (access.room.viewerKey) {
      setViewerKey(roomSlug, access.room.viewerKey);
    }

    if (typeof window !== "undefined") {
      const storedViewerKey = access.room.viewerKey || getViewerKey(roomSlug);
      setViewerLink(storedViewerKey ? `${window.location.origin}/room/${roomSlug}?viewer=${storedViewerKey}` : "");
    }

    setSession(access);
    setGateMode(null);
    setError("");
  }

  async function handleCreate(input: {
    visibility: "public" | "private";
    password?: string;
    expiryHours: number;
    language: SupportedLanguage;
  }) {
    setBusy(true);
    setError("");

    try {
      const access = await createRoom(slug, input);
      handleSession(access);

      if (access.room.slug !== slug) {
        router.replace(`/room/${access.room.slug}`);
      }
    } catch (roomError) {
      setError(roomError instanceof Error ? roomError.message : "Failed to create room.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordAccess(password: string) {
    setBusy(true);
    setError("");

    try {
      const access = await accessRoom(slug, {
        password
      });
      handleSession(access);
    } catch (roomError) {
      setError(roomError instanceof Error ? roomError.message : "Failed to unlock room.");
    } finally {
      setBusy(false);
    }
  }

  function handleCloseCreateGate() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  async function handleSaveRoom(input: {
    visibility: "public" | "private";
    password?: string;
    expiryHours: number;
    language: SupportedLanguage;
  }) {
    const ownerToken = getOwnerToken(activeRoomSlug);

    if (!ownerToken) {
      throw new Error("Owner token missing on this device.");
    }

    const response = await updateRoomSettings(activeRoomSlug, input, ownerToken);
    const storedViewerKey = getViewerKey(activeRoomSlug);
    const nextRoom = {
      ...response.room,
      viewerKey: storedViewerKey,
      readOnlyViewerUrl: storedViewerKey ? `${window.location.origin}/room/${activeRoomSlug}?viewer=${storedViewerKey}` : ""
    };

    setSession((current) => (current ? { ...current, room: nextRoom } : current));
    setViewerLink(nextRoom.readOnlyViewerUrl);
    return nextRoom;
  }

  async function handleDeleteRoom() {
    const ownerToken = getOwnerToken(activeRoomSlug);

    if (!ownerToken) {
      throw new Error("Owner token missing on this device.");
    }

    await deleteRoom(activeRoomSlug, ownerToken);
    clearRoomSecrets(activeRoomSlug);
    router.push("/");
  }

  function handleRoomSnapshot(room: RoomSnapshot) {
    setSession((current) => (current ? { ...current, room } : current));
  }

  return (
    <>
      <RoomGate
        mode={gateMode}
        slug={slug}
        busy={busy}
        error={error}
        defaultLanguage={defaultLanguage}
        onCloseCreate={handleCloseCreateGate}
        onCreate={handleCreate}
        onPasswordAccess={handlePasswordAccess}
      />
      {session ? (
        <EditorShell
          session={session}
          onSaveRoom={handleSaveRoom}
          onDeleteRoom={handleDeleteRoom}
          onRoomSnapshot={handleRoomSnapshot}
        />
      ) : (
        <section className="container-shell py-24">
          <div className="glass-panel rounded-[2rem] p-8">
            <h1 className="text-3xl font-semibold">
              {isLauncherSlug ? "Preparing a new room" : `Preparing room \`${slug}\``}
            </h1>
            <p className="body-copy mt-4">
              {error || "Checking room privacy and loading the live collaboration environment."}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
