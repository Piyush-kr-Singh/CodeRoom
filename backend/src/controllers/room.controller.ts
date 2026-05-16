import type { Request, Response } from "express";

import { RoomService } from "../services/room.service.js";

function getOwnerToken(request: Request) {
  return request.header("x-owner-token") ?? request.body?.ownerToken;
}

function getSlug(request: Request) {
  return String(request.params.slug ?? "");
}

export function createRoomController(roomService: RoomService) {
  return {
    metadata: async (request: Request, response: Response) => {
      const metadata = await roomService.getMetadata(getSlug(request));
      response.json(metadata);
    },
    create: async (request: Request, response: Response) => {
      const room = await roomService.createRoom(getSlug(request), request.body);
      response.status(201).json(room);
    },
    access: async (request: Request, response: Response) => {
      const room = await roomService.accessRoom(getSlug(request), request.body);
      response.json(room);
    },
    update: async (request: Request, response: Response) => {
      const room = await roomService.updateRoomSettings(getSlug(request), request.body, getOwnerToken(request));
      response.json({ room });
    },
    destroy: async (request: Request, response: Response) => {
      await roomService.deleteRoom(getSlug(request), getOwnerToken(request));
      response.status(204).send();
    }
  };
}
