export interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
}

export interface GitHubSearchResponse {
  items: GitHubIssue[];
  total_count: number;
}

export async function searchIssues(
  query: string,
): Promise<GitHubSearchResponse> {
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

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      typeof body?.message === "string"
        ? body.message
        : "GitHub request failed";
    throw Object.assign(new Error(message), { status: res.status });
  }

  return (await res.json()) as GitHubSearchResponse;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const data = await searchIssues(q);
  return Response.json(data);
}
