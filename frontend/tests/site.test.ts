import { siteConfig } from "@/lib/site";

describe("site config", () => {
  it("exposes the SEO title", () => {
    expect(siteConfig.title).toContain("Anonymous Real-Time Code Sharing Tool");
  });
});
