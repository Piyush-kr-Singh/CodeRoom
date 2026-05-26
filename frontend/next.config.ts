import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@codeshare/shared"],
  experimental: {
    optimizePackageImports: ["framer-motion"]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  },
  async rewrites() {
    const adminPath = process.env.ADMIN_ROUTE_PATH || "/admin";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const sourcePath = adminPath.startsWith("/") ? adminPath : `/${adminPath}`;

    return [
      {
        source: sourcePath,
        destination: `${apiUrl}${sourcePath}`
      }
    ];
  }
};

export default nextConfig;
