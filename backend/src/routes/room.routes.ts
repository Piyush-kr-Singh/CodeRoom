import { Router } from "express";

import { createRoomController } from "../controllers/room.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { passwordAttemptLimiter, roomCreationLimiter } from "../middleware/rate-limit.js";
import { RoomService } from "../services/room.service.js";

export function createRoomRouter(roomService: RoomService) {
  const router = Router();
  const controller = createRoomController(roomService);

  router.get("/:slug/metadata", asyncHandler(controller.metadata));
  router.post("/:slug/create", roomCreationLimiter, asyncHandler(controller.create));
  router.post("/:slug/access", passwordAttemptLimiter, asyncHandler(controller.access));
  router.patch("/:slug/settings", asyncHandler(controller.update));
  router.delete("/:slug", asyncHandler(controller.destroy));

  return router;
}
