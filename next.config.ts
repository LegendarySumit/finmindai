import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.finnhub.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },

  // Redirects for deprecated endpoints
  async redirects() {
    return [
      {
        source: "/api/auth/email-login",
        destination: "/auth?mode=login",
        permanent: true,
      },
      {
        source: "/api/auth/email-signup",
        destination: "/auth?mode=signup",
        permanent: true,
      },
      {
        source: "/api/auth/wallet-login",
        destination: "/auth?mode=wallet",
        permanent: true,
      },
    ];
  },

  // Compression and optimization
  compress: true,
  productionBrowserSourceMaps: false,
  generateEtags: true,

  // Disable server actions warnings
  reactStrictMode: true,
};

export default nextConfig;
