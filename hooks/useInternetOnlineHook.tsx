"use client";

import { useState, useEffect } from "react";

import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast } from "@/utils/methods/style";

// Detect internet status & show a toast if needed
export const useInternetOnlineHook = (showToast?: boolean) => {
  const [isOnline, setOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );

  // console.log("navigator", navigator);
  // console.log("navigator.onLine", navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setOnline(navigator.onLine);
    };

    // Attach event listeners on mount
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!isOnline && showToast) {
      handleCustomToast(TOAST_MESSAGES.network.noInternet);
    }
  }, [isOnline, showToast]);

  return isOnline;
};
