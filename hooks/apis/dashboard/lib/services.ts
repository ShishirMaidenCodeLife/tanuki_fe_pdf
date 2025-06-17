import { useQuery, useQueries } from "@tanstack/react-query";

import { QUERY_KEYS, RETRY, STALE_TIME } from "./constants";
import { AvailableQueryType } from "./types";

import { getApiBaseService } from "@/services/api";
import { RT_API } from "@/utils/constants/api-constants";

export const createAvailableQueryHooks = ({
  auth,
  selectedCategories,
  keys,
  params,
}: AvailableQueryType) => {
  // Variables
  const { id: rawId = "" } = params || {};
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  // Common props
  const commonQueryProps = {
    retry: RETRY,
    staleTime: STALE_TIME,
  };

  // Gets multiple categories of route templates
  const useGetByCategory = () =>
    useQueries({
      queries: (selectedCategories || []).map((category) => ({
        queryKey: [...QUERY_KEYS.getByCategory(auth), category],
        queryFn: () =>
          getApiBaseService({
            auth,
            route: RT_API.getByCategory(category),
          }),
        enabled: !!category && keys.includes("useGetByCategory"),
        ...commonQueryProps,
      })),
    });

  // Gets a single category of route templates
  const useGetByUuid = () =>
    useQuery({
      queryKey: QUERY_KEYS.getByUuid(auth),
      queryFn: () =>
        getApiBaseService({
          auth,
          route: RT_API.getByUuid(id),
        }),
      enabled: keys.includes("useGetByUuid"),
      ...commonQueryProps,
    });

  return {
    useGetByCategory,
    useGetByUuid,
  };
};
