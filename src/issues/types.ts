export interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  labels: { name: string }[];
}

export interface GitHubSearchResponse {
  items: GitHubIssue[];
}

/* -----------------------------
   Runtime validation
------------------------------ */
export function isGitHubIssue(value: unknown): value is GitHubIssue {
  if (typeof value !== "object" || value === null) return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.id === "number" &&
    typeof v.title === "string" &&
    typeof v.html_url === "string" &&
    typeof v.repository_url === "string" &&
    typeof v.labels === "object" &&
    Array.isArray(v.labels)
  );
}

export function parseGitHubResponse(data: unknown): GitHubSearchResponse {
  if (typeof data === "object" && data !== null && "items" in data) {
    const items = (data as { items: unknown }).items;

    if (
      Array.isArray(items) &&
      items.every(
        item =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "title" in item &&
          "html_url" in item &&
          "repository_url" in item,
      )
    ) {
      return { items: items as GitHubIssue[] };
    }
  }

  throw new Error("Invalid GitHub response");
}
