import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// Configure Edge Runtime for Cloudflare Pages
export const runtime = 'edge';