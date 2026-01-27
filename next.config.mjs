/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Exclude packages from server bundle to reduce size
  serverExternalPackages: [
    "@prisma/adapter-d1",
    "@cloudflare/next-on-pages",
    "@prisma/client",
    "bcryptjs",
  ],
};

export default nextConfig;
