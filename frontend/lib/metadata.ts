import type { Metadata } from "next";

import { siteConfig } from "./site";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
};

export function buildMetadata({ title, description, path = "/" }: MetadataInput): Metadata {
  const url = new URL(path, siteConfig.domain).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
