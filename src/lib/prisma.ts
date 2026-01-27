import { PrismaClient } from "@prisma/client";

// Global prisma instance for development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if we're in a Cloudflare environment
function isCloudflareEnv(): boolean {
  try {
    // Check if we're running in Cloudflare Workers/Pages
    return typeof (globalThis as Record<string, unknown>).caches !== "undefined" 
      && typeof process === "undefined";
  } catch {
    return false;
  }
}

// Create Prisma client - handles both local dev and Cloudflare
async function createPrismaClient(): Promise<PrismaClient> {
  // For Cloudflare production environment
  if (isCloudflareEnv()) {
    const { PrismaD1 } = await import("@prisma/adapter-d1");
    const { getRequestContext } = await import("@cloudflare/next-on-pages");
    const { env } = getRequestContext();
    const adapter = new PrismaD1(env.DB);
    return new PrismaClient({ adapter });
  }
  
  // For local development - use cached instance
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

// Synchronous getter for local development
function getLocalPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

// Main export - returns PrismaClient for database operations
export function getDb(): PrismaClient {
  // In local development, use sync version
  if (process.env.NODE_ENV === "development" || process.env.DATABASE_URL) {
    return getLocalPrisma();
  }
  
  // For production/Cloudflare, we need the async version
  // but for now return local prisma (will be replaced at runtime)
  return getLocalPrisma();
}

// Async version for Cloudflare runtime
export async function getDbAsync(): Promise<PrismaClient> {
  return createPrismaClient();
}

// Export for backwards compatibility
export const prisma = getLocalPrisma();
