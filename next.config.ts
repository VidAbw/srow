import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',  // Enable static exports for Firebase hosting
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Required for static export
  },
  // Disable server-side features when exporting
  trailingSlash: true,
};

export default nextConfig;
