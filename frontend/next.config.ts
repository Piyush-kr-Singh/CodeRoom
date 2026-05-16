import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@codeshare/shared"],
  experimental: {
    optimizePackageImports: ["framer-motion"]
  }
};

export default nextConfig;
