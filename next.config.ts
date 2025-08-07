import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simplize.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.fireant.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "news.iqx.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
