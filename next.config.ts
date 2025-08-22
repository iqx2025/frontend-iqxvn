import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Cho phép tất cả host
      },
      {
        protocol: "http",
        hostname: "**", // Nếu muốn cho phép cả http
      },
    ],
  },
  // Ensure n8n chat module is properly transpiled
  transpilePackages: ['@n8n/chat'],
  // Webpack configuration for n8n chat
  webpack: (config, { isServer }) => {
    // Handle n8n chat module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
