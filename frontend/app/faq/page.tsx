import { BreadcrumbData } from "@/components/seo/breadcrumb-data";
import { StructuredData } from "@/components/seo/structured-data";
import { buildMetadata } from "@/lib/metadata";
import { faqItems, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "FAQ | Anonymous Real-Time Code Sharing",
  description: "Answers about private rooms, expiry controls, anonymous ownership, and secure no-login collaboration.",
  path: "/faq"
});

export default function FaqPage() {
  return (
    <>
      <BreadcrumbData items={[{ name: "FAQ", path: "/faq" }]} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          })),
          publisher: {
            "@type": "Organization",
            name: siteConfig.name
          }
        }}
      />
      <section className="container-shell py-20">
        <h1 className="headline">Frequently Asked Questions</h1>
        <p className="body-copy mt-6 max-w-3xl">
          Practical answers about privacy, room ownership, expiring links, and how anonymous collaboration works in
          production.
        </p>
        <div className="mt-10 grid gap-4">
          {faqItems.map((item) => (
            <article key={item.question} className="glass-panel rounded-[1.5rem] p-6">
              <h2 className="text-xl font-semibold">{item.question}</h2>
              <p className="body-copy mt-3">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
