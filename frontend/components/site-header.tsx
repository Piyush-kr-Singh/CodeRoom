import Link from "next/link";

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
        <Link href="/" className="font-display text-lg font-semibold tracking-wide">
          CodeShare Room
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[color:var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={siteConfig.roomLaunchPath} className="button-secondary">
          Open a room
        </Link>
      </div>
    </header>
  );
}
