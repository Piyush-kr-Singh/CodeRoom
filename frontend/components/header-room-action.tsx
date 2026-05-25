"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LaunchRoomAction } from "@/components/launch-room-action";
import {
  ACTIVE_ROOM_OWNER_EVENT,
  emitRoomSettingsOpen,
  getActiveRoomOwner,
  type ActiveRoomOwnerEventDetail
} from "@/lib/room-events";
import { getOwnerToken, ROOM_OWNER_STATE_EVENT } from "@/lib/storage";

export function HeaderRoomAction() {
  const pathname = usePathname();
  const roomSlug = /^\/room\/([^/]+)$/.exec(pathname)?.[1] ?? "";
  const [isOwnerInOpenRoom, setIsOwnerInOpenRoom] = useState(false);

  useEffect(() => {
    if (!roomSlug) {
      setIsOwnerInOpenRoom(false);
      return;
    }

    setIsOwnerInOpenRoom(getActiveRoomOwner(roomSlug));

    function syncStoredOwnerState() {
      if (!getOwnerToken(roomSlug)) {
        setIsOwnerInOpenRoom(false);
      }
    }

    function handleActiveRoomOwner(event: Event) {
      const detail = (event as CustomEvent<ActiveRoomOwnerEventDetail>).detail;

      if (!detail || detail.slug !== roomSlug) {
        return;
      }

      setIsOwnerInOpenRoom(detail.isOwner);
    }

    window.addEventListener("storage", syncStoredOwnerState);
    window.addEventListener(ROOM_OWNER_STATE_EVENT, syncStoredOwnerState);
    window.addEventListener(ACTIVE_ROOM_OWNER_EVENT, handleActiveRoomOwner);

    return () => {
      window.removeEventListener("storage", syncStoredOwnerState);
      window.removeEventListener(ROOM_OWNER_STATE_EVENT, syncStoredOwnerState);
      window.removeEventListener(ACTIVE_ROOM_OWNER_EVENT, handleActiveRoomOwner);
    };
  }, [roomSlug]);

  if (!isOwnerInOpenRoom) {
    return (
      <LaunchRoomAction className="button-secondary px-4 py-2" ariaLabel="Open a new room">
        Open a room
      </LaunchRoomAction>
    );
  }

  return (
    <button
      type="button"
      onClick={() => emitRoomSettingsOpen({ slug: roomSlug })}
      className="button-secondary px-4 py-2"
    >
      Room settings
    </button>
  );
}
