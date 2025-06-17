"use client";

import { useState, useEffect } from "react";

// Custom hook to handle individual media query
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    setMatches(mediaQuery.matches);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

// Refined useStyleResponsiveQueryHook without useMemo for hooks
export const useStyleResponsiveQueryHook = () => {
  // Directly call useMediaQuery for each media query
  const isXs = useMediaQuery("(max-width: 480px)"); // Extra Small (Phones)
  const isSm = useMediaQuery("(min-width: 481px) and (max-width: 768px)"); // Small (Tablets)
  const isMd = useMediaQuery("(min-width: 769px) and (max-width: 1024px)"); // Medium (Laptops)
  const isLg = useMediaQuery("(min-width: 1025px) and (max-width: 1440px)"); // Large (Desktops)
  const isXl = useMediaQuery("(min-width: 1441px) and (max-width: 1920px)"); // Extra Large
  const is2Xl = useMediaQuery("(min-width: 1921px)"); // Ultra-Wide Screens

  return { isXs, isSm, isMd, isLg, isXl, is2Xl };
};
