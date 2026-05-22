import Link from "next/link";

import { BreadcrumbData } from "@/components/seo/breadcrumb-data";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Real-Time Online Code Editor - Live Coding Share | CodeSyncUp",
  description: "Share and edit code instantly with an online collaborative editor. Enjoy zero-latency text sync, presence count, anonymous displays, and quick copy-paste tools.",
  path: "/realtime-code-editor"
});

export default function RealtimeCodeEditorPage() {
  return (
    <>
      <BreadcrumbData items={[{ name: "Realtime Code Editor", path: "/realtime-code-editor" }]} />
      <section className="container-shell py-20">
      <h1 className="headline">Realtime Code Editor</h1>
      <h2 className="mt-6 text-2xl text-[color:var(--muted)]">Monaco + Socket.io for fast collaborative editing</h2>
      <p className="body-copy mt-8 max-w-3xl">
        The editor is optimized for speed: lazy-loaded Monaco, diff-style updates, buffered persistence, and room
        presence all work together so the interface feels immediate on desktop and mobile.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[
          "Lazy-loaded editor to protect Core Web Vitals on marketing pages",
          "One-click Copy Code action with mobile-friendly clipboard support",
          "Presence count and anonymous display names to show active collaborators",
          "Language selector plus owner-level room controls"
        ].map((item) => (
          <div key={item} className="glass-panel rounded-[1.5rem] p-6">
            {item}
          </div>
        ))}
      </div>
      <Link href={siteConfig.roomLaunchPath} className="button-primary mt-10">
        Launch the editor
      </Link>
    </section>
   </>
  );
}
