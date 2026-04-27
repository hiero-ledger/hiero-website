export async function searchIssues(query: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "hiero-website",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`,
    { headers },
  );

  if (!res.ok) throw new Error("GitHub request failed");
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const data = await searchIssues(q);
  return Response.json(data);
}