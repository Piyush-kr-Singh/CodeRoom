import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BreadcrumbData } from "@/components/seo/breadcrumb-data";
import { StructuredData } from "@/components/seo/structured-data";
import { blogPosts } from "@/content/blog";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return {};
  }

  const baseMetadata = buildMetadata({
    title: `${post.title} | CodeSyncUp Blog`,
    description: post.description,
    path: `/blog/${post.slug}`
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: "article"
    }
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BreadcrumbData items={[{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          author: {
            "@type": "Organization",
            name: siteConfig.name
          },
          mainEntityOfPage: `${siteConfig.domain}/blog/${post.slug}`
        }}
      />
      <article className="container-shell py-20">
        <h1 className="headline max-w-4xl">{post.title}</h1>
        <p className="body-copy mt-6 max-w-3xl">{post.description}</p>
        <div className="mt-12 grid gap-10">
          {post.sections.map((section) => (
            <section key={section.heading} className="glass-panel rounded-[1.75rem] p-8">
              <h2 className="text-2xl font-semibold">{section.heading}</h2>
              <div className="mt-4 grid gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="body-copy">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
