import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function generateOpaqueToken(size = 32) {
  return randomBytes(size).toString("base64url");
}

export function hashOpaqueToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function verifyOpaqueToken(token: string | undefined, hashedToken: string) {
  if (!token) {
    return false;
  }

  const incoming = Buffer.from(hashOpaqueToken(token), "utf8");
  const stored = Buffer.from(hashedToken, "utf8");

  if (incoming.length !== stored.length) {
    return false;
  }

  return timingSafeEqual(incoming, stored);
}
