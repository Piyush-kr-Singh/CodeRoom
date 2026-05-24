import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { blogPosts } from "@/content/blog";
import { absoluteUrl, siteConfig } from "@/lib/site";

describe("site config", () => {
  it("exposes the SEO title", () => {
    expect(siteConfig.title).toContain("Anonymous Real-Time Code Sharing Tool");
  });

  it("normalizes the canonical site URL", () => {
    expect(siteConfig.domain).not.toMatch(/\/$/);
    expect(absoluteUrl("/features")).toBe(`${siteConfig.domain}/features`);
  });
});

describe("blog SEO content", () => {
  it("defines publish dates, update dates, and keywords for every post", () => {
    blogPosts.forEach((post) => {
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(post.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(post.keywords.length).toBeGreaterThan(0);
    });
  });

  it("includes the main marketing and blog URLs in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain(absoluteUrl("/"));
    expect(urls).toContain(absoluteUrl("/blog"));

    blogPosts.forEach((post) => {
      expect(urls).toContain(absoluteUrl(`/blog/${post.slug}`));
    });
  });
});

describe("robots rules", () => {
  it("keeps room URLs blocked while allowing reserved launcher slugs", () => {
    const rules = robots().rules;
    const normalizedRules = Array.isArray(rules) ? rules : [rules];
    const primaryRule = normalizedRules[0];

    if (!primaryRule) {
      throw new Error("Expected at least one robots rule.");
    }

    const allow = Array.isArray(primaryRule.allow) ? primaryRule.allow : [primaryRule.allow];
    const disallow = Array.isArray(primaryRule.disallow) ? primaryRule.disallow : [primaryRule.disallow];

    expect(disallow).toContain("/room/*");
    expect(disallow).toContain("/api/*");

    siteConfig.roomLauncherPaths.forEach((path) => {
      expect(allow).toContain(path);
    });
  });
});
