const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_API_URL = "http://localhost:4000";

function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

function resolveSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  return candidate ? normalizeUrl(candidate) : DEFAULT_SITE_URL;
}

function resolveApiUrl() {
  const candidate = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;
  return normalizeUrl(candidate);
}

export const siteConfig = {
  name: "CodeSyncUp",
  domain: resolveSiteUrl(),
  apiUrl: resolveApiUrl(),
  title: "CodeSyncUp | Anonymous Real-Time Code Sharing Tool",
  description:
    "Share code instantly without login. Create private password-protected rooms with custom expiry and real-time collaboration.",
  shortDescription:
    "Anonymous real-time code sharing with password protection, expiring rooms, and live collaboration.",
  locale: "en_US",
  contactEmail: "contact@codesyncup.com",
  category: "Developer Tools",
  themeColor: "#081018",
  siteUpdatedAt: "2026-05-24T00:00:00.000Z",
  rssPath: "/feed.xml",
  defaultOgImagePath: "/opengraph-image",
  roomLaunchPath: "/room/new",
  roomLaunchLabel: "/room/a7k2q9",
  keywords: [
    "code share online",
    "anonymous code sharing",
    "real-time code sharing",
    "online code editor",
    "live coding interview tool",
    "pair programming tool",
    "private code sharing",
    "temporary code sharing link",
    "share code without login",
    "monaco collaborative editor"
  ]
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.domain}/`).toString();
}

export const faqItems = [
  {
    question: "Do I need an account to share code?",
    answer:
      "No. Every room is anonymous by default, and the first visitor becomes the temporary owner through a secure browser token."
  },
  {
    question: "How do private rooms work?",
    answer:
      "Private rooms ask for a password before entry. Passwords are hashed on the backend and room access attempts are rate limited."
  },
  {
    question: "Can I control how long a room stays alive?",
    answer:
      "Yes. New rooms default to 24 hours, and you can choose shorter windows like 1, 6, or 12 hours or set a custom duration."
  },
  {
    question: "What happens when nobody uses a room?",
    answer:
      "Inactive rooms are cleaned up automatically. MongoDB TTL handles hard expiry, and the backend keeps a separate inactivity deadline."
  }
] as const;
