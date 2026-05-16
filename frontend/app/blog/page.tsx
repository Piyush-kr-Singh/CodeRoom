import Link from "next/link";

import { blogPosts } from "@/content/blog";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Blog | Anonymous Code Sharing Guides",
  description: "SEO guides on anonymous code sharing, secure collaboration, and the best alternatives to old code sharing tools.",
  path: "/blog"
});

export default function BlogIndexPage() {
  return (
    <section className="container-shell py-20">
      <h1 className="headline">Blog</h1>
      <p className="body-copy mt-6 max-w-3xl">
        Guides for teams comparing tools, improving privacy, and sharing code online without adding signup friction.
      </p>
      <div className="mt-10 grid gap-6">
        {blogPosts.map((post) => (
          <article key={post.slug} className="glass-panel rounded-[1.75rem] p-8">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="body-copy mt-3">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="button-secondary mt-6">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
