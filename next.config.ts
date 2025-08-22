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
};

export default nextConfig;
