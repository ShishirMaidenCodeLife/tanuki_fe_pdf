"use client";

import { useCallback } from "react";

import { API_ENDPOINTS } from "@/config/api";
import {
  useMutationHook,
  useRoadmapStoreHook,
  useNavigationLoaderHook,
} from "@/hooks";
import { ApiErrorType, ApiSuccessType } from "@/types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast, handleErrorToast } from "@/utils/methods/style";
import { prependMdHeaderIfAbsent } from "@/utils/pages/route-templates/view/data";

// Main API hook to handle AI-based roadmap generation
export const useMutationSingleCallHook = () => {
  const { setMd, setIsMdLoading } = useRoadmapStoreHook();
  const { navigateWithLoader } = useNavigationLoaderHook();

  const onSuccess = useCallback(
    (data: ApiSuccessType) => {
      if (!data || data?.error || data?.status === 422) {
        handleErrorToast(data);
        setIsMdLoading(false);

        return;
      }

      setMd(prependMdHeaderIfAbsent(data?.response || ""));
      handleCustomToast(TOAST_MESSAGES.api.singleAiCall.success);
      setIsMdLoading(false);
      navigateWithLoader("route-templates", true);
    },
    [setIsMdLoading, setMd, navigateWithLoader],
  );

  const onError = useCallback(
    (error: ApiErrorType) => {
      setIsMdLoading(false);
      handleErrorToast(error);
    },
    [setIsMdLoading],
  );

  return useMutationHook({
    method: "POST",
    route: API_ENDPOINTS.generate_route,
    onSuccess,
    onError,
  });
};
