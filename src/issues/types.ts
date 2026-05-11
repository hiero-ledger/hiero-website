export interface GitHubLabel {
  name: string;
}

export interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  labels: GitHubLabel[];
}

export interface GitHubSearchResponse {
  items: GitHubIssue[];
}

/* -----------------------------
   Runtime validation
------------------------------ */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isGitHubLabel(value: unknown): value is GitHubLabel {
  return isObject(value) && typeof value.name === "string";
}

export function isGitHubIssue(value: unknown): value is GitHubIssue {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "number" &&
    typeof value.title === "string" &&
    typeof value.html_url === "string" &&
    typeof value.repository_url === "string" &&
    Array.isArray(value.labels) &&
    value.labels.every(isGitHubLabel)
  );
}

export function parseGitHubResponse(data: unknown): GitHubSearchResponse {
  if (!isObject(data)) {
    throw new Error("Invalid GitHub response");
  }

  if (!("items" in data) || !Array.isArray(data.items)) {
    throw new Error("Invalid GitHub response");
  }

  if (!data.items.every(isGitHubIssue)) {
    throw new Error("Invalid GitHub response");
  }

  return {
    items: data.items,
  };
}
