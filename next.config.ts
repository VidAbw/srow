import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove output: 'export' to enable server-side rendering for admin pages
  images: {
    domains: ['firebasestorage.googleapis.com'], // Allow images from Firebase Storage
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Enable server-side features for admin authentication
  trailingSlash: true,
  
  // Handle Firebase Admin Node.js dependencies
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle Node.js modules for server-side code
      config.externals.push({ 
        'net': 'net',
        'tls': 'tls',
        'fs': 'fs',
      });
    }
    
    return config;
  },
};

export default nextConfig;
