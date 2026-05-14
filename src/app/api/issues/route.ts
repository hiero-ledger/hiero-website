import { GitHubSearchResponse, IssuesResponse } from "@/issues/types";

import { searchIssues } from "@/lib/github/issues";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const data: GitHubSearchResponse = await searchIssues(q);

    return Response.json(data, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const errorResponse: IssuesResponse = {
      items: [],
      error: error instanceof Error ? error.message : "Failed to fetch issues",
    };

    return Response.json(errorResponse, {
      status: 500,
    });
  }
}
