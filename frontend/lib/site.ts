export const siteConfig = {
  name: "CodeSyncUp",
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  title: "CodeSyncUp | Anonymous Real-Time Code Sharing Tool",
  description:
    "Share code instantly without login. Create private password-protected rooms with custom expiry and real-time collaboration.",
  roomLaunchPath: "/room/new",
  roomLaunchLabel: "/room/a7k2q9"
};

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
