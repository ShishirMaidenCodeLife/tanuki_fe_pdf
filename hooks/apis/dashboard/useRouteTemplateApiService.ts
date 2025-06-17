"use client";

import { useParams } from "next/navigation";

import { createAvailableQueryHooks } from "./lib/services";
import { AvailableQueryKeysType } from "./lib/types";
import { applyFallbackData } from "./lib/utils";

import { useCombinedAuthNavHook, useRoadmapStoreHook } from "@/hooks";

export const useRouteTemplateApiService = (keys: AvailableQueryKeysType) => {
  const { auth } = useCombinedAuthNavHook();
  const {
    dashboardParams: { selectedCategories },
  } = useRoadmapStoreHook();
  const params = useParams();

  // Create common props for the query hooks
  const commonProps = { auth, selectedCategories, keys, params };

  // Create query hooks for the available queries
  const { useGetByCategory, useGetByUuid } =
    createAvailableQueryHooks(commonProps);

  // Apply fallback data to the query results
  const getByCatResponse = useGetByCategory().map((result) =>
    applyFallbackData(result),
  );
  const getByUuidResponse = applyFallbackData(useGetByUuid());

  return {
    getByCatResponse,
    getByUuidResponse,
  };
};
