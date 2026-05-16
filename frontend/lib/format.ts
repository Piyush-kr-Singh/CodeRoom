export function formatTimeRemaining(expiresAt: string) {
  const diffMs = new Date(expiresAt).getTime() - Date.now();

  if (diffMs <= 0) {
    return "Expired";
  }

  const totalHours = Math.floor(diffMs / (60 * 60 * 1000));
  const totalMinutes = Math.floor(diffMs / (60 * 1000));

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
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  return Math.max(1, Math.ceil(diffMs / (60 * 60 * 1000)));
}
