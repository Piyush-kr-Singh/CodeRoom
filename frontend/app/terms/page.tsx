import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Terms of Service | CodeSyncUp",
  description:
    "Terms and conditions for using CodeSyncUp, the anonymous real-time code sharing platform.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <section className="container-shell py-20">
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
        Legal
      </p>
      <h1 className="headline mt-4">Terms of Service</h1>
      <p className="body-copy mt-6 max-w-3xl">
        By using {siteConfig.name}, you agree to the following terms. Please read
        them carefully before creating or joining a room.
      </p>
      <p className="body-copy mt-2 text-sm opacity-60">Last updated: May 2025</p>

      <div className="mt-10 grid gap-6">
        {/* 1. Acceptance of Terms */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">1. Acceptance of Terms</h2>
          <p className="body-copy mt-3">
            By accessing or using {siteConfig.name}, you agree to be bound by
            these Terms of Service. If you do not agree to these terms, do not
            use the service. No account creation is required — using the service
            in any capacity constitutes acceptance.
          </p>
        </article>

        {/* 2. Description of Service */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">2. Description of Service</h2>
          <p className="body-copy mt-3">
            {siteConfig.name} is an anonymous, real-time code sharing platform.
            The service allows users to:
          </p>
          <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
            <li>Create temporary code-sharing rooms via unique URLs.</li>
            <li>
              Collaborate in real time using a Monaco-based code editor and
              WebSocket connections.
            </li>
            <li>
              Optionally protect rooms with passwords and configure custom expiry
              durations.
            </li>
            <li>
              Share rooms publicly or privately without requiring user
              registration.
            </li>
          </ul>
        </article>

        {/* 3. User Responsibilities */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">3. User Responsibilities</h2>
          <p className="body-copy mt-3">
            When using {siteConfig.name}, you agree not to:
          </p>
          <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
            <li>
              Share illegal content, including but not limited to pirated
              software, stolen credentials, or content that violates applicable
              laws.
            </li>
            <li>
              Upload or distribute malware, viruses, or any other harmful code.
            </li>
            <li>
              Abuse the service through automated requests, spam, or attempts to
              disrupt availability for other users.
            </li>
            <li>
              Attempt to brute-force passwords on protected rooms or circumvent
              rate limiting.
            </li>
            <li>
              Use the platform to harass, threaten, or infringe upon the rights
              of others.
            </li>
          </ul>
        </article>

        {/* 4. Room Ownership & Data */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">4. Room Ownership &amp; Data</h2>
          <p className="body-copy mt-3">
            Room ownership is temporary and browser-based. When you create a
            room, a unique owner token is stored in your browser&apos;s
            localStorage. This token grants you management capabilities such as
            deleting the room or changing its settings.
          </p>
          <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
            <li>
              Clearing your browser data or switching devices will result in loss
              of ownership.
            </li>
            <li>
              All room data automatically expires based on the duration you set
              (between 1 and 168 hours).
            </li>
            <li>
              We do not provide data recovery for expired or deleted rooms.
            </li>
          </ul>
        </article>

        {/* 5. Intellectual Property */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">5. Intellectual Property</h2>
          <p className="body-copy mt-3">
            You retain full ownership and all intellectual property rights to the
            code you share through {siteConfig.name}. We do not claim any
            ownership, license, or rights over content you create or paste into
            rooms. The service is a conduit for sharing — nothing more.
          </p>
        </article>

        {/* 6. Service Availability */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">6. Service Availability</h2>
          <p className="body-copy mt-3">
            {siteConfig.name} is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis. We make no guarantees regarding:
          </p>
          <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
            <li>Continuous, uninterrupted, or error-free operation.</li>
            <li>
              Availability at any specific time or from any specific location.
            </li>
            <li>
              That the service will meet your particular requirements or
              expectations.
            </li>
          </ul>
          <p className="body-copy mt-3">
            We may modify, suspend, or discontinue the service at any time
            without prior notice.
          </p>
        </article>

        {/* 7. Limitation of Liability */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">7. Limitation of Liability</h2>
          <p className="body-copy mt-3">
            To the fullest extent permitted by applicable law,{" "}
            {siteConfig.name} and its operators shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages
            arising from your use of the service, including but not limited to
            loss of data, loss of profits, or interruption of service.
          </p>
        </article>

        {/* 8. Termination */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">8. Termination</h2>
          <p className="body-copy mt-3">
            We reserve the right to remove any room or restrict access to the
            service at our sole discretion, particularly in cases of:
          </p>
          <ul className="body-copy mt-3 list-disc space-y-2 pl-6">
            <li>Violation of these Terms of Service.</li>
            <li>
              Sharing of illegal, harmful, or abusive content.
            </li>
            <li>
              Automated abuse, excessive resource consumption, or actions that
              degrade the service for other users.
            </li>
          </ul>
        </article>

        {/* 9. Governing Law */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">9. Governing Law</h2>
          <p className="body-copy mt-3">
            These Terms shall be governed by and construed in accordance with the
            laws of the applicable jurisdiction. Any disputes arising from these
            terms or the use of the service will be subject to the exclusive
            jurisdiction of the competent courts in that jurisdiction.
          </p>
        </article>

        {/* 10. Changes to Terms */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">10. Changes to Terms</h2>
          <p className="body-copy mt-3">
            We may revise these Terms of Service at any time. Updated terms will
            be posted on this page with a revised &quot;Last updated&quot; date.
            Your continued use of {siteConfig.name} after changes are posted
            constitutes acceptance of the updated terms.
          </p>
        </article>

        {/* 11. Contact */}
        <article className="glass-panel rounded-[1.5rem] p-6">
          <h2 className="section-title">11. Contact</h2>
          <p className="body-copy mt-3">
            For questions about these Terms of Service, contact us at{" "}
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
