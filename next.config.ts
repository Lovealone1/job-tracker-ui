import type { NextConfig } from "next";

/**
 * Server-side only (no NEXT_PUBLIC_ prefix): the real origin of the API.
 * Every browser request goes to the frontend origin and is proxied here, so
 * the session cookie stays first-party. Trailing slashes are stripped because
 * Railway/Vercel dashboards keep them verbatim.
 */
const API_PROXY_TARGET = (process.env.API_PROXY_TARGET || 'http://localhost:3001')
  .trim()
  .replace(/\/+$/, '');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'toiexxuzitcvtuivuoiy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${API_PROXY_TARGET}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
