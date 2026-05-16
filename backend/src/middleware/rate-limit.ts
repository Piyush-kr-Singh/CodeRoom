import rateLimit from "express-rate-limit";

import { env } from "../config/env.js";

export const globalLimiter = rateLimit({
  windowMs: env.GLOBAL_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  limit: env.GLOBAL_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false
});

export const roomCreationLimiter = rateLimit({
  windowMs: env.ROOM_CREATION_LIMIT_WINDOW_MINUTES * 60 * 1000,
  limit: env.ROOM_CREATION_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many rooms created from this IP. Please try again later."
  }
});

export const passwordAttemptLimiter = rateLimit({
  windowMs: env.PASSWORD_ATTEMPT_LIMIT_WINDOW_MINUTES * 60 * 1000,
  limit: env.PASSWORD_ATTEMPT_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many access attempts from this IP. Please slow down."
  }
});
