import { resolve } from "path";
import { existsSync } from "fs";

import { defineConfig } from "cypress";
import dotenv from "dotenv";

// Load environment variables based on Amplify branch
const getAmplifyEnvFile = () => {
  // AMPLIFY_BRANCH is set by Amplify during deployment
  switch (process.env.AMPLIFY_BRANCH) {
    case "main":
    case "master":
      return ".env.production";
    case "dev":
      return ".env.dev1";
    case "staging":
      return ".env.staging";
    default:
      // For local development or when AMPLIFY_BRANCH is not set
      return process.env.CYPRESS_ENV_FILE || ".env.dev1";
  }
};

// Try to load environment file if we're not in Amplify (local development)
if (!process.env.AMPLIFY_BRANCH) {
  const envPath = getAmplifyEnvFile();

  if (existsSync(resolve(__dirname, envPath))) {
    console.log(`Loading environment from: ${envPath}`);
    dotenv.config({ path: envPath });
  }
}

// Get environment variables with Amplify-aware defaults
const getEnvVar = (key: string, defaultValue: string): string => {
  // Try Amplify environment variables first
  const amplifyVar = process.env[`AMPLIFY_${key}`];

  if (amplifyVar) return amplifyVar;

  // Then try regular environment variables
  const normalVar = process.env[key];

  if (normalVar) return normalVar;

  // Finally use default
  return defaultValue;
};

// Set environment-aware values
const baseUrl = getEnvVar("TENGU_BASE_TEST_URL", "http://localhost:8081");
const BACKEND_URL = `${getEnvVar(
  "TENGU_BASE_URL",
  "https://gwy4g9mu71.execute-api.ap-northeast-1.amazonaws.com/Stage",
)}/api`;

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl,
    env: {
      BACKEND_URL,
    },
    setupNodeEvents() {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 10000,
  },
});
