import Link from "next/link";

import { LaunchRoomAction } from "@/components/launch-room-action";
import { BreadcrumbData } from "@/components/seo/breadcrumb-data";
import { StructuredData } from "@/components/seo/structured-data";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Private Code Share Online - Secure Coding Share | CodeSyncUp",
  description: "Securely share code and private text documents without registration. Protect your code rooms with password authentication and MongoDB TTL automatic room expiry.",
  path: "/private-code-sharing",
  keywords: [
    "private code share online",
    "secure code sharing",
    "password protected code room",
    "temporary private code link"
  ]
});

export default function PrivateCodeSharingPage() {
  return (
    <>
      <BreadcrumbData items={[{ name: "Private Code Sharing", path: "/private-code-sharing" }]} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Private Code Sharing Without Login",
          description: "Create private code sharing rooms with passwords and automatic expiry.",
          url: absoluteUrl("/private-code-sharing"),
          author: {
            "@type": "Organization",
            name: siteConfig.name
          }
        }}
      />
      <section className="container-shell py-20">
        <h1 className="headline">Private Code Sharing Without Login</h1>
        <h2 className="mt-6 text-2xl text-[color:var(--muted)]">Password-protected rooms with automatic cleanup</h2>
        <p className="body-copy mt-8 max-w-3xl">
          Private rooms let you keep the speed of anonymous collaboration while still protecting the editor behind a
          bcrypt-hashed password and short-lived room settings.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            "Create a room and toggle private mode before anyone enters.",
            "Choose the room lifetime so forgotten links disappear automatically.",
            "Give viewers a read-only link when you want observers without edit access."
          ].map((item) => (
            <div key={item} className="glass-panel rounded-[1.5rem] p-6">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <LaunchRoomAction className="button-primary" ariaLabel="Start a private room">
            Start a private room
          </LaunchRoomAction>
          <Link href="/features" className="button-secondary">
            Review features
          </Link>
        </div>
      </section>
    </>
  );
}
