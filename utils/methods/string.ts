// #region STRING CASE CONVERSIONS
/* -------------------- STRING CASE CONVERSIONS -------------------- */

// Convert a string to title case (e.g., "helloWorld" → "Hello World")
export function toTitleCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Convert camelCase to space-separated
    .replace(/[_-]/g, " ") // Convert snake_case and kebab-case to spaces
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim() // Remove leading/trailing spaces
    .toLowerCase() // Convert to lowercase first
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

// Convert a string to start case (e.g., "hello-world" → "Hello World")
export function toStartCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Convert camelCase to space-separated words
    .replace(/[-_]+/g, " ") // Replace hyphens/underscores with space
    .toLowerCase() // Convert everything to lowercase first
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .trim(); // Remove leading/trailing spaces
}

// #endregion STRING CASE CONVERSIONS

// #region STRING FORMAT CONVERSIONS
/* -------------------- STRING FORMAT CONVERSIONS -------------------- */

// Convert a string to snake_case (e.g., "Hello World" → "hello_world")
export function toSnakeCase(title?: string): string {
  if (typeof title !== "string" || !title.trim()) {
    return "";
  }

  return title
    .trim()
    .replace(/[\s-]+/g, "_") // Replace spaces and dashes with underscores
    .replace(/[^\w_]/g, "") // Remove all non-word characters except underscores
    .replace(/_+/g, "_") // Reduce multiple underscores to a single one
    .toLowerCase();
}

// Convert a string to kebab-case (e.g., "Hello World" → "hello-world")
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Convert camelCase to kebab-case
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphen
    .toLowerCase(); // Convert everything to lowercase
}
// #endregion STRING FORMAT CONVERSIONS

// #region EMAIL UTILITIES
/* -------------------- EMAIL UTILITIES -------------------- */

// Truncate email address to a certain length
export function truncateEmail(email: string, maxLength: number = 30): string {
  const [local, domain] = email.split("@");

  if (email.length <= maxLength) return email; // No need to truncate

  const visibleStart = local.slice(0, 6); // Keep first 6 characters
  const visibleEnd = local.slice(-2); // Keep last 2 characters before @

  return `${visibleStart}...${visibleEnd}@${domain}`;
}
// #endregion EMAIL UTILITIES

export const generateUniqueId = (index: number, title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug}-${index}`;
};
