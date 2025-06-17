"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { AUTH_PRIVATE_ROUTES } from "@/utils/constants/site";

export const useAuthRouteHook = (
  authRoutes: Set<string> = new Set(AUTH_PRIVATE_ROUTES),
) => {
  const pathname = usePathname() ?? "";

  return useMemo(() => authRoutes.has(pathname), [pathname, authRoutes]);
};
