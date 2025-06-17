import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS, RETRY, STALE_TIME } from "./constants";
import { AvailableQueryType } from "./types";

import { getApiBaseService } from "@/services/api";
import { RT_API } from "@/utils/constants/api-constants";

export const createAvailableQueryHooks = ({
  auth,
  selectedCategory,
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

  // Gets a single category of route templates
  const useGetByCategory = () =>
    useQuery({
      queryKey: QUERY_KEYS.getByCategory(auth),
      queryFn: () =>
        getApiBaseService({
          auth,
          route: RT_API.getByCategory(selectedCategory),
        }),
      enabled: !!selectedCategory && keys.includes("useGetByCategory"),
      ...commonQueryProps,
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
