import { GitHubSearchResponse, parseGitHubResponse } from "@/issues/types";

export async function searchIssues(
  query: string,
): Promise<GitHubSearchResponse> {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`,
  );

  const data: GitHubSearchResponse = parseGitHubResponse(await res.json());

  return data;
}
