"use client";

import { DEFAULT_LANGUAGE, type RoomAccessResponse, type RoomSnapshot, type SupportedLanguage } from "@codeshare/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { accessRoom, ApiError, createRoom, deleteRoom, getRoomMetadata, updateRoomSettings } from "@/lib/api";
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

  const [session, setSession] = useState<RoomAccessResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [gateMode, setGateMode] = useState<"create" | "password" | null>(null);
  const [error, setError] = useState("");
  const [defaultLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [viewerLink, setViewerLink] = useState("");

  useEffect(() => {
    void hydrateRoom();
  }, [slug, viewerFromUrl]);

  useEffect(() => {
    const viewerKey = getViewerKey(slug);
    setViewerLink(viewerKey ? `${window.location.origin}/room/${slug}?viewer=${viewerKey}` : "");
  }, [slug, session?.room.viewerKey]);

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
    if (access.ownerToken) {
      setOwnerToken(slug, access.ownerToken);
    }

    if (access.room.viewerKey) {
      setViewerKey(slug, access.room.viewerKey);
    }

    if (typeof window !== "undefined") {
      const storedViewerKey = access.room.viewerKey || getViewerKey(slug);
      setViewerLink(storedViewerKey ? `${window.location.origin}/room/${slug}?viewer=${storedViewerKey}` : "");
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

  async function handleSaveRoom(input: {
    visibility: "public" | "private";
    password?: string;
    expiryHours: number;
    language: SupportedLanguage;
  }) {
    const ownerToken = getOwnerToken(slug);

    if (!ownerToken) {
      throw new Error("Owner token missing on this device.");
    }

    const response = await updateRoomSettings(slug, input, ownerToken);
    const storedViewerKey = getViewerKey(slug);
    const nextRoom = {
      ...response.room,
      viewerKey: storedViewerKey,
      readOnlyViewerUrl: storedViewerKey ? `${window.location.origin}/room/${slug}?viewer=${storedViewerKey}` : ""
    };

    setSession((current) => (current ? { ...current, room: nextRoom } : current));
    setViewerLink(nextRoom.readOnlyViewerUrl);
    return nextRoom;
  }

  async function handleDeleteRoom() {
    const ownerToken = getOwnerToken(slug);

    if (!ownerToken) {
      throw new Error("Owner token missing on this device.");
    }

    await deleteRoom(slug, ownerToken);
    clearRoomSecrets(slug);
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
            <h1 className="text-3xl font-semibold">Preparing room `{slug}`</h1>
            <p className="body-copy mt-4">
              {error || "Checking room privacy and loading the live collaboration environment."}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
