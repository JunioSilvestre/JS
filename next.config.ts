import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure better-sqlite3 runs only in Node.js runtime (not Edge)
  serverExternalPackages: ["better-sqlite3"],

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react"],
  },
  // Allow accessing via Tailscale
  allowedDevOrigins: ["100.93.195.84"],
};

export default nextConfig;
