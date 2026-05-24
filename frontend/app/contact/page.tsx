import { BreadcrumbData } from "@/components/seo/breadcrumb-data";
import { ContactForm } from "@/components/contact-form";
import { StructuredData } from "@/components/seo/structured-data";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact Us | CodeSyncUp",
  description:
    "Get in touch with the CodeSyncUp team for questions, bug reports, or feedback about our anonymous code sharing platform.",
  path: "/contact",
  keywords: ["contact CodeSyncUp", "code sharing support", "report a bug"]
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbData items={[{ name: "Contact", path: "/contact" }]} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact CodeSyncUp",
          url: absoluteUrl("/contact"),
          description:
            "Reach the CodeSyncUp team for questions, bug reports, privacy concerns, or feedback.",
          mainEntity: {
            "@type": "Organization",
            name: siteConfig.name,
            email: siteConfig.contactEmail,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: siteConfig.contactEmail
            }
          }
        }}
      />
      <section className="container-shell py-20">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
          Get in touch
        </p>
        <h1 className="headline mt-4">Contact Us</h1>
        <p className="body-copy mt-6 max-w-3xl">
          Have a question, found a bug, or want to share feedback? We would love to hear from you. Fill out the
          contact form below or send us an email.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <div className="grid gap-6">
            <article className="glass-panel rounded-[1.5rem] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
                Direct Contact
              </p>
              <h2 className="section-title mt-3 text-2xl">Email support</h2>
              <p className="body-copy mt-3">
                For general inquiries, privacy concerns, abuse reports, or anything else, send us an email directly and
                our team will get back to you as soon as possible.
              </p>
              <p className="body-copy mt-6">
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="font-medium text-[color:var(--accent)] underline underline-offset-4 hover:opacity-85"
                >
                  {siteConfig.contactEmail}
                </a>
              </p>
            </article>

            <article className="glass-panel rounded-[1.5rem] p-6">
              <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--gold)]">
                Privacy First
              </p>
              <h2 className="section-title mt-3 text-2xl">Secure communication</h2>
              <p className="body-copy mt-3">
                We use contact submissions only to address your inquiry. We do not sell your information, and we do not
                keep support details longer than necessary to respond.
              </p>
            </article>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
