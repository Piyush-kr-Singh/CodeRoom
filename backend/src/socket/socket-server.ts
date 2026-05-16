import type { SocketCodeUpdatePayload, SocketLanguageUpdatePayload, SupportedLanguage } from "@codeshare/shared";
import { createAdapter } from "@socket.io/redis-adapter";
import type { Server as HttpServer } from "node:http";
import { createClient } from "redis";
import { Server } from "socket.io";

import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { RoomService } from "../services/room.service.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { generateDisplayName } from "../utils/random-name.js";
import { CollaborationStore } from "./collaboration-store.js";

type SocketAuth = {
  accessToken?: string;
  clientId?: string;
};

function roomChannel(roomId: string) {
  return `room:${roomId}`;
}

export async function createSocketServer(httpServer: HttpServer, roomService: RoomService) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true
    }
  });

  if (env.REDIS_URL) {
    const publisher = createClient({ url: env.REDIS_URL });
    const subscriber = publisher.duplicate();

    await Promise.all([publisher.connect(), subscriber.connect()]);
    io.adapter(createAdapter(publisher, subscriber));
    logger.info("Socket.io Redis adapter connected.");
  }

  const collaborationStore = new CollaborationStore(roomService);

  io.use(async (socket, next) => {
    try {
      const auth = socket.handshake.auth as SocketAuth;

      if (!auth.accessToken) {
        next(new Error("Access token required."));
        return;
      }

      const payload = verifyAccessToken(auth.accessToken);
      const room = await roomService.getRoomById(payload.roomId);

      if (!room || room.slug !== payload.slug) {
        next(new Error("Room not found."));
        return;
      }

      const socketsInRoom = await io.in(roomChannel(room._id.toString())).allSockets();

      if (socketsInRoom.size >= env.ROOM_MAX_USERS) {
        next(new Error("Room is full."));
        return;
      }

      socket.data.roomId = room._id.toString();
      socket.data.slug = room.slug;
      socket.data.accessLevel = payload.accessLevel;
      socket.data.clientId = auth.clientId ?? socket.id;
      socket.data.displayName = generateDisplayName();
      socket.data.roomState = collaborationStore.seedRoom(
        room._id.toString(),
        room.slug,
        room.code,
        room.language as SupportedLanguage
      );

      next();
    } catch (error) {
      next(error as Error);
    }
  });

  io.on("connection", async (socket) => {
    const state = socket.data.roomState as ReturnType<CollaborationStore["seedRoom"]>;
    const currentRoomId = socket.data.roomId as string;
    const currentSlug = socket.data.slug as string;

    await socket.join(roomChannel(currentRoomId));
    collaborationStore.registerPresence(socket, {
      roomId: currentRoomId,
      slug: currentSlug,
      displayName: socket.data.displayName as string,
      accessLevel: socket.data.accessLevel
    });
    await roomService.touchRoom(currentRoomId);

    socket.emit("room:snapshot", {
      roomId: state.roomId,
      slug: state.slug,
      code: state.code,
      language: state.language,
      version: state.version
    });

    io.to(roomChannel(currentRoomId)).emit("room:presence", {
      roomId: currentRoomId,
      users: collaborationStore.getPresenceForRoom(currentRoomId)
    });

    socket.on("room:ops", async (payload: SocketCodeUpdatePayload) => {
      if (socket.data.accessLevel === "viewer") {
        return;
      }

      if (payload.roomId !== currentRoomId || !Array.isArray(payload.changes) || payload.changes.length === 0) {
        return;
      }

      const updatedState = collaborationStore.applyCodeUpdate(currentRoomId, payload.changes);

      if (!updatedState) {
        return;
      }

      await roomService.touchRoom(currentRoomId);

      socket.to(roomChannel(currentRoomId)).emit("room:ops", {
        roomId: currentRoomId,
        slug: currentSlug,
        version: updatedState.version,
        changes: payload.changes,
        clientId: socket.data.clientId
      });
    });

    socket.on("room:language", async (payload: SocketLanguageUpdatePayload) => {
      if (socket.data.accessLevel === "viewer") {
        return;
      }

      if (payload.roomId !== currentRoomId) {
        return;
      }

      const updatedState = collaborationStore.applyLanguageUpdate(currentRoomId, payload.language);

      if (!updatedState) {
        return;
      }

      await roomService.touchRoom(currentRoomId);

      io.to(roomChannel(currentRoomId)).emit("room:language", {
        roomId: currentRoomId,
        language: updatedState.language
      });
    });

    socket.on("room:resync", () => {
      const latestState = collaborationStore.getRoomState(currentRoomId);

      if (!latestState) {
        return;
      }

      socket.emit("room:snapshot", {
        roomId: latestState.roomId,
        slug: latestState.slug,
        code: latestState.code,
        language: latestState.language,
        version: latestState.version
      });
    });

    socket.on("disconnect", async () => {
      collaborationStore.unregisterPresence(socket.id);
      io.to(roomChannel(currentRoomId)).emit("room:presence", {
        roomId: currentRoomId,
        users: collaborationStore.getPresenceForRoom(currentRoomId)
      });

      if (collaborationStore.getPresenceForRoom(currentRoomId).length === 0) {
        await collaborationStore.flushRoom(currentRoomId);
        collaborationStore.disposeRoom(currentRoomId);
      }
    });
  });

  return io;
}
