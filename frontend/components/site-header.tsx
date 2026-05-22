"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { siteConfig } from "@/lib/site";
import { getOwnerToken, ROOM_OWNER_STATE_EVENT } from "@/lib/storage";

const navItems = [
  { href: "/features", label: "Features" },
  { href: "/private-code-sharing", label: "Private Rooms" },
  { href: "/realtime-code-editor", label: "Realtime Editor" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const roomSlug = useMemo(() => {
    const match = pathname.match(/^\/room\/([^/]+)$/);
    return match?.[1] ?? "";
  }, [pathname]);
  const [isOwnerInOpenRoom, setIsOwnerInOpenRoom] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function syncOwnerState() {
      setIsOwnerInOpenRoom(Boolean(roomSlug) && Boolean(getOwnerToken(roomSlug)));
    }

    syncOwnerState();
    window.addEventListener("storage", syncOwnerState);
    window.addEventListener(ROOM_OWNER_STATE_EVENT, syncOwnerState);

    return () => {
      window.removeEventListener("storage", syncOwnerState);
      window.removeEventListener(ROOM_OWNER_STATE_EVENT, syncOwnerState);
    };
  }, [roomSlug]);

  function openRoomSettings() {
    window.dispatchEvent(new CustomEvent("codeshare:open-owner-panel"));
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,16,24,0.72)] backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between gap-6 py-4">
        <Link href="/" className="shrink-0" aria-label={siteConfig.name}>
          <img src="/brand/codesyncup-logo.svg" alt="CodeSyncUp" className="h-10 w-auto sm:h-11" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[color:var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isOwnerInOpenRoom ? (
            <button type="button" onClick={openRoomSettings} className="button-secondary px-4 py-2">
              Room settings
            </button>
          ) : (
            <Link href={siteConfig.roomLaunchPath} className="button-secondary px-4 py-2">
              Open a room
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <nav className="border-t border-white/10 bg-[rgba(8,16,24,0.92)] px-6 py-6 md:hidden flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-[color:var(--muted)] transition hover:text-[color:var(--foreground)] py-2 border-b border-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
