"use client";

import { useMutation } from "@tanstack/react-query";

import { getApiBaseService } from "@/services/api";
import { DefaultType, UseMutationHookType } from "@/types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast } from "@/utils/methods/style";

// Api calls using react-query
export const useMutationHook = (props: UseMutationHookType) => {
  // Destructure
  const {
    method,
    route,
    // timeout,
    // id,
    onSuccess,
    onError,
    onSettled,
  } = props;

  const mutation = useMutation({
    mutationFn: (formData: DefaultType) => {
      return getApiBaseService({ method, route, formData });
    },
    onSuccess: (data, variables, context) => {
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (error instanceof Error && error.message === "Timeout") {
        handleCustomToast(TOAST_MESSAGES.api.default.requestTimedOut);
      }

      if (onError) {
        onError(error, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (onSettled) {
        onSettled(data, error, variables, context);
      }
    },
  });

  return mutation;
};
