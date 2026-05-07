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

  if (
    typeof v.id !== "number" ||
    typeof v.title !== "string" ||
    typeof v.html_url !== "string" ||
    typeof v.repository_url !== "string"
  ) {
    return false;
  }

  if (!Array.isArray(v.labels)) return false;

  return v.labels.every(label => {
    if (typeof label !== "object" || label === null) return false;
    return typeof (label as Record<string, unknown>).name === "string";
  });
}

/* -----------------------------
   Helper Functions
------------------------------ */

function hasItems(data: unknown): data is { items: unknown } {
  return typeof data === "object" && data !== null && "items" in data;
}

function isBasicGitHubIssue(item: unknown): boolean {
  if (typeof item !== "object" || item === null) return false;

  const v = item as Record<string, unknown>;

  const idOk = typeof v.id === "number";
  const titleOk = typeof v.title === "string";
  const urlOk = typeof v.html_url === "string";
  const repoOk = typeof v.repository_url === "string";

  return idOk && titleOk && urlOk && repoOk;
}

export function parseGitHubResponse(data: unknown): GitHubSearchResponse {
  if (!hasItems(data)) {
    throw new Error("Invalid GitHub response");
  }

  const items = data.items;

  if (!Array.isArray(items) || !items.every(isBasicGitHubIssue)) {
    throw new Error("Invalid GitHub response");
  }

  return { items: items as GitHubIssue[] };
}
