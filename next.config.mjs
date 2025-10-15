import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "pub-675ee3f62a2541d980ea75781400b0ed.r2.dev",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "cloud.blackandyellow.agency",
      },
    ],
  },
};


export default withNextIntl(nextConfig);
