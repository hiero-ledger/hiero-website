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

export type ErrorResponse = {
  items: [];
  error: string;
};

export type IssuesResponse = GitHubSearchResponse | ErrorResponse;

export function parseGitHubResponse(data: unknown): GitHubSearchResponse {
  return data as GitHubSearchResponse;
}
