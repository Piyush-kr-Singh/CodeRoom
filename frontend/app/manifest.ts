import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    categories: ["developer tools", "productivity", "education"],
    icons: [
      {
        src: "/brand/codesyncup-icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
