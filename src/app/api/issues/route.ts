import { searchIssues as rawSearchIssues } from "src/lib/github/issues";

interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
}

interface GitHubSearchResponse {
  items: GitHubIssue[];
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SearchIssuesFn = (_query: string) => Promise<GitHubSearchResponse>;
/*const searchIssues = rawSearchIssues as searchIssues;*/
const searchIssues = rawSearchIssues as SearchIssuesFn;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const data = await searchIssues(q);
    return Response.json(data);
  } catch (error) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 502;

    const message =
      error instanceof Error ? error.message : "Failed to fetch issues";

    return Response.json({ items: [], error: message }, { status });
  }
}
