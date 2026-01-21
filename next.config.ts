import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/@me',
        destination: '/me',
      },
    ]
  },
};

export default nextConfig;
