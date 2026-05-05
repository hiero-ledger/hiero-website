import { searchIssues } from "@/lib/github/issues";
import { parseGitHubResponse } from "@/issues/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const raw = await searchIssues(q);

    // ✅ validate here
    const data = parseGitHubResponse(raw);

    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch issues";

    return Response.json({ items: [], error: message }, { status: 500 });
  }
}
