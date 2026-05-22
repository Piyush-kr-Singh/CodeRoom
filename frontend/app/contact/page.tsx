import { buildMetadata } from "@/lib/metadata";
import { ContactForm } from "@/components/contact-form";

export const metadata = buildMetadata({
  title: "Contact Us | CodeSyncUp",
  description:
    "Get in touch with the CodeSyncUp team for questions, bug reports, or feedback about our anonymous code sharing platform.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <section className="container-shell py-20">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
        Get in touch
      </p>
      <h1 className="headline mt-4">Contact Us</h1>
      <p className="body-copy mt-6 max-w-3xl">
        Have a question, found a bug, or want to share feedback?
        We&apos;d love to hear from you. Fill out the contact form below or drop us an email.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start">
        {/* Info Column */}
        <div className="grid gap-6">
          {/* Email Card */}
          <article className="glass-panel rounded-[1.5rem] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
              Direct Contact
            </p>
            <h2 className="section-title mt-3 text-2xl">Email support</h2>
            <p className="body-copy mt-3">
              For general inquiries, privacy concerns, abuse reports, or anything
              else — send us an email directly and our team will get back to you as soon as
              possible.
            </p>
            <p className="body-copy mt-6">
              <a
                href="mailto:contact@codesyncup.com"
                className="text-[color:var(--accent)] underline underline-offset-4 hover:opacity-85 font-medium"
              >
                contact@codesyncup.com
              </a>
            </p>
          </article>

          {/* Privacy Note Card */}
          <article className="glass-panel rounded-[1.5rem] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--gold)]">
              Privacy First
            </p>
            <h2 className="section-title mt-3 text-2xl">Secure communication</h2>
            <p className="body-copy mt-3">
              We value your privacy. The information sent via this contact form or email is solely used to address your inquiry. We do not store submissions permanently or share your details with third parties.
            </p>
          </article>
        </div>

        {/* Form Column */}
        <ContactForm />
      </div>
    </section>
  );
}
