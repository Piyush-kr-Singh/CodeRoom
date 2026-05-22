import { lstatSync, mkdirSync, realpathSync } from "node:fs";
import { rm, symlink } from "node:fs/promises";
import { dirname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");

const workspaceLinks = [{ packageName: "@codeshare/shared", relativeTarget: "shared" }];

function normalizeForCompare(pathValue) {
  return normalize(pathValue).replace(/[\\/]+$/, "").toLowerCase();
}

async function ensureWorkspaceLink(packageName, relativeTarget) {
  const expectedTarget = resolve(repoRoot, relativeTarget);
  const linkPath = join(repoRoot, "node_modules", ...packageName.split("/"));

  mkdirSync(dirname(linkPath), { recursive: true });

  try {
    const currentTarget = realpathSync(linkPath);

    if (normalizeForCompare(currentTarget) === normalizeForCompare(expectedTarget)) {
      return;
    }
  } catch {
    // Recreate the link below when the current target is missing or stale.
  }

  try {
    lstatSync(linkPath);
    await rm(linkPath, { recursive: true, force: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") {
      throw error;
    }
  }

  await symlink(expectedTarget, linkPath, "junction");
  console.log(`Re-linked ${packageName} -> ${expectedTarget}`);
}

try {
  for (const { packageName, relativeTarget } of workspaceLinks) {
    await ensureWorkspaceLink(packageName, relativeTarget);
  }
} catch (error) {
  console.error("Failed to ensure local workspace links.");
  console.error(error);
  process.exit(1);
}
