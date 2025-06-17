import { DefaultType } from "@/types";

// Custom debounce function
export function debounce<T extends (...args: DefaultType[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function (...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle the function to avoid multiple calls
export const throttleRAF = <T extends (...args: DefaultType[]) => void>(
  callback: T,
): T => {
  let isThrottling = false;

  return function (...args: Parameters<T>): void {
    if (!isThrottling) {
      isThrottling = true;
      requestAnimationFrame(() => {
        callback(...args);
        isThrottling = false;
      });
    }
  } as T;
};
