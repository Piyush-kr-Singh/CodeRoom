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
        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[color:var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>
        {isOwnerInOpenRoom ? (
          <button type="button" onClick={openRoomSettings} className="button-secondary">
            Room settings
          </button>
        ) : (
          <Link href={siteConfig.roomLaunchPath} className="button-secondary">
            Open a room
          </Link>
        )}
      </div>
    </header>
  );
}
