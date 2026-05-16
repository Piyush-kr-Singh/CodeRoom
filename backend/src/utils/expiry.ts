import { DEFAULT_EXPIRY_HOURS } from "@codeshare/shared";

export function normalizeExpiryHours(expiryHours: number, maxExpiryHours: number) {
  if (!Number.isFinite(expiryHours)) {
    return DEFAULT_EXPIRY_HOURS;
  }

  return Math.max(1, Math.min(Math.floor(expiryHours), maxExpiryHours));
}

export function buildExpiryDate(expiryHours: number) {
  return new Date(Date.now() + expiryHours * 60 * 60 * 1000);
}

export function buildInactiveDeleteDate(inactivityMinutes: number) {
  return new Date(Date.now() + inactivityMinutes * 60 * 1000);
}
