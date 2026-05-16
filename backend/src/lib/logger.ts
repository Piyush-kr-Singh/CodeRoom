type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: unknown) {
  const payload = meta ? ` ${JSON.stringify(meta)}` : "";
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${payload}`;

  if (level === "error") {
    console.error(line);
    return;
  }

  console.log(line);
}

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta)
};
