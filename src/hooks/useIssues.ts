import { useEffect, useState } from "react";
import {
  parseGitHubResponse,
  GitHubIssue,
  GitHubSearchResponse,
} from "@/issues/types";
import { buildRepoList, matchesDifficulty } from "@/issues/filter";

export function useIssues(
  difficulty: string,
  sdk: string,
): {
  issues: GitHubIssue[];
  loading: boolean;
  error: string | null;
} {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchIssues = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const base = "is:issue state:open";
        const repos: string[] = buildRepoList(sdk);

        const results: GitHubSearchResponse[] = await Promise.all(
          repos.map(async (repo: string): Promise<GitHubSearchResponse> => {
            const res = await fetch(`/api/issues?q=${base} ${repo}`, {
              signal: controller.signal,
            });

            const json: unknown = await res.json();

            const parsed: GitHubSearchResponse = parseGitHubResponse(json);

            for (const i of parsed.items) {
              matchesDifficulty(i.labels, difficulty);
            }

            return parsed;
          }),
        );

        const merged: GitHubIssue[] = results.flatMap(
          (r: GitHubSearchResponse) => r.items,
        );

        const unique = Array.from(new Map(merged.map(i => [i.id, i])).values());

        const filtered: GitHubIssue[] = unique.filter(i =>
          matchesDifficulty(i.labels, difficulty),
        );

        setIssues(filtered);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Unknown error");
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchIssues();

    return () => {
      controller.abort();
    };
  }, [difficulty, sdk]);

  return { issues, loading, error };
}
