"use client";

import { usePathname } from "next/navigation";

import { useAmplify } from "@/contexts/amplify";
import { useAuthRouteHook } from "@/hooks";
import {
  AUTH_PUBLIC_ROUTES,
  BLUR_NAV_ROUTES,
  DASHBOARD_PRIVATE_ROUTES,
  SITE_ROUTES,
} from "@/utils/constants/site";

export const useCombinedAuthNavHook = () => {
  // Extract authentication state from the Amplify context
  const { state: auth } = useAmplify();
  const {
    isOtpSent,
    isUserAuthenticated,
    idToken,
    loading: { isLoading, isLogoutLoading, isOtpLoading },
  } = auth;
  const pathname = usePathname();
  const isAuthRoute = useAuthRouteHook();

  // Check if the current route is a dashboard route
  const isDashboardPath = DASHBOARD_PRIVATE_ROUTES?.includes(pathname);
  const isAuthPublicPagePath = AUTH_PUBLIC_ROUTES.includes(pathname);

  // Get the current pathname from Next.js router
  const currentPath = usePathname();

  // Process the path segments from the current URL
  let pathSegments = currentPath.split("/").filter(Boolean);
  const isRootPath = ["", "/", "/dashboard"]?.includes(currentPath);
  const isDashboard = currentPath === "/dashboard";

  // Remove consecutive "dashboard" segments for cleaner breadcrumbs
  pathSegments = pathSegments.filter(
    (segment, index, arr) =>
      !(
        segment === "dashboard" &&
        (index === 0 || arr[index - 1] === "dashboard")
      ),
  );

  // Check if the current route requires a blurred navigation
  const shouldBlurNav = BLUR_NAV_ROUTES.includes(currentPath);

  // Determine if breadcrumbs should be hidden
  const shouldHideAuthHeaderButtons = AUTH_PUBLIC_ROUTES.includes(currentPath);
  const isDisplaySingleRoute =
    pathSegments.includes("route-templates") && pathSegments.length === 2;

  // If the current path is a single route template, remove the last segment as it is the unique template ID/uuid
  if (isDisplaySingleRoute) pathSegments = pathSegments.slice(0, -1);

  const shouldHideBreadcrumbs =
    isRootPath ||
    (!SITE_ROUTES.matchers.includes(currentPath) && !isDisplaySingleRoute);

  const shouldHideFromAuthPages = isAuthRoute || isUserAuthenticated;
  const shouldRedirectDashboard =
    !isDashboardPath && !isLoading && isUserAuthenticated;
  // Extract user email from the authentication token, defaulting to "N/A" if unavailable
  const userEmail = idToken?.payload?.email?.toString() || "N/A";

  // const isAuth = isAuthRoute && isUserAuthenticated;
  const isAuth = isAuthRoute;

  return {
    auth,
    currentPath,
    isAuth,
    isAuthPublicPagePath,
    isAuthRoute,
    isDashboard,
    isDashboardPath,
    isLoading,
    isLogoutLoading,
    isOtpLoading,
    isOtpSent,
    isRootPath,
    isUserAuthenticated,
    idToken,
    pathSegments,
    shouldBlurNav,
    pathname,
    shouldHideAuthHeaderButtons,
    shouldHideFromAuthPages,
    shouldHideBreadcrumbs,
    shouldRedirectDashboard,
    userEmail,
  };
};
