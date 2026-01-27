/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Exclude @cloudflare packages from server components in dev
  serverExternalPackages: ["@prisma/adapter-d1", "@cloudflare/next-on-pages"],
};

export default nextConfig;
