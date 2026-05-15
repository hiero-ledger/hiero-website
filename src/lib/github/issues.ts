import { GitHubSearchResponse, parseGitHubResponse } from "@/issues/types";

type CacheEntry = {
  data: GitHubSearchResponse;
  expires: number;
};

const cache = new Map<string, CacheEntry>();

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export async function searchIssues(
  query: string,
): Promise<GitHubSearchResponse> {
  const cached = cache.get(query);

  // Return cached result if still valid
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: "application/vnd.githubjson",
          "User-Agent": "hiero-issue-explorer",

          // Optional token support
          ...(process.env.GITHUB_TOKEN && {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
        next: { revalidate: 300 },
        signal: controller.signal,
      },
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const json = await res.json();
    const parsed = parseGitHubResponse(json);

    // Store in cache
    cache.set(query, {
      data: parsed,
      expires: Date.now() + CACHE_TTL,
    });

    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
}
