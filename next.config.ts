import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove ts and eslint warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
