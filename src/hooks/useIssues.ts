import { useEffect, useState } from "react";
import { parseGitHubResponse, GitHubIssue } from "@/issues/types";
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

    async function fetchIssues() {
      setLoading(true);
      setError(null);

      try {
        const base = "is:issue state:open";
        const repos = buildRepoList(sdk);

        const results = await Promise.all(
          repos.map(async repo => {
            const res = await fetch(`/api/issues?q=${base} ${repo}`, {
              signal: controller.signal,
            });

            const json: GitHubIssue[] = await res.json();
            return parseGitHubResponse(json);
          }),
        );

        const merged = results.flatMap(r => r.items);

        const unique = Array.from(new Map(merged.map(i => [i.id, i])).values());

        const filtered = unique.filter(i =>
          matchesDifficulty(i.labels, difficulty),
        );

        setIssues(filtered);
      } catch (err) {
        if (err instanceof DOMException) return;

        setError(err instanceof Error ? err.message : "Unknown error");
        setIssues([]);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();

    return () => controller.abort();
  }, [difficulty, sdk]);

  return { issues, loading, error };
}
