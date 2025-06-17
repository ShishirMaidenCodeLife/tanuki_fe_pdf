import axios from "axios";

import { env } from "@/config/env";
import { getBaseUrl } from "@/utils/methods/api";

// Extract values and set defaults
// Only create axios instance if we have the required environment variables
let BASE_API: ReturnType<typeof axios.create>;

try {
  const baseURL = getBaseUrl(env.FE_BACKEND_BASE_URL);
  const timeout = Number(env.FE_TIMEOUT) || 10000;

  // Create the axios instance
  BASE_API = axios.create({
    baseURL,
    timeout,
  });
} catch (error) {
  console.warn("⚠️ Failed to initialize axios instance:", error);
  // Create a fallback instance for build-time safety
  BASE_API = axios.create({
    baseURL: "http://localhost:3000/api", // fallback
    timeout: 10000,
  });
}

export { BASE_API };
