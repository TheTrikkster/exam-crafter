/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "mongoose"],
  },
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
