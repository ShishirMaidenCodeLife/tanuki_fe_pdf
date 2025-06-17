import { createQueryKey } from "./utils";

import { AmplifyStateType } from "@/types";

export const RETRY = 1;
export const STALE_TIME = 5 * 60 * 1000;

export const QUERY_KEYS = {
  getByCategory: (auth?: AmplifyStateType) =>
    createQueryKey("categories", auth),

  getByUuid: (auth?: AmplifyStateType) => createQueryKey("uuid", auth),

  // Add more keys easily
  getByCustom: (customKey: string, auth?: AmplifyStateType) =>
    createQueryKey(customKey, auth),
};
