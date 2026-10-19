import type { NextConfig } from "next";

// Optional same-origin API proxy.
//
// When the API runs on a different host (for example Render), set
// API_PROXY_TARGET to that host and NEXT_PUBLIC_API_URL to "/api/v1". The
// frontend then forwards /api/* to the backend, so the session cookie and the
// Google OAuth callback stay on the frontend's own domain (first-party
// cookies, no CORS, works in Safari).
//
// Both values are read at build time, so rebuild after changing them.
const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    if (!apiProxyTarget) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
