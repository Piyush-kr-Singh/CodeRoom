import type { RoomAccessLevel } from "@codeshare/shared";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export type AccessTokenPayload = {
  roomId: string;
  slug: string;
  accessLevel: RoomAccessLevel;
};

export function signAccessToken(payload: AccessTokenPayload, expiresAt: Date) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const roomExpirySeconds = Math.max(nowSeconds + 60, Math.floor(expiresAt.getTime() / 1000));

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: roomExpirySeconds - nowSeconds,
    subject: payload.roomId
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}
