import { searchIssues } from "../../../lib/github/issues";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  const data = await searchIssues(q);

  return Response.json(data);
}
