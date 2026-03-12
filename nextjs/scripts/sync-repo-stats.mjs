#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.join(__dirname, "..", "..", "data", "repository_stats.json");
const targetFile = path.join(__dirname, "..", "data", "repository_stats.json");

function syncRepoStats() {
  if (!fs.existsSync(sourceFile)) {
    console.warn("[sync-repo-stats] Source file not found, skipping sync:", sourceFile);
    return;
  }

  const sourceJson = fs.readFileSync(sourceFile, "utf8");

  // Validate JSON before writing, so bad source data does not break the app silently.
  JSON.parse(sourceJson);

  fs.writeFileSync(targetFile, sourceJson);
  console.log("[sync-repo-stats] Synced repository_stats.json to nextjs/data");
}

try {
  syncRepoStats();
} catch (error) {
  console.error("[sync-repo-stats] Failed:", error);
  process.exit(1);
}
