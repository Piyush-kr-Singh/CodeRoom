import { BreadcrumbData } from "@/components/seo/breadcrumb-data";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Privacy Policy | CodeSyncUp",
  description:
    "Learn how CodeSyncUp handles your data, what we collect, and how we protect your privacy on our anonymous code sharing platform.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbData items={[{ name: "Privacy Policy", path: "/privacy" }]} />
      <section className="container-shell py-20">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
          Legal
        </p>
        <h1 className="headline mt-4">Privacy Policy</h1>
        <p className="body-copy mt-6 max-w-3xl">
          Your privacy matters. {siteConfig.name} is designed around anonymity - no accounts, no tracking, no ads.
          This policy explains exactly what data we handle and why.
        </p>
        <p className="body-copy mt-2 text-sm opacity-60">Last updated: {siteConfig.legalUpdatedLabel}</p>

        <div className="mt-10 grid gap-6">
          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">1. Information We Collect</h2>
            <p className="body-copy mt-3">
              {siteConfig.name} is built to minimize data collection. We do not require accounts, logins, or personal
              information. The following data is collected solely to provide and protect the service:
            </p>
            <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Room content</strong> - Code you enter into a room is stored temporarily to enable real-time
                collaboration. Content is automatically deleted when the room expires.
              </li>
              <li>
                <strong>Hashed passwords</strong> - If you create a password-protected room, the password is hashed
                using bcrypt before storage. We never store plaintext passwords.
              </li>
              <li>
                <strong>Owner tokens</strong> - A hashed ownership token is generated when you create a room. The
                corresponding raw token is stored only in your browser&apos;s localStorage.
              </li>
              <li>
                <strong>IP addresses</strong> - Your IP address is temporarily processed for rate limiting and abuse
                prevention. It is not stored permanently or linked to room content.
              </li>
              <li>
                <strong>Anonymous display names</strong> - Random display names may be generated for participants in a
                room. These are not tied to any real identity.
              </li>
            </ul>
          </article>

          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">2. How We Use Your Information</h2>
            <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>Providing the service</strong> - Room content and real-time edits are transmitted via WebSocket
                connections to enable live collaboration.
              </li>
              <li>
                <strong>Rate limiting</strong> - IP-based rate limiting prevents brute-force attacks on
                password-protected rooms and excessive room creation.
              </li>
              <li>
                <strong>Abuse prevention</strong> - Basic request throttling protects the platform from spam and
                misuse.
              </li>
            </ul>
          </article>

          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">3. Data Storage &amp; Retention</h2>
            <p className="body-copy mt-3">
              All room data is stored on MongoDB Atlas, a cloud-hosted database service. Rooms are temporary by design:
            </p>
            <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
              <li>Room creators choose an expiry duration between 1 hour and 168 hours (7 days).</li>
              <li>MongoDB TTL (Time-To-Live) indexes automatically delete expired room data.</li>
              <li>Inactive rooms are cleaned up automatically via a separate inactivity deadline.</li>
              <li>We do not permanently store room content, and there are no backups of expired data.</li>
            </ul>
          </article>

          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">4. Cookies &amp; Local Storage</h2>
            <p className="body-copy mt-3">
              {siteConfig.name} does <strong>not</strong> use cookies for tracking, analytics, or advertising. The
              only client-side storage we use is:
            </p>
            <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>localStorage</strong> - Used exclusively to store room owner tokens. These tokens let you
                manage rooms you created, such as deleting a room or changing its settings. No other data is stored in
                your browser by this application.
              </li>
            </ul>
          </article>

          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">5. Third-Party Services</h2>
            <p className="body-copy mt-3">We use the following third-party infrastructure to operate the service:</p>
            <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong>MongoDB Atlas</strong> - Cloud database for storing room data. Subject to MongoDB&apos;s own
                privacy and security policies.
              </li>
            </ul>
            <p className="body-copy mt-3">
              We do <strong>not</strong> use any third-party analytics, advertising networks, or tracking services.
            </p>
          </article>

          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">6. Data Security</h2>
            <p className="body-copy mt-3">We take reasonable measures to protect your data:</p>
            <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
              <li>Passwords for private rooms are hashed using bcrypt before storage.</li>
              <li>All connections are served over HTTPS to encrypt data in transit.</li>
              <li>Rate limiting is enforced to prevent brute-force and abuse attacks.</li>
              <li>Owner tokens are hashed server-side; only the raw token exists in your browser.</li>
            </ul>
            <p className="body-copy mt-3">
              While we strive to protect your information, no method of transmission or storage is 100% secure. Use
              the service at your own discretion.
            </p>
          </article>

          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">7. Children&apos;s Privacy</h2>
            <p className="body-copy mt-3">
              {siteConfig.name} is not directed at children under the age of 13. We do not knowingly collect
              information from children. If you believe a child has used the service in a way that concerns you, please
              contact us and we will take appropriate action.
            </p>
          </article>

          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">8. Changes to This Policy</h2>
            <p className="body-copy mt-3">
              We may update this Privacy Policy from time to time. Changes will be reflected on this page with an
              updated &quot;Last updated&quot; date. Continued use of {siteConfig.name} after changes constitutes
              acceptance of the revised policy.
            </p>
          </article>

          <article className="glass-panel rounded-[1.5rem] p-6">
            <h2 className="section-title">9. Contact</h2>
            <p className="body-copy mt-3">
              If you have questions or concerns about this Privacy Policy, reach out to us at{" "}
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
    </>
  );
}
