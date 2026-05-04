import { searchIssues } from "src/lib/github/issues";

function getStatus(error: unknown): number {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return status;
  }
  return 502;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const raw = await searchIssues(q);

    const data: { items: unknown[]; error?: string } = raw;

    return Response.json(data);
  } catch (error) {
    const status = getStatus(error);

    const message =
      error instanceof Error ? error.message : "Failed to fetch issues";

    return Response.json({ items: [], error: message }, { status });
  }
}
