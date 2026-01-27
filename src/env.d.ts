/// <reference types="@cloudflare/workers-types" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SECRET: string;
      DATABASE_URL?: string;
    }
  }
}

export interface CloudflareEnv {
  DB: D1Database;
}
