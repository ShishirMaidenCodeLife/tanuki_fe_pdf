import axios from "axios";

import { env } from "@/config/env";
import { getBaseUrl } from "@/utils/methods/api";

// Extract values and set defaults
const baseURL = getBaseUrl(env.TENGU_BASE_URL);
const timeout = Number(env.API_TIMEOUT) || 10000;

// Create the axios instance
export const BASE_API = axios.create({
  baseURL,
  timeout,
});
