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
      // nqs.1cdn.vn
      {
        protocol: "https",
        hostname: "nqs.1cdn.vn",
        port: "",
        pathname: "/**",
      },
      // photo.znews.vn
      {
        protocol: "https",
        hostname: "photo.znews.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "t.ex-cdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
