import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ['192.168.10.39'],
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: '/**',
      },
      {
        pathname: '/api/gallery/image',
        search: '?id=*',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Cache all static public assets for 1 year
        source: '/:path((?!api/).*\\.(?:jpg|jpeg|png|gif|svg|ico|webp|avif|woff|woff2|ttf|otf)$)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

