import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import type { PropsWithChildren } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/seo/structured-data";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site";

import "./globals.css";

const GOOGLE_TAG_ID = "G-S8ZK39RH3T";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"]
});

const rootMetadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/"
});

export const metadata: Metadata = {
  ...rootMetadata,
  metadataBase: new URL(siteConfig.domain),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/brand/codesyncup-icon.svg", type: "image/svg+xml" }],
    shortcut: ["/brand/codesyncup-icon.svg"],
    apple: [{ url: "/brand/codesyncup-icon.svg" }]
  }
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor },
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" }
  ]
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GOOGLE_TAG_ID}');
            `
          }}
        />
      </head>
      <body>
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${siteConfig.domain}#organization`,
                name: siteConfig.name,
                url: siteConfig.domain,
                email: siteConfig.contactEmail,
                logo: absoluteUrl("/brand/codesyncup-logo.svg")
              },
              {
                "@type": "WebSite",
                "@id": `${siteConfig.domain}#website`,
                name: siteConfig.name,
                url: siteConfig.domain,
                description: siteConfig.description,
                publisher: {
                  "@id": `${siteConfig.domain}#organization`
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": `${siteConfig.domain}#application`,
                name: siteConfig.name,
                url: siteConfig.domain,
                operatingSystem: "Web",
                applicationCategory: "DeveloperApplication",
                description: siteConfig.shortDescription,
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD"
                },
                publisher: {
                  "@id": `${siteConfig.domain}#organization`
                }
              }
            ]
          }}
        />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
