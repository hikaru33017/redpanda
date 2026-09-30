import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ckan.odp.jig.jp',
        pathname: '/dataset/**',
      },
    ],
  },
};

export default nextConfig;
