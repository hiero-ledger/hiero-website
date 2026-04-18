import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CACHE = new Map<string, { data: any; expires: number }>();
const TTL = 60 * 1000; // 1 minute cache

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    console.log("🔥 API ROUTE HIT");
    console.log("QUERY:", query);

    if (!query) {
      return NextResponse.json(
        { error: "Missing query parameter" },
        { status: 400 }
      );
    }

    // 🔹 cache check
    const cached = CACHE.get(query);
    if (cached && cached.expires > Date.now()) {
      console.log("⚡ CACHE HIT");
      return NextResponse.json(cached.data);
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };

    const token = process.env.GITHUB_TOKEN;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = `https://api.github.com/search/issues?q=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(url, { headers });

    const data = await res.json();

    if (!res.ok) {
      console.error("GitHub API error:", data);

      return NextResponse.json(
        {
          error: "GitHub API error",
          status: res.status,
          details: data,
        },
        { status: res.status }
      );
    }

    // 🔹 store only successful responses
    CACHE.set(query, {
      data,
      expires: Date.now() + TTL,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("API route crashed:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}