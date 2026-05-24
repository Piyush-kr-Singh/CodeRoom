import { ImageResponse } from "next/og";

import {
  SocialImage,
  socialImageContentType,
  socialImageSize
} from "@/components/seo/social-image";
import { blogPosts } from "@/content/blog";
import { siteConfig } from "@/lib/site";

type BlogImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const alt = `${siteConfig.name} blog article preview`;
export const size = socialImageSize;
export const contentType = socialImageContentType;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export default async function BlogOpenGraphImage({ params }: BlogImageProps) {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return new ImageResponse(
      (
        <SocialImage
          eyebrow="CodeSyncUp Blog"
          title="Guides for faster and safer code sharing"
          description="Read practical articles on anonymous collaboration, private rooms, and real-time editing workflows."
        />
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <SocialImage
        eyebrow="CodeSyncUp Blog"
        title={post.title}
        description={post.description}
        accentLabel={`Updated ${formatDate(post.updatedAt)}`}
      />
    ),
    size
  );
}
