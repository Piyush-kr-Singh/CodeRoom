export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export const blogPosts: readonly BlogPost[] = [
  {
    slug: "best-codeshare-alternatives",
    title: "Best Codeshare Alternatives for Fast Anonymous Pairing",
    description:
      "Compare the best Codeshare alternatives when you need instant rooms, password protection, and flexible expiry times.",
    publishedAt: "2026-02-12T00:00:00.000Z",
    updatedAt: "2026-05-24T00:00:00.000Z",
    keywords: [
      "codeshare alternatives",
      "anonymous pair programming",
      "online code sharing tools",
      "private code collaboration"
    ],
    sections: [
      {
        heading: "Why teams move away from legacy code sharing tools",
        paragraphs: [
          "Developers want less friction, not another signup wall. Anonymous room links, fast loading editors, and clear privacy controls are now the baseline.",
          "The strongest alternatives focus on three things: speed, temporary collaboration, and simple controls for private rooms."
        ]
      },
      {
        heading: "What to look for in a modern alternative",
        paragraphs: [
          "Look for password-protected rooms, copy-ready URLs, room expiry controls, and a strong mobile experience.",
          "For teaching, interviews, and debugging sessions, real-time presence and fast clipboard actions matter more than heavy account features."
        ]
      }
    ]
  },
  {
    slug: "how-to-share-code-online-instantly",
    title: "How to Share Code Online Instantly Without Signups",
    description:
      "A practical guide to sharing code online instantly, securely, and without asking teammates to create accounts first.",
    publishedAt: "2026-03-05T00:00:00.000Z",
    updatedAt: "2026-05-24T00:00:00.000Z",
    keywords: [
      "share code online instantly",
      "share code without login",
      "temporary code sharing",
      "real-time code editor"
    ],
    sections: [
      {
        heading: "Start with a room URL",
        paragraphs: [
          "The fastest workflow is a room URL that becomes the collaboration space itself. The first visitor sets the privacy level and expiry window, then shares the link.",
          "This removes onboarding friction and works well for urgent debugging, office hours, and live demos."
        ]
      },
      {
        heading: "Choose the right privacy level",
        paragraphs: [
          "Public rooms are useful for quick collaboration. Private rooms are better for interview prep, student work, and anything that should stay behind a password.",
          "Temporary ownership also matters because someone still needs to manage expiry, delete the room, or rotate its privacy settings."
        ]
      }
    ]
  },
  {
    slug: "secure-code-sharing-without-login",
    title: "Secure Code Sharing Without Login: What Actually Matters",
    description:
      "Anonymous does not have to mean careless. Learn which controls make no-login code sharing safer in production.",
    publishedAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-05-24T00:00:00.000Z",
    keywords: [
      "secure code sharing",
      "anonymous code sharing",
      "private code rooms",
      "temporary collaboration tools"
    ],
    sections: [
      {
        heading: "Anonymous can still be secure",
        paragraphs: [
          "A secure anonymous tool does not skip controls. It replaces identity with scoped access: passwords for private rooms, short-lived rooms, rate limits, and owner tokens.",
          "This keeps the experience simple for end users while still reducing abuse and accidental exposure."
        ]
      },
      {
        heading: "Expiry and deletion should be automatic",
        paragraphs: [
          "Rooms should not live forever by default. Hard expiry plus inactivity cleanup reduces long-tail risk and prevents forgotten code from lingering in storage.",
          "If a product offers no cleanup strategy, privacy promises are weaker than they look."
        ]
      }
    ]
  }
] as const;
