"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition, useRef, useEffect, useCallback } from "react";

import { useAuthRouteHook, useRoadmapStoreHook } from "@/hooks";
import { getRouteName } from "@/utils/methods/app";
import { siteConstants } from "@/data/custom/site";

export const useNavigationLoaderHook = () => {
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname(); // Get current path to detect route changes
  const isAuthRoute = useAuthRouteHook();
  const { setIsGlobalLoading } = useRoadmapStoreHook();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Stop loading function
  const stopLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
    setIsGlobalLoading(false);
  }, [setIsGlobalLoading]);

  // Navigate with loader
  const navigateWithLoader = useCallback(
    (route: string, replace = false) => {
      setLoading(true);
      setIsGlobalLoading(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      startTransition(() => {
        const finalRoute = route.startsWith("/")
          ? route
          : getRouteName(route, isAuthRoute);

        replace ? router.replace(finalRoute) : router.push(finalRoute);

        // Timeout in case route change is slow
        timeoutRef.current = setTimeout(
          stopLoading,
          siteConstants.GLOBAL_LOADING_TIME,
        );
      });
    },
    [isAuthRoute, router, setIsGlobalLoading, stopLoading],
  );

  // Detect route change using pathname
  useEffect(() => {
    stopLoading(); // Stop loading when pathname changes
  }, [pathname, stopLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopLoading();
  }, [stopLoading]);

  return { isNavigating: loading || pending, navigateWithLoader };
};

// "use client";

// import { useState, useTransition, useRef, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";

// import { useAuthRouteHook, useRoadmapStoreHook } from "@/hooks";
// import { getRouteName } from "@/utils/methods/app";

// export const DEFAULT_GLOBAL_LOADING_TIME = 10000;

// export const useNavigationLoaderHook = () => {
//   const [loading, setLoading] = useState(false);
//   const [pending, startTransition] = useTransition();
//   const router = useRouter();
//   const isAuthRoute = useAuthRouteHook();
//   const { setIsGlobalLoading } = useRoadmapStoreHook();
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Navigate with loader
//   const navigateWithLoader = useCallback(
//     (route: string, replace = false) => {
//       setLoading(true);
//       setIsGlobalLoading(true);

//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       startTransition(() => {
//         const finalRoute = route?.startsWith("/")
//           ? route
//           : getRouteName(route, isAuthRoute);

//         replace ? router.replace(finalRoute) : router.push(finalRoute);
//       });

//       timeoutRef.current = setTimeout(() => {
//         setLoading(false);
//         setIsGlobalLoading(false);
//       }, DEFAULT_GLOBAL_LOADING_TIME);
//     },
//     [isAuthRoute, router, setIsGlobalLoading], // Dependencies
//   );

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//       setIsGlobalLoading(false);
//     };
//   }, []);

//   return { isNavigating: loading || pending, navigateWithLoader };
// };
