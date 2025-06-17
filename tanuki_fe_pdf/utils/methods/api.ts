export const normalizeUrl = (url: string) =>
  url.endsWith("/") ? url.slice(0, -1) : url;

// Appends "/api" to the base URL safely
export const getBaseUrl = (url: string | undefined): string => {
  if (!url) {
    throw new Error("Missing required environment variable: TENGU_BASE_URL");
  }

  const normalized = normalizeUrl(url);

  return `${normalized}/api`;
};
