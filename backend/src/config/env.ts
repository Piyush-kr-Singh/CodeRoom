import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_URL: z.string().url().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  REDIS_URL: z.string().url().optional().or(z.literal("")),
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  ROOM_MAX_USERS: z.coerce.number().int().min(2).max(500).default(100),
  ROOM_INACTIVITY_MINUTES: z.coerce.number().int().min(15).max(1440).default(180),
  ROOM_MAX_EXPIRY_HOURS: z.coerce.number().int().min(1).max(720).default(168),
  ROOM_CREATION_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(60),
  ROOM_CREATION_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  PASSWORD_ATTEMPT_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
  PASSWORD_ATTEMPT_LIMIT_MAX: z.coerce.number().int().positive().default(30),
  GLOBAL_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(1),
  GLOBAL_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200)
});

export const env = envSchema.parse(process.env);
