export const ROOM_VISIBILITIES = ["public", "private"] as const;
export const ROOM_ACCESS_LEVELS = ["owner", "editor", "viewer"] as const;
export const SUPPORTED_LANGUAGES = [
  "plaintext",
  "typescript",
  "javascript",
  "python",
  "java",
  "cpp",
  "go",
  "rust",
  "json",
  "markdown",
  "html",
  "css",
] as const;

export const DEFAULT_LANGUAGE = "plaintext";
export const DEFAULT_EXPIRY_HOURS = 24;
export const EXPIRY_PRESETS_HOURS = [1, 6, 12, 24, 72, 168] as const;

export type RoomVisibility = (typeof ROOM_VISIBILITIES)[number];
export type RoomAccessLevel = (typeof ROOM_ACCESS_LEVELS)[number];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type ExpirySelection =
  | {
      presetHours: number;
      customHours?: never;
    }
  | {
      presetHours: "custom";
      customHours: number;
    };

export type CodeChange = {
  rangeOffset: number;
  rangeLength: number;
  text: string;
};

export type RoomSnapshot = {
  id: string;
  slug: string;
  visibility: RoomVisibility;
  language: SupportedLanguage;
  code: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  viewerKey: string;
  readOnlyViewerUrl: string;
};

export type RoomMetadataResponse = {
  exists: boolean;
  slug: string;
  visibility?: RoomVisibility;
  expiresAt?: string;
};

export type RoomCreateRequest = {
  visibility: RoomVisibility;
  password?: string;
  expiryHours: number;
  language?: SupportedLanguage;
  initialCode?: string;
};

export type RoomAccessRequest = {
  password?: string;
  ownerToken?: string;
  viewerKey?: string;
};

export type RoomAccessResponse = {
  room: RoomSnapshot;
  accessToken: string;
  ownerToken?: string;
  accessLevel: RoomAccessLevel;
};

export type RoomSettingsRequest = {
  visibility: RoomVisibility;
  password?: string;
  expiryHours: number;
  language: SupportedLanguage;
};

export type RoomPresenceUser = {
  socketId: string;
  displayName: string;
  accessLevel: RoomAccessLevel;
};

export type SocketRoomPayload = {
  roomId: string;
  slug: string;
  code: string;
  language: SupportedLanguage;
  version: number;
};

export type SocketPresencePayload = {
  roomId: string;
  users: RoomPresenceUser[];
};

export type SocketCodeUpdatePayload = {
  roomId: string;
  slug: string;
  version: number;
  changes: CodeChange[];
  clientId: string;
};

export type SocketLanguageUpdatePayload = {
  roomId: string;
  language: SupportedLanguage;
};
