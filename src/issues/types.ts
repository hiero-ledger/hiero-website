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
  if (
    typeof data === "object" &&
    data !== null &&
    "items" in data &&
    Array.isArray((data as any).items)
  ) {
    const validItems = (data as any).items.filter(isGitHubIssue);

    return { items: validItems };
  }

  throw new Error("Invalid GitHub response shape");
}
