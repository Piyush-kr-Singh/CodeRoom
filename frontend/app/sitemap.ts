import type { MetadataRoute } from "next";

import { blogPosts } from "@/content/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/features", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/private-code-sharing", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/realtime-code-editor", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.35 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.35 },
    { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.55 }
  ];

  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: siteConfig.siteUpdatedAt,
      changeFrequency: page.changeFrequency,
      priority: page.priority
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.72
    }))
  ];
}
