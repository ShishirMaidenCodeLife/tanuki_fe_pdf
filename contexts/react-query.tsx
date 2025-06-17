"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { createQueryClient } from "@/config/query-client";
import { ChildrenType } from "@/types";

// Main React Query Provider
export const ReactQueryProvider = ({ children }: ChildrenType) => {
  const [queryClient] = useState(() => createQueryClient()); // Lazily initialize

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
