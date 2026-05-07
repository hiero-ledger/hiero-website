import { searchIssues } from "@/lib/github/issues";
import { parseGitHubResponse, GitHubSearchResponse } from "@/issues/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const raw = await searchIssues(q); 

    const data = parseGitHubResponse(raw);

    return Response.json(data);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch issues";

    return Response.json({ items: [], error: message }, { status: 500 });
  }
}
