import { Params } from "next/dist/server/request/params";

import { ApiQueryType } from "@/types";

export type AvailableQueryKeyType = "useGetByCategory" | "useGetByUuid" | "all";
export type AvailableQueryKeysType = AvailableQueryKeyType[];

export interface AvailableQueryType extends Pick<ApiQueryType, "auth"> {
  keys: AvailableQueryKeysType;
  selectedCategories?: string[];
  params?: Params;
}

export type QueryKeyType = "category" | "uuid" | string;
