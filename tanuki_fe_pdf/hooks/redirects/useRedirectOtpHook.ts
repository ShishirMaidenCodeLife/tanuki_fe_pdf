"use client";

import { useEffect, useState } from "react";

import { useCombinedAuthNavHook, useNavigationLoaderHook } from "@/hooks";

export const useRedirectOtpHook = () => {
  const { navigateWithLoader } = useNavigationLoaderHook();
  const { isOtpSent, isOtpLoading } = useCombinedAuthNavHook();

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent execution during SSR
    if (isOtpSent || isOtpLoading) return; // Skip if OTP is sent or loading

    // Delay the redirect or any action for 650ms
    const timer = setTimeout(() => {
      navigateWithLoader("/login", true); // Redirect to login after 650ms delay
    }, 650);

    return () => clearTimeout(timer); // Cleanup the timer if effect is cleaned up
  }, [isOtpSent, isOtpLoading, navigateWithLoader]);

  useEffect(() => {
    // Introduce delay to determine if the component should render
    const timer = setTimeout(() => {
      setShouldRender(isOtpSent && !isOtpLoading);
    }, 650);

    return () => clearTimeout(timer); // Cleanup the timer if effect is cleaned up
  }, [isOtpSent, isOtpLoading]);

  return shouldRender; // Controls whether the component should render
};
