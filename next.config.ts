import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image1.coupangcdn.com' },
      { protocol: 'https', hostname: 'image2.coupangcdn.com' },
      { protocol: 'https', hostname: 'image3.coupangcdn.com' },
    ],
  },
};

export default nextConfig;
