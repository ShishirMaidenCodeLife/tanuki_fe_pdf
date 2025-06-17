import { UseQueryResult } from "@tanstack/react-query";

import { QueryKeyType } from "./types";

import { AmplifyStateType } from "@/types";

export const getAccessScope = (auth?: AmplifyStateType) =>
  auth?.isUserAuthenticated ? "private" : "public";

export const createQueryKey = (key: QueryKeyType, auth?: AmplifyStateType) =>
  ["routeTemplates", key, getAccessScope(auth)] as const;

// export const withDefaultData<T>=(queryResult: T & { data?: any }, fallback: any) =>{
//   const { data = fallback, ...rest } = queryResult;
//   return { ...rest, data };
// }
export const applyFallbackData = <TData>(
  queryResult: UseQueryResult<TData>,
  fallback = {},
) => {
  return {
    ...queryResult,
    data: queryResult.data ?? fallback,
  };
};
