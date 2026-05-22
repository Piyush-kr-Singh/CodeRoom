import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Disclaimer | CodeSyncUp",
  description:
    "Important disclaimers about using CodeSyncUp, including limitations of liability, data loss risks, and content responsibility.",
  path: "/disclaimer"
});

export default function DisclaimerPage() {
  return (
    <section className="container-shell py-20">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
        Legal
      </p>
      <h1 className="headline mt-4">Disclaimer</h1>
      <p className="body-copy mt-6 max-w-3xl">
        Please read this disclaimer carefully before using {siteConfig.name}. By
        accessing or using the service, you acknowledge and accept the following.
      </p>
      <p className="body-copy mt-2 text-sm opacity-60">Last updated: May 2025</p>

      <div className="mt-10 grid gap-6">
        {/* 1. General Disclaimer */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">1. General Disclaimer</h2>
          <p className="body-copy mt-3">
            {siteConfig.name} is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis without warranties of any kind, whether express
            or implied. This includes, but is not limited to, implied warranties
            of merchantability, fitness for a particular purpose, and
            non-infringement. We do not warrant that the service will be
            uninterrupted, secure, or free of errors.
          </p>
        </article>

        {/* 2. Code Content */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">2. Code Content</h2>
          <p className="body-copy mt-3">
            {siteConfig.name} is a platform for anonymous code sharing. We do not
            monitor, review, or endorse any code shared through the service.
            Users are solely responsible for the content they create, share, or
            paste into rooms. We are not liable for any damages, security issues,
            or consequences arising from code shared by users.
          </p>
        </article>

        {/* 3. No Professional Advice */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">3. No Professional Advice</h2>
          <p className="body-copy mt-3">
            The service is a tool for sharing and collaborating on code in real
            time. It is not a substitute for professional code review, security
            auditing, or any form of expert consultation. Any code you encounter
            on {siteConfig.name} should be independently verified before use in
            production environments.
          </p>
        </article>

        {/* 4. Data Loss */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">4. Data Loss</h2>
          <p className="body-copy mt-3">
            Rooms on {siteConfig.name} are temporary by design. All room data is
            subject to automatic expiration based on the duration set at creation
            (between 1 and 168 hours). Additionally:
          </p>
          <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
            <li>
              Inactive rooms may be cleaned up before their scheduled expiry.
            </li>
            <li>
              We do not provide backups, data recovery, or export functionality
              for expired or deleted rooms.
            </li>
            <li>
              Clearing your browser&apos;s localStorage will permanently remove
              your owner tokens, and ownership cannot be restored.
            </li>
          </ul>
          <p className="body-copy mt-3">
            Always save important code locally. Do not rely on {siteConfig.name}{" "}
            as a persistent storage solution.
          </p>
        </article>

        {/* 5. External Links */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">5. External Links</h2>
          <p className="body-copy mt-3">
            {siteConfig.name} may contain links to third-party websites or
            resources. These links are provided for convenience only. We have no
            control over the content, privacy practices, or availability of
            external sites and are not responsible for any damages or losses
            caused by accessing them.
          </p>
        </article>

        {/* 6. Limitation of Liability */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">6. Limitation of Liability</h2>
          <p className="body-copy mt-3">
            To the maximum extent permitted by applicable law, {siteConfig.name}{" "}
            and its operators shall not be held liable for any direct, indirect,
            incidental, special, consequential, or punitive damages resulting
            from your use of or inability to use the service. This includes
            damages for loss of data, loss of profits, business interruption, or
            any other commercial or personal damages.
          </p>
        </article>

        {/* 7. Contact */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">7. Contact</h2>
          <p className="body-copy mt-3">
            If you have questions about this disclaimer, please contact us at{" "}
            <a
              href="mailto:contact@codesyncup.com"
              className="text-[color:var(--accent)] underline underline-offset-4 hover:opacity-80"
            >
              contact@codesyncup.com
            </a>
            .
          </p>
        </article>
      </div>
    </section>
  );
}
