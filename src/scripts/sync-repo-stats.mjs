#!/usr/bin/env node

import fs from "node:fs";
import fallbackRepositoryStats from "../data/repository_stats.json" with { type: "json" };

const dataDirectory = new URL("../data/", import.meta.url);
const targetFile = new URL("../data/repository_stats.json", import.meta.url);

const repos = [
  "hiero-consensus-node",
  "hiero-local-node",
  "hiero-mirror-node",
  "hiero-improvement-proposals",
  "hiero-sdk-js",
  "hiero-sdk-java",
  "hiero-json-rpc-relay",
  "hiero-sdk-go",
  "hiero-sdk-rust",
  "hiero-mirror-node-explorer",
  "hiero-cli",
  "solo",
  "hiero-block-node",
  "hiero-sdk-tck",
  "hiero-sdk-cpp",
  "governance",
  "hiero-sdk-python",
  "hiero-sdk-swift",
  "sdk-collaboration-hub",
  "tsc",
];
const repoSet = new Set(repos);

function createZeroStatsMap() {
  return new Map(repos.map(repo => [repo, { stars: 0 }]));
}

function toStatsMap(rawStats) {
  const stats = new Map();
  if (!rawStats || typeof rawStats !== "object" || Array.isArray(rawStats)) {
    return stats;
  }

  for (const [repo, repoStats] of Object.entries(rawStats)) {
    if (!repoSet.has(repo)) continue;
    if (!repoStats || typeof repoStats !== "object") continue;

    const stars = repoStats.stars;
    if (typeof stars === "number" && Number.isFinite(stars)) {
      stats.set(repo, { stars });
    }
  }

  return stats;
}

function toStatsObject(stats) {
  return Object.fromEntries(
    repos.map(repo => [repo, stats.get(repo) ?? { stars: 0 }]),
  );
}

function loadFallback(log = true) {
  const stats = toStatsMap(fallbackRepositoryStats);

  for (const repo of repos) {
    if (!stats.has(repo)) {
      stats.set(repo, { stars: 0 });
    }
  }

  if (stats.size > 0) {
    if (log) {
      console.warn("[sync-repo-stats] Using bundled repository stats cache.");
    }
    return toStatsObject(stats);
  }

  if (log) {
    console.warn(
      "[sync-repo-stats] No cached data available, writing empty stats.",
    );
  }

  return toStatsObject(createZeroStatsMap());
}

async function fetchFromGitHub() {
  const stats = new Map();
  const cachedStats = toStatsMap(loadFallback(false));
  const headers = {
    "User-Agent": "hiero-website-build",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  console.log(
    "[sync-repo-stats] Fetching repository statistics from GitHub...",
  );

  let successCount = 0;

  for (const repo of repos) {
    const response = await fetch(
      `https://api.github.com/repos/hiero-ledger/${repo}`,
      { headers },
    );
    if (response.ok) {
      const data = await response.json();
      stats.set(repo, { stars: data.stargazers_count });
      successCount += 1;
      console.log(`  ✓ ${repo}: ${data.stargazers_count} stars`);
    } else {
      const cachedStars = cachedStats.get(repo)?.stars;
      if (typeof cachedStars === "number") {
        stats.set(repo, { stars: cachedStars });
        console.warn(
          `  ⚠ ${repo}: API ${response.status}, using cached value ${cachedStars}`,
        );
      } else {
        stats.set(repo, { stars: 0 });
        console.warn(`  ✗ ${repo}: API responded with ${response.status}`);
      }
    }

    // If access is blocked/rate-limited and nothing has succeeded, stop early.
    if (
      (response.status === 401 || response.status === 403) &&
      successCount === 0
    ) {
      const resetAt = response.headers.get("x-ratelimit-reset");
      if (resetAt) {
        const resetTime = new Date(Number(resetAt) * 1000).toISOString();
        console.warn(
          `[sync-repo-stats] GitHub access currently limited; rate limit resets at ${resetTime}.`,
        );
      }
      break;
    }

    // Small delay to stay well within GitHub's rate limits.
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Ensure all repos exist in output, preferring cache over zeroes when available.
  for (const repo of repos) {
    if (stats.has(repo)) continue;
    const cachedStars = cachedStats.get(repo)?.stars;
    stats.set(repo, {
      stars: typeof cachedStars === "number" ? cachedStars : 0,
    });
  }

  return toStatsObject(stats);
}

async function run() {
  let stats;
  try {
    stats = await fetchFromGitHub();
  } catch (error) {
    console.warn(
      `[sync-repo-stats] GitHub fetch failed (${error.message}), falling back to cached data.`,
    );
    stats = loadFallback();
  }

  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.writeFileSync(targetFile, JSON.stringify(stats, null, 2));

  const totalStars = Object.values(stats).reduce((sum, r) => sum + r.stars, 0);
  console.log(
    `[sync-repo-stats] Done. Total stars: ${totalStars.toLocaleString()}`,
  );
}

run().catch(error => {
  console.error("[sync-repo-stats] Unexpected error:", error);
  process.exit(1);
});
