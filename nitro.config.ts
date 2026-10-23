import type { NitroConfig } from "nitropack";

export default {
  preset: "vercel",
  compatibilityDate: "2026-10-20",
  // Disable streaming SSR — Vercel streaming delivers empty HTML with only stream boundary markers
  // causing hydration failure. Use regular SSR instead.
  serveStatic: true,
  // Nitro 3+ streaming config
  experimental: {
    streaming: false,
  },
} satisfies NitroConfig;
