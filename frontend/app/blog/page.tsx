import Link from "next/link";

import { BreadcrumbData } from "@/components/seo/breadcrumb-data";
import { StructuredData } from "@/components/seo/structured-data";
import { blogPosts } from "@/content/blog";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

const baseMetadata = buildMetadata({
  title: "Developer Blog - Coding Share & Collaborative Syncing Insights | CodeSyncUp",
  description: "Read guides on anonymous coding share and collaborative text sync. Learn about secure code sharing, privacy practices, and development workflow alternatives.",
  path: "/blog",
  keywords: [
    "code sharing blog",
    "developer collaboration guides",
    "secure code sharing tips",
    "anonymous coding tools"
  ]
});

export const metadata = {
  ...baseMetadata,
  alternates: {
    ...baseMetadata.alternates,
    types: {
      "application/rss+xml": absoluteUrl(siteConfig.rssPath)
    }
  }
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export default function BlogIndexPage() {
  return (
    <>
      <BreadcrumbData items={[{ name: "Blog", path: "/blog" }]} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${siteConfig.name} Blog`,
          description:
            "Guides for anonymous collaboration, secure code sharing, and real-time developer workflows.",
          url: absoluteUrl("/blog"),
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.domain
          },
          blogPost: blogPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            url: absoluteUrl(`/blog/${post.slug}`),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt
          }))
        }}
      />
      <section className="container-shell py-20">
        <h1 className="headline">Blog</h1>
        <p className="body-copy mt-6 max-w-3xl">
          Guides for teams comparing tools, improving privacy, and sharing code online without adding signup friction.
        </p>
        <div className="mt-10 grid gap-6">
          {blogPosts.map((post) => (
            <article key={post.slug} className="glass-panel rounded-[1.75rem] p-8">
              <time className="font-mono text-xs uppercase tracking-[0.28em] text-[color:var(--accent)]" dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
              <p className="body-copy mt-3">{post.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.keywords.slice(0, 3).map((keyword) => (
                  <span key={keyword} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[color:var(--muted)]">
                    {keyword}
                  </span>
                ))}
              </div>
              <Link href={`/blog/${post.slug}`} className="button-secondary mt-6">
                Read article
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="container-shell pb-20">
        <div className="glass-panel rounded-[1.75rem] p-8">
          <h2 className="text-2xl font-semibold">More ways to explore CodeSyncUp</h2>
          <p className="body-copy mt-3 max-w-3xl">
            Start with our core landing pages for private rooms, real-time editing, and feature details if you are
            comparing code-sharing tools for classrooms, interviews, or lightweight pair programming.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/features" className="button-secondary">
              Explore features
            </Link>
            <Link href="/private-code-sharing" className="button-secondary">
              Learn about private rooms
            </Link>
            <Link href="/realtime-code-editor" className="button-secondary">
              See the realtime editor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
