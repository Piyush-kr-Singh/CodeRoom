import { existsSync, mkdirSync, readdirSync, statSync, watch } from "node:fs";
import { writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const mode = process.argv[2];
const rawExtraArgs = process.argv.slice(3);
const extraArgs =
  rawExtraArgs.length === 1 && /^\d+$/.test(rawExtraArgs[0]) ? ["--port", rawExtraArgs[0]] : rawExtraArgs;

if (!mode || !["dev", "build", "start"].includes(mode)) {
  console.error("Usage: node scripts/run-next.mjs <dev|build|start> [...next args]");
  process.exit(1);
}

const frontendDir = process.cwd();
const require = createRequire(import.meta.url);
const nextCli = require.resolve("next/dist/bin/next", { paths: [frontendDir] });
const nextDir = join(frontendDir, ".next");
const nextServerDir = join(nextDir, "server");
const nextChunksDir = join(nextServerDir, "chunks");
const bridgedFiles = new Set();

async function ensureChunkBridges() {
  if (!existsSync(nextChunksDir)) {
    return;
  }

  mkdirSync(nextServerDir, { recursive: true });

  for (const entry of readdirSync(nextChunksDir)) {
    if (!entry.endsWith(".js")) {
      continue;
    }

    const sourcePath = join(nextChunksDir, entry);

    if (!statSync(sourcePath).isFile()) {
      continue;
    }

    const bridgePath = join(nextServerDir, entry);
    const bridgeSource = `module.exports = require("./chunks/${entry}");\n`;

    await writeFile(bridgePath, bridgeSource, "utf8");
    bridgedFiles.add(bridgePath);
  }
}

async function removeChunkBridges() {
  await Promise.all(
    [...bridgedFiles].map(async (filePath) => {
      try {
        await unlink(filePath);
      } catch {
        // Ignore cleanup failures for generated bridge files.
      }
    })
  );
}

let stopWatching = () => {};

function startBridgeSync() {
  let intervalId = setInterval(() => {
    void ensureChunkBridges();
  }, 500);

  let chunkWatcher = null;
  let nextWatcher = null;

  if (existsSync(nextChunksDir)) {
    chunkWatcher = watch(nextChunksDir, () => {
      void ensureChunkBridges();
    });
  } else if (existsSync(nextDir)) {
    nextWatcher = watch(nextDir, { recursive: true }, (_eventType, filename) => {
      if (typeof filename === "string" && filename.startsWith("server\\chunks")) {
        void ensureChunkBridges();
      }
    });
  }

  stopWatching = () => {
    clearInterval(intervalId);
    intervalId = null;
    chunkWatcher?.close();
    nextWatcher?.close();
  };
}

if (mode !== "build") {
  startBridgeSync();
}

void ensureChunkBridges();

const child = spawn(process.execPath, [nextCli, mode, ...extraArgs], {
  cwd: frontendDir,
  stdio: "inherit",
  shell: false
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal);
  });
}

child.on("exit", async (code, signal) => {
  stopWatching();

  if (mode === "build" && code === 0) {
    await ensureChunkBridges();
  }

  if (mode !== "build") {
    await removeChunkBridges();
  }

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", async (error) => {
  stopWatching();
  await removeChunkBridges();
  console.error(error);
  process.exit(1);
});
