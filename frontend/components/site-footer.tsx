import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-shell flex flex-col gap-4 text-sm text-[color:var(--muted)] md:flex-row md:items-center md:justify-between">
        <p>Anonymous code sharing with password protection, expiry controls, and real-time collaboration.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/features">Features</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/blog">Blog</Link>
          <Link href={siteConfig.roomLaunchPath}>Launch a room</Link>
        </div>
      </div>
    </footer>
  );
}
