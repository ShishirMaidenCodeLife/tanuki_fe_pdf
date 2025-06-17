"use client";

import { useEffect, useState } from "react";

import { useNavigationLoaderHook } from "@/hooks";
import { useAmplify } from "@/contexts/amplify";

export const useRedirectRequireAuthHook = (redirectPath: string = "/login") => {
  const { navigateWithLoader } = useNavigationLoaderHook();
  const {
    state: { isUserAuthenticated },
  } = useAmplify();

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR execution
    if (isUserAuthenticated === undefined) return; // Wait until authentication state is determined

    // Add a delay of 650ms before setting the shouldRender state
    const timer = setTimeout(() => {
      if (!isUserAuthenticated) {
        navigateWithLoader(redirectPath, true);
      } else {
        setShouldRender(true); // Allow rendering only if authenticated
      }
    }, 650); // 650ms delay

    return () => clearTimeout(timer); // Clean up the timer when the component is unmounted
  }, [isUserAuthenticated, navigateWithLoader, redirectPath]);

  return shouldRender; // Controls whether the component should render
};
