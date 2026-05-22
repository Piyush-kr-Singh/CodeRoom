import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { SectionShell } from "@/components/section-shell";
import { StructuredData } from "@/components/seo/structured-data";
import { buildMetadata } from "@/lib/metadata";
import { faqItems, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Code Share Online - Anonymous Real-Time Coding Share & Text Sync | CodeSyncUp",
  description: "CodeSyncUp is the ultimate free online code share and text sync tool. Share code and text snippets instantly without login. Create private password-protected rooms with real-time Monaco-powered collaboration.",
  path: "/"
});

const highlights = [
  "Create public or password-protected rooms in one step",
  "Choose 1h, 6h, 12h, 24h, or custom expiry windows",
  "Collaborate live with Monaco Editor and Socket.io presence",
  "Own the room anonymously through a secure browser token"
];

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.name,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          }
        }}
      />
      <section className="container-shell grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <Reveal className="max-w-3xl">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
            Anonymous by design
          </p>
          <h1 className="headline">Free Real-Time Code Sharing Tool</h1>
          <h2 className="mt-5 text-2xl font-medium text-[color:var(--muted)] sm:text-3xl">
            Share Code Instantly Without Login
          </h2>
          <h2 className="mt-2 text-2xl font-medium text-[color:var(--muted)] sm:text-3xl">
            Private Password Protected Code Rooms
          </h2>
          <p className="body-copy mt-8 max-w-2xl">
            Launch collaborative rooms from a URL like <span className="font-mono text-[color:var(--foreground)]">{siteConfig.roomLaunchLabel}</span>,
            protect them with a password when needed, and let MongoDB expiry rules clean everything up automatically.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={siteConfig.roomLaunchPath} className="button-primary">
              Start a live room
            </Link>
            <Link href="/features" className="button-secondary">
              Explore features
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="glass-panel rounded-[2rem] p-6 shadow-panel sm:p-8">
            <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(6,12,19,0.76)] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]">Room flow</p>
                  <p className="mt-2 text-lg font-medium">Anonymous ownership + expiring collaboration</p>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-[color:var(--gold)]">
                  Live
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {highlights.map((highlight) => (
                  <div key={highlight} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--foreground)]">
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <SectionShell
        eyebrow="Why it works"
        title="Designed for classrooms, interviews, debugging, and quick pair sessions"
        description="The product strips away account friction but keeps the controls that matter when real code is being shared."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Fast room creation",
              body: "Every URL becomes a room. If it does not exist yet, the first visitor decides privacy and expiry."
            },
            {
              title: "Privacy you can explain",
              body: "Temporary ownership, bcrypt-hashed passwords, IP throttling, and auto-expiry make the no-login model practical."
            },
            {
              title: "Real-time focus",
              body: "Socket.io keeps editors in sync, presence is visible, and Monaco gives the interface a familiar developer feel."
            }
          ].map((item) => (
            <div key={item.title} className="glass-panel rounded-[1.75rem] p-6">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="body-copy mt-3">{item.body}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="FAQ preview"
        title="Questions teams ask before switching"
        description="These are the concerns we hear most when people want something simpler than a full authenticated workspace."
      >
        <div className="grid gap-4">
          {faqItems.slice(0, 3).map((item) => (
            <div key={item.question} className="glass-panel rounded-[1.5rem] p-6">
              <h3 className="text-lg font-semibold">{item.question}</h3>
              <p className="body-copy mt-2">{item.answer}</p>
            </div>
          ))}
          <Link href="/faq" className="button-secondary w-fit">
            Read the full FAQ
          </Link>
        </div>
      </SectionShell>
    </>
  );
}
