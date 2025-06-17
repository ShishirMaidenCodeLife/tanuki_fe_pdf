import { resolve } from "path";
import { existsSync } from "fs";

import { defineConfig } from "cypress";
import dotenv from "dotenv";

// Load environment variables based on Amplify branch
const getAmplifyEnvFile = () => {
  // AMPLIFY_BRANCH is set by Amplify during deployment
  switch (process.env.AMPLIFY_BRANCH) {
    case "main":
      // Production uses Amplify environment variables, no .env file needed
      return null;
    case "staging":
      // Staging uses Amplify environment variables, no .env file needed
      return null;
    case "dev":
      return ".env.dev1";
    default:
      // For local development or when AMPLIFY_BRANCH is not set
      return process.env.CYPRESS_ENV_FILE || ".env.dev1";
  }
};

// Try to load environment file if we're not in Amplify (local development)
// and if an env file is specified
if (!process.env.AMPLIFY_BRANCH) {
  const envPath = getAmplifyEnvFile();

  if (envPath && existsSync(resolve(__dirname, envPath))) {
    console.log(`Loading environment from: ${envPath}`);
    dotenv.config({ path: envPath });
  } else if (envPath) {
    console.log(
      `Environment file ${envPath} not found, using system environment variables`,
    );
  } else {
    console.log(`Using Amplify environment variables (no .env file needed)`);
  }
}

// Get environment variables with Amplify-aware defaults
const getEnvVar = (
  key: string,
  defaultValue = "http://localhost:8080",
): string => {
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
const baseUrl = getEnvVar("FE_LOCAL_TEST_URL");
const FE_BACKEND_BASE_URL = `${getEnvVar("FE_BACKEND_BASE_URL")}/api`;
const FE_TIMEOUT = getEnvVar("FE_TIMEOUT");

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    baseUrl,
    env: {
      FE_BACKEND_BASE_URL,
      FE_TIMEOUT,
    },
    setupNodeEvents() {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 100000,
    pageLoadTimeout: 100000,
  },
});
