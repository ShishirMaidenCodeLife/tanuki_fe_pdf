"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";

import { createQueryClient } from "@/config/query-client";
import { AmplifyProvider } from "@/contexts/amplify";
import { ThemeProvider } from "@/contexts/theme";
import { ChildrenType, ThemeProviderType } from "@/types";

// Combined Default Providers
export function DefaultProviders(props: ChildrenType & ThemeProviderType) {
  const { children, themeProps } = props;
  const [queryClient] = useState(() => createQueryClient()); // Lazily initialize

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider themeProps={themeProps}>
        <AmplifyProvider>
          <ReactFlowProvider>{children}</ReactFlowProvider>
        </AmplifyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
