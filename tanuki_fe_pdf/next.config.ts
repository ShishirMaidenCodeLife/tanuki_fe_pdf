import { resolve } from "path";

import * as dotenv from "dotenv";

// Step 1: Load base .env or .env.dev1 first (optional, fallback)
dotenv.config({ path: resolve(__dirname, ".env.dev1") }); // or just `.env`

// Step 2: Now TENGU_MODE might be set
const nodeEnv = process.env.NODE_ENV || "development";
const mode =
  process.env.TENGU_MODE || (nodeEnv === "development" ? "dev1" : "production");

// Step 3: Load mode-specific .env file (e.g., .env.dev1, .env.dev2)
dotenv.config({ path: resolve(__dirname, `.env.${mode}`) });

// Step 4: Import your `env` values *after* all envs are loaded
import { env } from "./config/env";

const nextConfig = {
  images: {
    unoptimized: true,
    domains: ["localhost", "your-domain.com"],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
  env: { ...env },
  typescript: {
    // Only show errors, not warnings
    ignoreBuildErrors: false,
    tsconfigPath: "tsconfig.json",
  },
  eslint: {
    // Only show errors, not warnings
    ignoreDuringBuilds: false,
    ignoreDevelopmentErrors: false,
    dirs: ["pages", "components", "lib", "utils", "config", "hooks", "types"],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
