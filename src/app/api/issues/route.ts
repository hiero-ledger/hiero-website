import { searchIssues } from "src/lib/github/issues";

function getStatus(error: unknown): number {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return status;
  }
  return 502;
}

interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const data = (await searchIssues(q)) as {
      items: unknown[];
      error?: string;
    };

    return Response.json(data);
  } catch (error) {
    const status = getStatus(error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch issues";

    return Response.json({ items: [], error: message }, { status });
  }
}
