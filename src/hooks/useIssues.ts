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
        const repos = buildRepoList(sdk);

        const results: GitHubSearchResponse[] = await Promise.all(
          repos.map(async (repo: string): Promise<GitHubSearchResponse> => {
            const res = await fetch(`/api/issues?q=${base} ${repo}`, {
              signal: controller.signal,
            });

            const json: unknown = await res.json();

            return parseGitHubResponse(json);
          }),
        );

        const merged: GitHubIssue[] = results.flatMap(
          (r: { items: GitHubIssue[] }) => r.items,
        );

        const unique: GitHubIssue[] = Array.from(
          new Map(merged.map((i: GitHubIssue) => [i.id, i] as const)).values(),
        );

        const filtered = unique.filter(i =>
          matchesDifficulty(i.labels, difficulty),
        );

        setIssues(filtered);
      } catch (err: unknown) {
        if (err instanceof DOMException) return;

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
