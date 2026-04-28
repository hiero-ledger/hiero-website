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

let query: string;
type SearchIssuesFn = (_query:string) => Promise<GitHubSearchResponse>;
const searchIssues = rawSearchIssues as SearchIssuesFn;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const data = await searchIssues(q);

  return Response.json(data);
}
