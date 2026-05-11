import { GitHubSearchResponse, parseGitHubResponse } from "@/issues/types";

export async function searchIssues(
  query: string,
): Promise<GitHubSearchResponse> {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`,
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const json = await res.json();

  return parseGitHubResponse(json);
}
