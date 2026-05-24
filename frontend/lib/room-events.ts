export const ROOM_SETTINGS_OPEN_EVENT = "codeshare:open-owner-panel";
export const ACTIVE_ROOM_OWNER_EVENT = "codeshare:active-room-owner";

const activeRoomOwnerKey = (slug: string) => `codeshare:active-room-owner:${slug}`;

export type RoomSettingsOpenEventDetail = {
  slug: string;
};

export type ActiveRoomOwnerEventDetail = {
  slug: string;
  isOwner: boolean;
};

export function getActiveRoomOwner(slug: string) {
  if (typeof window === "undefined" || !slug) {
    return false;
  }

  return window.sessionStorage.getItem(activeRoomOwnerKey(slug)) === "1";
}

export function emitRoomSettingsOpen(detail: RoomSettingsOpenEventDetail) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ROOM_SETTINGS_OPEN_EVENT, { detail }));
}

export function emitActiveRoomOwner(detail: ActiveRoomOwnerEventDetail) {
  if (typeof window === "undefined") {
    return;
  }

  if (detail.isOwner) {
    window.sessionStorage.setItem(activeRoomOwnerKey(detail.slug), "1");
  } else {
    window.sessionStorage.removeItem(activeRoomOwnerKey(detail.slug));
  }

  window.dispatchEvent(new CustomEvent(ACTIVE_ROOM_OWNER_EVENT, { detail }));
}
