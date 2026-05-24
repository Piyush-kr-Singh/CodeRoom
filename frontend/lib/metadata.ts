import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "./site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
  imagePath?: string;
};

function mergeKeywords(keywords: string[] = []) {
  return Array.from(new Set([...siteConfig.keywords, ...keywords]));
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
  noIndex = false,
  imagePath = siteConfig.defaultOgImagePath
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(imagePath);

  return {
    title,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.domain }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: siteConfig.category,
    keywords: mergeKeywords(keywords),
    formatDetection: {
      address: false,
      email: false,
      telephone: false
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      noarchive: false,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type,
      locale: siteConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | ${siteConfig.name}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}
