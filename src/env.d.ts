/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SECRET: string;
      DATABASE_URL?: string;
    }
  }
}

// Declare the CloudflareEnv inside the @cloudflare/next-on-pages module
declare module "@cloudflare/next-on-pages" {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

export {};
