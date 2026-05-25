import Link from "next/link";

import { HeaderRoomAction } from "@/components/header-room-action";
import { siteConfig } from "@/lib/site";

const navItems = [
  { href: "/features", label: "Features" },
  { href: "/private-code-sharing", label: "Private Rooms" },
  { href: "/realtime-code-editor", label: "Realtime Editor" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,16,24,0.72)] backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between gap-6 py-4">
        <Link href="/" className="shrink-0" aria-label={siteConfig.name}>
          <img
            src="/brand/codesyncup-logo.svg"
            alt="CodeSyncUp"
            width="320"
            height="88"
            className="h-10 w-auto sm:h-11"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[color:var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <HeaderRoomAction />
          <details className="relative md:hidden">
            <summary
              className="flex h-10 w-10 list-none items-center justify-center rounded-full border border-white/10 bg-white/5 [&::-webkit-details-marker]:hidden"
              aria-label="Toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </summary>
            <nav className="glass-panel absolute right-0 top-[calc(100%+0.75rem)] flex w-[min(18rem,calc(100vw-2rem))] flex-col gap-2 rounded-[1.5rem] p-4 shadow-panel">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-base text-[color:var(--muted)] transition hover:bg-white/5 hover:text-[color:var(--foreground)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
