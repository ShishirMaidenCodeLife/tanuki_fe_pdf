"use client";

import { useEffect, useState } from "react";

import { useNavigationLoaderHook } from "@/hooks";
import { useAmplify } from "@/contexts/amplify";

export const useRedirectAuthHook = (redirectPath: string = "/dashboard") => {
  const { navigateWithLoader } = useNavigationLoaderHook();
  const {
    state: {
      isUserAuthenticated,
      loading: { isLoading, isLogoutLoading },
    },
  } = useAmplify();

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR execution

    if (isUserAuthenticated === undefined || isLoading || isLogoutLoading)
      return; // Wait until authentication state is determined

    if (isUserAuthenticated) {
      navigateWithLoader(redirectPath, true);
    } else {
      // Delay setting shouldRender to true by 650ms
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, 650);

      // Cleanup timer if the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [
    isLoading,
    isLogoutLoading,
    isUserAuthenticated,
    navigateWithLoader,
    redirectPath,
  ]);

  return shouldRender; // Controls whether the component should render
};
