"use client";

import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

import { ThemeProviderType } from "@/types";

// Main Theme Provider
export const ThemeProvider = ({ children, themeProps }: ThemeProviderType) => {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <ToastProvider placement="top-center" />
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
};
