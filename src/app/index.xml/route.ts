import { buildRssXml } from "@/lib/rss";

export function GET(): Response {
  // Canonical root feed endpoint expected by many aggregators.
  return new Response(buildRssXml("/index.xml"), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
