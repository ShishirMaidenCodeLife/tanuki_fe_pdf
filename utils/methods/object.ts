import { DefaultType } from "@/types";

// Safely parses JSON data if it's a valid object
const safeParseJson = <T = object | string | number | boolean>(
  data: string | null | undefined,
): T | string | null => {
  // Check for null or undefined and return null if so
  if (data === null || data === undefined) {
    console.warn("Data is null or undefined.");

    return null;
  }

  // Check for empty string and return null
  if (data === "") {
    console.warn("Data is an empty string.");

    return null;
  }

  try {
    // Try parsing the data as JSON
    const parsed = JSON.parse(data);

    // If parsed value is an object or array, return it
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as T;
    }

    // If parsed is not an object, return it as a string (to cover non-object data like number, boolean)
    return String(parsed);
  } catch (error) {
    // If JSON.parse throws an error, it means data was not valid JSON, return as string
    console.warn("Data is not valid JSON, returning raw string:", error);

    return data;
  }
};

const omitProperties = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const newObj = { ...obj };

  for (const key of keys) {
    delete newObj[key];
  }

  return newObj;
};

const isSubset = (
  mainObj?: Record<string, DefaultType>,
  subsetObj?: Record<string, DefaultType>,
): boolean => {
  if (!mainObj || !subsetObj) return false;

  return Object.entries(subsetObj).every(
    ([key, value]) => mainObj[key] === value,
  );
};

// Check if an object is invalid (null, undefined, empty object, or empty array)
const isInvalidObject = <T>(obj: T | null | undefined): boolean => {
  // Check for null or undefined
  if (obj === null || obj === undefined) {
    return true;
  }

  // Check if it's an object type
  if (typeof obj !== "object") {
    return false;
  }

  // Handle array case (arrays are objects in JavaScript)
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  // For objects, check if it has no own enumerable properties
  return Object.keys(obj).length === 0;
};
// Output
// These will return true
// console.log(isInvalidObject(null));
// console.log(isInvalidObject(undefined));
// console.log(isInvalidObject({}));
// console.log(isInvalidObject([]));

// // These will return false
// console.log(isInvalidObject({ key: 'value' }));
// console.log(isInvalidObject([1, 2, 3]));
// console.log(isInvalidObject(42));
// console.log(isInvalidObject('string'));

// Utility to safely parse JSON
const safeParseStorage = (key: string, defaultValue: string | string[]) => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const storedValue = localStorage.getItem(key);
    // If no value is found, return the default value

    if (storedValue === null) return defaultValue;

    // // If the stored value is a string, return it as is
    // if (typeof storedValue === "string") return storedValue;

    // Return: Attempt to parse the stored value
    return JSON.parse(storedValue);
  } catch {
    // If parsing fails, return the default value
    return defaultValue;
  }
};

// interface SizeResult {
//   size: number;
//   unit: string;
// }

// export const getJsonSize = (data: DefaultType): SizeResult => {
//   try {
//     const jsonString = JSON.stringify(data);
//     const bytes = new Blob([jsonString]).size;

//     if (bytes < 1024) return { size: bytes, unit: "B" };
//     if (bytes < 1048576)
//       return { size: Number((bytes / 1024).toFixed(2)), unit: "KB" };

//     if (bytes < 1073741824)
//       return { size: Number((bytes / 1048576).toFixed(2)), unit: "MB" };

//     return { size: Number((bytes / 1073741824).toFixed(2)), unit: "GB" };
//   } catch (error) {
//     console.error("Error calculating JSON size:", error);
//     return { size: 0, unit: "B" };
//   }
// };

export {
  isInvalidObject,
  isSubset,
  omitProperties,
  safeParseJson,
  safeParseStorage,
};
