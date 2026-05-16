import Link from "next/link";

import { SectionShell } from "@/components/section-shell";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Features | Anonymous Code Sharing Rooms",
  description: "Explore real-time code sharing features built for anonymous, password-protected, expiring rooms.",
  path: "/features"
});

export default function FeaturesPage() {
  return (
    <>
      <section className="container-shell py-20">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">Feature set</p>
        <h1 className="headline mt-4">Anonymous collaboration with practical controls</h1>
        <p className="body-copy mt-6 max-w-3xl">
          This stack is tuned for students, pair programming, and time-boxed support sessions where you want speed
          first, not user onboarding first.
        </p>
      </section>
      <SectionShell
        eyebrow="Core features"
        title="Everything centers around URL-first rooms"
        description="A room becomes the product boundary: privacy, ownership, presence, expiry, and live editing all attach to the URL."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[
            "Public and private room creation on first visit",
            "Bcrypt password hashing with rate-limited access attempts",
            "Temporary owner token stored in localStorage",
            "Room deletion, privacy changes, and expiry updates for owners",
            "Monaco editor with copy-code and share-link actions",
            "Socket.io presence count and anonymous display names",
            "MongoDB TTL cleanup for both hard expiry and inactivity",
            "Read-only viewer link support for safe demos"
          ].map((feature) => (
            <div key={feature} className="glass-panel rounded-[1.5rem] p-6 text-lg">
              {feature}
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link href={siteConfig.roomLaunchPath} className="button-primary">
            Try the live editor
          </Link>
        </div>
      </SectionShell>
    </>
  );
}
