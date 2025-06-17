export const normalizeUrl = (url: string) =>
  url.endsWith("/") ? url.slice(0, -1) : url;

// Appends "/api" to the base URL safely
export const getBaseUrl = (url: string | undefined): string => {
  if (!url) {
    console.error(
      "❌ Missing required environment variable: FE_BACKEND_BASE_URL",
    );
    console.error("Current environment variables:", {
      FE_MODE: process.env.FE_MODE,
      FE_BACKEND_BASE_URL: process.env.FE_BACKEND_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
    throw new Error(
      "Missing required environment variable: FE_BACKEND_BASE_URL. Please ensure it's defined in your environment configuration.",
    );
  }

  const normalized = normalizeUrl(url);

  return `${normalized}/api`;
};
