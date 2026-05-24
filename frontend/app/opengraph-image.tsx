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

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <SocialImage
        eyebrow="Anonymous by design"
        title="Share code instantly without login"
        description="Create private password-protected rooms, collaborate live, and let expiring room links clean themselves up."
      />
    ),
    size
  );
}
