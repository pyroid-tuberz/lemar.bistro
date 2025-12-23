import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/admin',
        destination: '/admin.html',
      }
    ];
  },
};

export default nextConfig;
