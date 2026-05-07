import { GitHubSearchResponse } from "@/issues/types";

export async function searchIssues(
  query: string,
): Promise<GitHubSearchResponse> {
  const res = await fetch(`https://api.github.com/search/issues?q=${query}`);
  return res.json();
}
