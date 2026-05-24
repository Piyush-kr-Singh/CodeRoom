import Link from "next/link";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | CodeSyncUp",
  description:
    "The page you are looking for does not exist. Return home or start a live code-sharing room.",
  robots: {
    index: false,
    follow: false
  }
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="container-shell flex justify-center">
        <div className="glass-panel w-full max-w-lg rounded-2xl p-8 text-center sm:p-12">
          {/* 404 Badge */}
          <p
            className="select-none text-[8rem] font-bold leading-none tracking-tighter sm:text-[10rem]"
            style={{ color: "var(--accent)", opacity: 0.15 }}
            aria-hidden="true"
          >
            404
          </p>

          {/* Heading */}
          <h1 className="section-title -mt-6 mb-3">Page not found</h1>

          {/* Description */}
          <p className="body-copy mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Head back home or jump straight into a live room.
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="button-primary">
              Back to home
            </Link>
            <Link
              href={siteConfig.roomLaunchPath}
              className="button-secondary"
            >
              Start a live room
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
