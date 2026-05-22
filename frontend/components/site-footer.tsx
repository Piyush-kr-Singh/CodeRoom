import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-shell flex flex-col gap-8 text-sm text-[color:var(--muted)] md:flex-row md:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <img src="/brand/codesyncup-logo.svg" alt="CodeSyncUp" className="h-10 w-fit" />
          <p>Anonymous code sharing with password protection, expiry controls, and real-time collaboration.</p>
        </div>
        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-2">
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--foreground)]">Product</p>
            <Link href="/features" className="transition hover:text-[color:var(--foreground)]">Features</Link>
            <Link href="/faq" className="transition hover:text-[color:var(--foreground)]">FAQ</Link>
            <Link href="/blog" className="transition hover:text-[color:var(--foreground)]">Blog</Link>
            <Link href={siteConfig.roomLaunchPath} className="transition hover:text-[color:var(--foreground)]">Launch a room</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--foreground)]">Legal</p>
            <Link href="/privacy" className="transition hover:text-[color:var(--foreground)]">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-[color:var(--foreground)]">Terms of Service</Link>
            <Link href="/disclaimer" className="transition hover:text-[color:var(--foreground)]">Disclaimer</Link>
            <Link href="/contact" className="transition hover:text-[color:var(--foreground)]">Contact</Link>
          </div>
        </div>
      </div>
      <div className="container-shell mt-8 border-t border-white/10 pt-6 text-xs text-[color:var(--muted)]">
        <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
