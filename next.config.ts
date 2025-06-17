import { resolve } from "path";
import { existsSync } from "fs";

import * as dotenv from "dotenv";

// --- Environment Variable Loading ---
// This section implements environment variable loading with fallbacks:
// 1. System environment variables (Amplify/GitHub Actions)
// 2. Local .env files for development

const nodeEnv = process.env.NODE_ENV || "development";
const feMode = process.env.FE_MODE;
const effectiveMode =
  feMode || (nodeEnv === "development" ? "dev1" : "production");

// For staging and production: use production NODE_ENV
// For dev1/dev2: use development NODE_ENV
const effectiveNodeEnv =
  effectiveMode === "staging" || effectiveMode === "production"
    ? "production"
    : "development";

console.log(
  `🌍 Loading environment for mode: ${effectiveMode} (NODE_ENV: ${nodeEnv} → ${effectiveNodeEnv})`,
);

// Only load .env files for development modes (dev1, dev2)
if (effectiveNodeEnv === "development") {
  // Path for the initial/base .env file
  const baseEnvPath = resolve(__dirname, ".env.dev1");

  if (existsSync(baseEnvPath)) {
    console.log(`📄 Loading base environment from: ${baseEnvPath}`);
    dotenv.config({ path: baseEnvPath });
  }

  // Path for the mode-specific .env file
  const modeSpecificEnvPath = resolve(__dirname, `.env.${effectiveMode}`);

  if (existsSync(modeSpecificEnvPath)) {
    console.log(
      `📄 Loading mode-specific environment from: ${modeSpecificEnvPath}`,
    );
    dotenv.config({ path: modeSpecificEnvPath, override: true });
  }
} else {
  // For production/staging, rely on system environment variables
  console.log(
    `🔧 Using system environment variables for ${effectiveMode} deployment`,
  );

  // Validate that critical environment variables are present
  const requiredVars = ["FE_USER_POOLS_ID", "FE_USER_POOLS_WEB_CLIENT_ID"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missingVars.join(", ")}`,
    );
    console.error(
      "Please ensure these are set in your deployment environment (Amplify/GitHub Actions)",
    );
    // Don't exit here as it would break the config loading, let the app handle it
  } else {
    console.log(`✅ Required environment variables are present`);
  }
}

// Step 4: Import your `env` values *after* all envs are loaded
import { env } from "./config/env"; // Ensure this path is correct

// --- Next.js Configuration ---

// Helper constants for environment checks
const isDevelopment = effectiveNodeEnv === "development";
const isProduction = effectiveNodeEnv === "production";

const nextConfig = {
  // Standard compiler options
  compiler: {
    removeConsole: isProduction,
  },

  // Pass environment variables to the client
  env: { ...env },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: isDevelopment, // Skip during development for speed
    dirs: ["pages", "components", "lib", "utils", "config", "hooks", "types"],
  },

  // Experimental features - simplified for Turbopack compatibility
  experimental: {
    // Only include features compatible with Turbopack
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:8080"],
    },
  },

  images: {
    unoptimized: isDevelopment, // Use the constant
    domains: ["localhost", "your-domain.com"], // Keep if needed
    formats: ["image/avif", "image/webp"], // Standard, keep if using
    remotePatterns: [
      // Keep if needed
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  reactStrictMode: true, // Good practice, usually kept. Default in Next.js 13+ for new projects.

  typescript: {
    ignoreBuildErrors: isDevelopment, // Use the constant

    // `tsconfigPath: "tsconfig.json"` is the default.
    // Can be omitted if your tsconfig.json is at the project root.
    // tsconfigPath: "tsconfig.json",
  },
};

export default nextConfig;
