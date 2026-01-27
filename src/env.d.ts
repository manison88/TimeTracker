/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SECRET: string;
      DATABASE_URL?: string;
    }
  }
}

declare module "@cloudflare/next-on-pages" {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

export {};
