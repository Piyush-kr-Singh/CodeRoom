import { ImageResponse } from "next/og";

import {
  SocialImage,
  socialImageContentType,
  socialImageSize
} from "@/components/seo/social-image";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} social preview`;
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function TwitterImage() {
  return new ImageResponse(
    (
      <SocialImage
        eyebrow="Live collaboration"
        title="Private code sharing with real-time sync"
        description="Launch a room, share the link, and start coding together with Monaco-powered editing and expiring room controls."
      />
    ),
    size
  );
}
