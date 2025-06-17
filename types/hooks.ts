import { MutationOptions, UseQueryResult } from "@tanstack/react-query";
import * as Axios from "axios";

import { D3HierarchyCHNodeType, DefaultType, RoadmapDataType } from "@/types";

// #region UseMutationHookType
export type UseMutationHookType = {
  method: Axios.Method;
  route: string;
  onSuccess?: MutationOptions<DefaultType, unknown, DefaultType>["onSuccess"];
  onError?: MutationOptions<DefaultType, unknown, DefaultType>["onError"];
  onSettled?: MutationOptions<DefaultType, unknown, DefaultType>["onSettled"];
};

// #region useQueryRoadmapHook
export type RoadmapTitleType = {
  id: number;
  name: string;
  label: string;
  value: number;
  icon: string;
  group: string;
  color: string;
  param: string;
};

// Custom hook for initial non-AI api call of the roadmap
export type UseQueryRoadmapHookType = {
  chartData?: D3HierarchyCHNodeType;
  rolesQuery: UseQueryResult<RolesQueryResponseType> | DefaultType;
  roadmapTitles: RoadmapTitleType[];
  roadmapResponses: UseQueryResult<RoadmapDataType>[] | DefaultType;
  isRoadmapErrors: (null | string)[];
  isRoadmapFetchings: boolean[];
  roadmapErrors: (null | string)[];
  isRoadmapError: boolean;
  isRoadmapSuccess: boolean;
  isRoadmapFetching: boolean;
  roadmapError: null | string;
  error: string | Error | null;
  errorMsg: string;
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
  status?: string;
  children?: React.ReactNode;
};

// Custom hook for roles query
export type RolesQueryResponseType = {
  // roadmap_titles: DefaultType;
  titles: RoadmapTitleType[];
  // total_count?: number;
  // status?: string;
  params: string[];
};
// #endregion useQueryRoadmapHook

export type CookiesType = {
  [key: string]: string;
};
