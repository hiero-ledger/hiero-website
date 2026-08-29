#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import prettier from "prettier";
import fallbackRepositoryStats from "../data/repository_stats.json" with { type: "json" };
import fallbackOrganizationStats from "../data/organization_stats.json" with { type: "json" };

const dataDirectory = "src/data";
const targetFile = "src/data/repository_stats.json";
const organizationTargetFile = "src/data/organization_stats.json";

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

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStars(repoStats) {
  if (!isRecord(repoStats)) return null;
  const { stars } = repoStats;
  return typeof stars === "number" && Number.isFinite(stars) ? stars : null;
}

function toStatsMap(rawStats) {
  const stats = new Map();
  if (!isRecord(rawStats)) return stats;

  for (const [repo, repoStats] of Object.entries(rawStats)) {
    const stars = repoSet.has(repo) ? getStars(repoStats) : null;
    if (stars !== null) stats.set(repo, { stars });
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

async function formatStatsForFile(stats, filePath = targetFile) {
  let formatted = `${JSON.stringify(stats, null, 2)}\n`;

  try {
    const prettierConfig = await prettier.resolveConfig(filePath);
    formatted = await prettier.format(JSON.stringify(stats), {
      ...(prettierConfig ?? {}),
      parser: "json",
      filepath: filePath,
    });
  } catch (error) {
    console.warn(
      `[sync-repo-stats] Prettier formatting failed (${error.message}), using fallback formatting.`,
    );
  }

  if (!formatted.endsWith("\n")) {
    formatted += "\n";
  }

  return formatted;
}

async function writeIfChanged(content, filePath = targetFile) {
  try {
    const existingContent = await readFile(filePath, "utf8");
    if (existingContent === content) {
      return false;
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  await writeFile(filePath, content);
  return true;
}

function isValidOrganizationStats(value) {
  return (
    isRecord(value) &&
    Number.isFinite(value.publicRepositories) &&
    Number.isFinite(value.totalStars)
  );
}

function loadOrganizationFallback() {
  if (isValidOrganizationStats(fallbackOrganizationStats)) {
    console.warn("[sync-repo-stats] Using bundled organization stats cache.");
    return {
      publicRepositories: fallbackOrganizationStats.publicRepositories,
      totalStars: fallbackOrganizationStats.totalStars,
    };
  }

  console.warn(
    "[sync-repo-stats] No cached organization data available, writing zeroes.",
  );
  return { publicRepositories: 0, totalStars: 0 };
}

/**
 * The hero's headline facts cover the whole hiero-ledger organization, not
 * just the curated grid list above, so the two numbers can never describe
 * different repo sets: both come from one listing of every public repository.
 */
async function fetchOrganizationStats(headers) {
  console.log(
    "[sync-repo-stats] Fetching organization statistics from GitHub...",
  );

  let publicRepositories = 0;
  let totalStars = 0;

  for (let page = 1; ; page += 1) {
    const response = await fetch(
      `https://api.github.com/orgs/hiero-ledger/repos?type=public&per_page=100&page=${page}`,
      { headers },
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const pageRepos = await response.json();
    if (!Array.isArray(pageRepos)) {
      throw new Error("GitHub API returned an unexpected payload");
    }

    publicRepositories += pageRepos.length;
    totalStars += pageRepos.reduce(
      (sum, repo) => sum + (repo.stargazers_count ?? 0),
      0,
    );

    if (pageRepos.length < 100) break;
  }

  console.log(
    `  ✓ hiero-ledger: ${publicRepositories} public repositories, ${totalStars.toLocaleString()} stars`,
  );

  return { publicRepositories, totalStars };
}

function buildHeaders() {
  const headers = {
    "User-Agent": "hiero-website-build",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchFromGitHub() {
  const stats = new Map();
  const cachedStats = toStatsMap(loadFallback(false));
  const headers = buildHeaders();

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

  let organizationStats;
  try {
    organizationStats = await fetchOrganizationStats(buildHeaders());
  } catch (error) {
    console.warn(
      `[sync-repo-stats] Organization fetch failed (${error.message}), falling back to cached data.`,
    );
    organizationStats = loadOrganizationFallback();
  }

  await mkdir(dataDirectory, { recursive: true });
  const formattedStats = await formatStatsForFile(stats);
  const didWrite = await writeIfChanged(formattedStats);

  const formattedOrganizationStats = await formatStatsForFile(
    organizationStats,
    organizationTargetFile,
  );
  const didWriteOrganization = await writeIfChanged(
    formattedOrganizationStats,
    organizationTargetFile,
  );

  const totalStars = Object.values(stats).reduce((sum, r) => sum + r.stars, 0);
  console.log(
    `[sync-repo-stats] Done. Tracked stars: ${totalStars.toLocaleString()}, organization: ${organizationStats.publicRepositories} repos / ${organizationStats.totalStars.toLocaleString()} stars${didWrite || didWriteOrganization ? "" : " (no changes)"}`,
  );
}

run().catch(error => {
  console.error("[sync-repo-stats] Unexpected error:", error);
  process.exit(1);
});
