import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hiero.org";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hacktoberfest`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/heroes`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Dynamic blog post routes
  const posts = getAllPosts();
  const blogRoutes = posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
