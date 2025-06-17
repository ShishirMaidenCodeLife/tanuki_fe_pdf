import { QueryClient } from "@tanstack/react-query";

// Query Client Configuration
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
        retryDelay: 1000,
        staleTime: 0, // No cache in development
        gcTime: 10 * 60 * 1000, // Keep unused data for 10 minutes
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
    },
  });
