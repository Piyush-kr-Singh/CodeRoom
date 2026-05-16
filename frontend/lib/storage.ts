const ownerKey = (slug: string) => `codeshare:owner:${slug}`;
const viewerKey = (slug: string) => `codeshare:viewer:${slug}`;
const themeKey = "codeshare:theme";
export const ROOM_OWNER_STATE_EVENT = "codeshare:owner-state";

function emitOwnerStateChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ROOM_OWNER_STATE_EVENT));
}

function safeGet(key: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(key) ?? "";
}

export function getOwnerToken(slug: string) {
  return safeGet(ownerKey(slug));
}

export function setOwnerToken(slug: string, value: string) {
  window.localStorage.setItem(ownerKey(slug), value);
  emitOwnerStateChange();
}

export function getViewerKey(slug: string) {
  return safeGet(viewerKey(slug));
}

export function setViewerKey(slug: string, value: string) {
  window.localStorage.setItem(viewerKey(slug), value);
}

export function clearRoomSecrets(slug: string) {
  window.localStorage.removeItem(ownerKey(slug));
  window.localStorage.removeItem(viewerKey(slug));
  emitOwnerStateChange();
}

export function getThemePreference() {
  return safeGet(themeKey) || "dark";
}

export function setThemePreference(theme: string) {
  window.localStorage.setItem(themeKey, theme);
}
