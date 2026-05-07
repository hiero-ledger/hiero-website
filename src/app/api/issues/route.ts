import { searchIssues as _searchIssues } from "@/lib/github/issues";
import { parseGitHubResponse } from "@/issues/types";

const searchIssues: typeof _searchIssues = _searchIssues;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const raw = await searchIssues(q);

    const data = parseGitHubResponse(raw);

    return Response.json(data);
  } catch (error: unknown) {
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
