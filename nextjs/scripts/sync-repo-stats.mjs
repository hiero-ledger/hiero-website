#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.join(__dirname, "..", "data", "repository_stats.json");
const fallbackFile = path.join(__dirname, "..", "..", "data", "repository_stats.json");

const repos = [
  "hiero-consensus-node", "hiero-local-node", "hiero-mirror-node",
  "hiero-improvement-proposals", "hiero-sdk-js", "hiero-sdk-java",
  "hiero-json-rpc-relay", "hiero-sdk-go", "hiero-sdk-rust",
  "hiero-mirror-node-explorer", "hiero-cli", "solo", "hiero-block-node",
  "hiero-sdk-tck", "hiero-sdk-cpp", "governance", "hiero-sdk-python",
  "hiero-sdk-swift", "sdk-collaboration-hub", "tsc",
];

async function fetchFromGitHub() {
  const stats = new Map();
  const headers = { "User-Agent": "hiero-website-build" };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  console.log("[sync-repo-stats] Fetching repository statistics from GitHub...");

  for (const repo of repos) {
    const response = await fetch(`https://api.github.com/repos/hiero-ledger/${repo}`, { headers });
    if (response.ok) {
      const data = await response.json();
      stats.set(repo, { stars: data.stargazers_count });
      console.log(`  ✓ ${repo}: ${data.stargazers_count} stars`);
    } else {
      stats.set(repo, { stars: 0 });
      console.warn(`  ✗ ${repo}: API responded with ${response.status}`);
    }
    // Small delay to stay well within GitHub's rate limits.
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return Object.fromEntries(stats);
}

function loadFallback() {
  for (const file of [targetFile, fallbackFile]) {
    if (fs.existsSync(file)) {
      console.warn(`[sync-repo-stats] Using cached data from ${file}`);
      return JSON.parse(fs.readFileSync(file, "utf8"));
    }
  }
  console.warn("[sync-repo-stats] No cached data available — writing empty stats.");
  return Object.fromEntries(repos.map((r) => [r, { stars: 0 }]));
}

async function run() {
  let stats;
  try {
    stats = await fetchFromGitHub();
  } catch (error) {
    console.warn(`[sync-repo-stats] GitHub fetch failed (${error.message}), falling back to cached data.`);
    stats = loadFallback();
  }

  const dataDir = path.dirname(targetFile);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(targetFile, JSON.stringify(stats, null, 2));

  const totalStars = Object.values(stats).reduce((sum, r) => sum + r.stars, 0);
  console.log(`[sync-repo-stats] Done. Total stars: ${totalStars.toLocaleString()}`);
}

run().catch((error) => {
  console.error("[sync-repo-stats] Unexpected error:", error);
  process.exit(1);
});
