"use client";

import { useEffect } from "react";

// Reusable hook for handling keydown events
export const useKeyboardCtrlKeyHook = (
  keyCombo: string,
  actionCallback: () => void,
) => {
  useEffect(() => {
    // Handle keydown events for a specific key combo
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for key combination
      const isCtrlKey = event.ctrlKey || event.metaKey; // For Mac support (meta key)
      const isValidKey = event.key === keyCombo;

      if (isCtrlKey && isValidKey) {
        event.preventDefault(); // Prevent default action (e.g., browser zoom)
        actionCallback(); // Call the provided action callback
      }
    };

    // Return early if window is undefined
    if (typeof window === "undefined") return;

    // Attach keydown event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      // Return early if window is undefined
      if (typeof window === "undefined") return;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyCombo, actionCallback]); // Re-run if keyCombo or actionCallback changes

  return null; // No UI returned as it's a custom hook
};
