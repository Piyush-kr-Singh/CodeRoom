import { createServer } from "node:http";

import mongoose from "mongoose";

import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { RoomService } from "./services/room.service.js";
import { createSocketServer } from "./socket/socket-server.js";

async function bootstrap() {
  await mongoose.connect(env.MONGODB_URI);
  logger.info("MongoDB connected.");

  const roomService = new RoomService(env.CLIENT_URL);
  const app = buildApp(roomService);
  const httpServer = createServer(app);

  await createSocketServer(httpServer, roomService);

  httpServer.listen(env.PORT, () => {
    logger.info(`Backend listening on port ${env.PORT}.`);
  });
}

bootstrap().catch((error) => {
  logger.error("Backend failed to start", error);
  process.exit(1);
});
