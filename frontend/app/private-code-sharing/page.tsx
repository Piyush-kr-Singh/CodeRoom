import { StructuredData } from "@/components/seo/structured-data";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Private Code Sharing Without Login",
  description: "Create private code sharing rooms with passwords, expiring links, and temporary anonymous ownership.",
  path: "/private-code-sharing"
});

export default function PrivateCodeSharingPage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Private Code Sharing Without Login",
          description: "Create private code sharing rooms with passwords and automatic expiry.",
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
      </section>
    </>
  );
}
