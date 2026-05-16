import type { RoomAccessLevel, RoomPresenceUser, SupportedLanguage } from "@codeshare/shared";
import type { Socket } from "socket.io";

import { RoomService } from "../services/room.service.js";

type CollaborationState = {
  roomId: string;
  slug: string;
  code: string;
  language: SupportedLanguage;
  version: number;
  flushTimer?: NodeJS.Timeout;
};

type PresenceRecord = {
  roomId: string;
  slug: string;
  displayName: string;
  accessLevel: RoomAccessLevel;
};

export class CollaborationStore {
  private readonly roomStates = new Map<string, CollaborationState>();
  private readonly presence = new Map<string, PresenceRecord>();

  constructor(private readonly roomService: RoomService) {}

  seedRoom(roomId: string, slug: string, code: string, language: SupportedLanguage) {
    const existing = this.roomStates.get(roomId);

    if (existing) {
      return existing;
    }

    const state: CollaborationState = {
      roomId,
      slug,
      code,
      language,
      version: 0
    };

    this.roomStates.set(roomId, state);
    return state;
  }

  getRoomState(roomId: string) {
    return this.roomStates.get(roomId);
  }

  registerPresence(socket: Socket, payload: PresenceRecord) {
    this.presence.set(socket.id, payload);
  }

  unregisterPresence(socketId: string) {
    this.presence.delete(socketId);
  }

  getPresenceForRoom(roomId: string): RoomPresenceUser[] {
    return [...this.presence.entries()]
      .filter(([, entry]) => entry.roomId === roomId)
      .map(([socketId, entry]) => ({
        socketId,
        displayName: entry.displayName,
        accessLevel: entry.accessLevel
      }));
  }

  applyCodeUpdate(roomId: string, changes: { rangeOffset: number; rangeLength: number; text: string }[]) {
    const state = this.roomStates.get(roomId);

    if (!state) {
      return null;
    }

    state.code = this.roomService.applyChanges(state.code, changes);
    state.version += 1;
    this.scheduleFlush(roomId);

    return state;
  }

  applyLanguageUpdate(roomId: string, language: SupportedLanguage) {
    const state = this.roomStates.get(roomId);

    if (!state) {
      return null;
    }

    state.language = language;
    state.version += 1;
    this.scheduleFlush(roomId);

    return state;
  }

  async flushRoom(roomId: string) {
    const state = this.roomStates.get(roomId);

    if (!state) {
      return;
    }

    if (state.flushTimer) {
      clearTimeout(state.flushTimer);
      state.flushTimer = undefined;
    }

    await this.roomService.persistSnapshot(roomId, {
      code: state.code,
      language: state.language
    });
  }

  disposeRoom(roomId: string) {
    const state = this.roomStates.get(roomId);

    if (state?.flushTimer) {
      clearTimeout(state.flushTimer);
    }

    this.roomStates.delete(roomId);
  }

  private scheduleFlush(roomId: string) {
    const state = this.roomStates.get(roomId);

    if (!state) {
      return;
    }

    if (state.flushTimer) {
      clearTimeout(state.flushTimer);
    }

    state.flushTimer = setTimeout(() => {
      void this.flushRoom(roomId);
    }, 500);
  }
}
