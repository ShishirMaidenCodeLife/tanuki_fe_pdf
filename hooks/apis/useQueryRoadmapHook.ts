"use client";

import { useMemo } from "react";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/config/api";
import { testSampleCombinedRoadmapJson } from "@/data";
import { getApiErrorMsgService, getApiBaseService } from "@/services/api";
import {
  RoadmapDataType,
  RoadmapTitleType,
  UseQueryRoadmapHookType,
} from "@/types";
import { convertToDonut } from "@/utils/pages/map/donuts";

// Roles query
const useRolesQuery = () => {
  return useQuery({
    queryKey: ["roadmap", "roles"],
    queryFn: async () => {
      const route = API_ENDPOINTS["get_roadmap_titles_api"].getRoles;

      if (!route) {
        throw new Error("API endpoint is undefined.");
      }
      const response = await getApiBaseService({ route });

      return response ?? {};
    },
    select: (data) => ({
      titles: convertToDonut(data?.roadmap_titles ?? []),
      params: data?.roadmap_titles ?? [],
    }),
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
};

// Roadmap roadmap queries
const useRoadmapRoadmaps = (
  params: string[] = [],
  enabled: boolean,
): UseQueryResult<RoadmapDataType>[] => {
  // Ensure we always pass an array to useQueries, even if empty
  const queries = enabled
    ? params.map((param) => ({
        queryKey: ["roadmap", "Roadmap", param],
        queryFn: async () => {
          try {
            const response = await getApiBaseService({
              route: API_ENDPOINTS.roadmap.getByRoleOrSkill(param),
            });

            return response ?? {}; // Ensure no undefined return
          } catch (error) {
            console.error(`Error fetching roadmap for ${param}:`, error);

            return {}; // Return an empty object to prevent query errors
          }
        },
        enabled: !!param, // Ensures only valid params trigger queries
        retry: 2,
        staleTime: 5 * 60 * 1000,
      }))
    : [];

  // Call useQueries with an array (even if empty)
  return useQueries({ queries });
};

// Initial non-AI api call of the roadmap
export const useQueryRoadmapHook = (): UseQueryRoadmapHookType => {
  //Roles query
  const rolesQuery = useRolesQuery();

  // Roadmap roadmap queries
  const roadmapQueries = useRoadmapRoadmaps(
    rolesQuery.data?.params || [],
    !rolesQuery.isError,
  );

  // Memoized Roadmap data processing
  const roadmapResults = useMemo(() => {
    const errors: boolean[] = [];
    const successes: boolean[] = [];
    const fetchings: boolean[] = [];
    const data: RoadmapDataType[] = [];
    const errorMsgs: string[] = [];

    roadmapQueries.forEach(
      ({ data: queryData, error, isError, isFetching, isSuccess }) => {
        if (queryData) data.push(queryData);
        if (error) errorMsgs.push(error.message);
        errors.push(isError);
        fetchings.push(isFetching);
        successes.push(isSuccess);
      },
    );

    return {
      data,
      errors: errorMsgs,
      isError: errors.some(Boolean),
      isSuccess: successes.every(Boolean) && successes.length > 0,
      isFetching: fetchings.some(Boolean),
      firstError: errorMsgs[0],
    };
  }, [roadmapQueries]);

  // Memoized combined status
  const status =
    //  useMemo(
    // () =>
    {
      isFetching: rolesQuery.isFetching || roadmapResults.isFetching,
      isError: rolesQuery.isError || roadmapResults.isError,
      isSuccess: rolesQuery.isSuccess && roadmapResults.isSuccess,
      error: rolesQuery.isError ? rolesQuery.error : roadmapResults.firstError,
    };
  // [rolesQuery, roadmapResults],

  // Memoized error details
  // const { errorMsg } = useMemo(
  //   () => getApiErrorMsgService(status.error),
  //   [status.error],
  // );
  const { errorMsg } = getApiErrorMsgService(status.error);

  // Handle roadmap titles with proper null checks and type safety
  const roadmapTitles = useMemo(() => {
    if (!rolesQuery.data?.titles) return [];

    return rolesQuery.data.titles.map((title: RoadmapTitleType) => {
      // Safely access roadmapResults data with null checks
      const matchingRoadmapSkill = roadmapResults?.data?.find(
        (item: RoadmapDataType) =>
          item &&
          item.map_title &&
          title?.name &&
          item.map_title === title?.name,
      );

      return {
        ...title,
        param: matchingRoadmapSkill?.roadmap_json?.name || "",
      };
    });
  }, [rolesQuery.data?.titles, roadmapResults?.data]);

  // Handle roadmap data with proper null checks and type safety
  // const chartData = createMapD3Hierarchy(roadmapData);

  // Use sample data if in development mode
  if (process.env.stub_mode === "stub") return testSampleCombinedRoadmapJson;

  const apiResult = {
    // First Api - Variables
    rolesQuery,
    roadmapTitles,

    // Second Api - Variables
    roadmapResponses: roadmapQueries,
    // roadmapData,
    // chartData,
    isRoadmapErrors: roadmapResults.errors,
    isRoadmapFetchings: [roadmapResults.isFetching],
    roadmapErrors: roadmapResults.errors,
    isRoadmapError: roadmapResults.isError,
    isRoadmapSuccess: roadmapResults.isSuccess,
    isRoadmapFetching: roadmapResults.isFetching,
    roadmapError: roadmapResults.firstError,

    // Both Api - Common variables between both api calls
    error: status.error,
    errorMsg,
    isError: status.isError,
    isSuccess: status.isSuccess,
    isFetching: status.isFetching,
  };

  // return apiResult;

  const isApiResult =
    apiResult?.roadmapResponses?.length > 0 &&
    apiResult?.roadmapTitles?.length > 0;

  return isApiResult ? apiResult : testSampleCombinedRoadmapJson;
};
