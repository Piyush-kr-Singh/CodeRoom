import { config } from "dotenv";
import { z } from "zod";

config();

function normalizeAdminRoutePath(value: string) {
  const trimmed = value.trim();
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const normalized = withLeadingSlash.replace(/\/+$/, "");

  if (normalized === "/" || !/^\/[a-z0-9/_-]+$/i.test(normalized)) {
    throw new Error(
      "ADMIN_ROUTE_PATH must start with / and only include letters, numbers, slashes, hyphens, and underscores."
    );
  }

  return normalized;
}

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
  GLOBAL_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
  ADMIN_ROUTE_PATH: z
    .string()
    .default("/ops-console")
    .transform((value, ctx) => {
      try {
        return normalizeAdminRoutePath(value);
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: error instanceof Error ? error.message : "Invalid ADMIN_ROUTE_PATH."
        });

        return z.NEVER;
      }
    }),
  ADMIN_USERNAME: z.string().trim().max(120).default(""),
  ADMIN_PASSWORD: z.string().max(256).default(""),
  ADMIN_AUTH_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
  ADMIN_AUTH_LIMIT_MAX: z.coerce.number().int().positive().default(10)
}).superRefine((value, ctx) => {
  const hasAdminUsername = value.ADMIN_USERNAME.length > 0;
  const hasAdminPassword = value.ADMIN_PASSWORD.length > 0;

  if (hasAdminUsername !== hasAdminPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["ADMIN_USERNAME"],
      message: "ADMIN_USERNAME and ADMIN_PASSWORD must either both be set or both be left blank."
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["ADMIN_PASSWORD"],
      message: "ADMIN_USERNAME and ADMIN_PASSWORD must either both be set or both be left blank."
    });
  }

  if (hasAdminUsername && value.ADMIN_USERNAME.length < 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["ADMIN_USERNAME"],
      message: "ADMIN_USERNAME must be at least 4 characters when admin auth is enabled."
    });
  }

  if (hasAdminPassword && value.ADMIN_PASSWORD.length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["ADMIN_PASSWORD"],
      message: "ADMIN_PASSWORD must be at least 6 characters when admin auth is enabled."
    });
  }
});

export const env = envSchema.parse(process.env);
export const isAdminConfigured = env.ADMIN_USERNAME.length > 0 && env.ADMIN_PASSWORD.length > 0;
