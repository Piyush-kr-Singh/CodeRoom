import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { globalLimiter } from "./middleware/rate-limit.js";
import { createRoomRouter } from "./routes/room.routes.js";
import { RoomService } from "./services/room.service.js";

export function buildApp(roomService = new RoomService(env.CLIENT_URL)) {
  const app = express();

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true
    })
  );
  app.use(helmet());
  app.use(globalLimiter);
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      uptime: process.uptime()
    });
  });

  app.use("/api/rooms", createRoomRouter(roomService));
  app.use((_request, response) => {
    response.status(404).json({
      message: "Not found."
    });
  });
  app.use(errorHandler);

  return app;
}
