type LogLevel = "info" | "warn" | "error";

const isProduction = process.env.NODE_ENV === "production";

function formatJson(level: LogLevel, message: string, meta?: unknown): string {
  const entry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message
  };

  if (meta !== undefined) {
    if (meta instanceof Error) {
      entry.error = {
        name: meta.name,
        message: meta.message,
        stack: meta.stack
      };
    } else {
      entry.meta = meta;
    }
  }

  return JSON.stringify(entry);
}

function formatDev(level: LogLevel, message: string, meta?: unknown): string {
  const payload = meta ? ` ${JSON.stringify(meta)}` : "";
  return `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}${payload}`;
}

function log(level: LogLevel, message: string, meta?: unknown) {
  const line = isProduction ? formatJson(level, message, meta) : formatDev(level, message, meta);

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
