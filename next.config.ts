import type { NextConfig } from "next";

const firebaseEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID,
};

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

  // Environment validation at build time
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: firebaseEnv.apiKey,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseEnv.authDomain,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseEnv.projectId,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseEnv.storageBucket,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseEnv.messagingSenderId,
    NEXT_PUBLIC_FIREBASE_APP_ID: firebaseEnv.appId,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: firebaseEnv.measurementId,
  },

  // Disable server actions warnings
  reactStrictMode: true,

};

export default nextConfig;
