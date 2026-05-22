import type { MetadataRoute } from "next";

import { blogPosts } from "@/content/blog";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/features", "/private-code-sharing", "/realtime-code-editor", "/faq", "/blog", "/privacy", "/terms", "/disclaimer", "/contact"];

  return [
    ...staticPages.map((path) => ({
      url: `${siteConfig.domain}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8
    })),
    ...blogPosts.map((post) => ({
      url: `${siteConfig.domain}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
