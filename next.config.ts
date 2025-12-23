import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/admin',
        destination: '/admin.html',
      },
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      }
    ];
  },
};

export default nextConfig;
