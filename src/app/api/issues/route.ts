import { GitHubSearchResponse, parseGitHubResponse } from "@/issues/types";
import { searchIssues } from "@/lib/github/issues";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const data: GitHubSearchResponse = await searchIssues(q);

    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        items: [],
        error:
          error instanceof Error ? error.message : "Failed to fetch issues",
      },
      { status: 500 },
    );
  }
}
