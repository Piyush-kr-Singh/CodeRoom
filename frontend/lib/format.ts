const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

function getRemainingMs(expiresAt: string) {
  return new Date(expiresAt).getTime() - Date.now();
}

function getRemainingWholeHours(expiresAt: string) {
  return Math.floor(getRemainingMs(expiresAt) / HOUR_MS);
}

export function formatTimeRemaining(expiresAt: string) {
  const diffMs = getRemainingMs(expiresAt);

  if (diffMs <= 0) {
    return "Expired";
  }

  const totalHours = getRemainingWholeHours(expiresAt);
  const totalMinutes = Math.floor(diffMs / MINUTE_MS);

  if (totalHours >= 24) {
    const days = Math.ceil(totalHours / 24);
    return `${days}d left`;
  }

  if (totalHours >= 1) {
    return `${totalHours}h left`;
  }

  return `${Math.max(totalMinutes, 1)}m left`;
}

export function estimateHoursRemaining(expiresAt: string) {
  return Math.max(1, getRemainingWholeHours(expiresAt));
}
