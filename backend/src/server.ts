import { createServer, type Server as HttpServer } from "node:http";

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

  const io = await createSocketServer(httpServer, roomService);

  httpServer.listen(env.PORT, () => {
    logger.info(`Backend listening on port ${env.PORT}.`);
  });

  setupGracefulShutdown(httpServer, io);
}

function setupGracefulShutdown(httpServer: HttpServer, io: Awaited<ReturnType<typeof createSocketServer>>) {
  let shuttingDown = false;

  async function shutdown(signal: string) {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logger.info(`Received ${signal}. Starting graceful shutdown.`);

    // Stop accepting new connections
    io.close();

    httpServer.close(async () => {
      logger.info("HTTP server closed.");

      try {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed.");
      } catch (error) {
        logger.error("Error closing MongoDB connection.", error);
      }

      process.exit(0);
    });

    // Force exit after 10 seconds if graceful shutdown hangs
    setTimeout(() => {
      logger.error("Graceful shutdown timed out. Forcing exit.");
      process.exit(1);
    }, 10_000).unref();
  }

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

bootstrap().catch((error) => {
  logger.error("Backend failed to start", error);
  process.exit(1);
});
