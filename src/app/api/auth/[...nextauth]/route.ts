import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// Use edge runtime only in production (Cloudflare)
// export const runtime = "edge";
