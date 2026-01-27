/// <reference types="@cloudflare/workers-types" />

export {};

declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

