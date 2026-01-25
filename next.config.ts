import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/@me",
        destination: "/me",
      },
      {
        source: "/@me/browse-skills",
        destination: "/me/browse-skills",
      },
      {
        source: "/@me/sessions",
        destination: "/me/sessions",
      },
      {
        source: "/@me/exchange-requests",
        destination: "/me/exchange-requests",
      },
      {
        source: "/@me/chat",
        destination: "/me/chat",
      },
      {
        source: "/@me/session-bookings",
        destination: "/me/session-bookings",
      },
      {
        source: "/@me/session-bookings/:id",
        destination: "/me/session-bookings/:id",
      },
    ];
  },
};

export default nextConfig;
