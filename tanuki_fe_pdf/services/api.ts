import { BASE_API } from "@/config/axios";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { ApiQueryType, DefaultType } from "@/types";

// Handle API errors and extract relevant information
export const getApiErrorMsgService = (error: DefaultType) => {
  // Check if the error is an object and has a 'message' property
  if (error && typeof error === "object" && "message" in error) {
    const errorObj = error as { message: string };

    // Try to parse the message as JSON if it's a stringified object
    try {
      const parsedError = JSON.parse(errorObj.message);

      return {
        ...parsedError,
        errorMsg:
          parsedError?.data?.detail ??
          TOAST_MESSAGES.statusCode?.[
            Number(
              parsedError?.status,
            ) as keyof typeof TOAST_MESSAGES.statusCode
          ]?.title ??
          "Client-side error message.",
      };
    } catch (parseError) {
      // In case of JSON parsing failure, return a generic error message
      console.error("Error parsing the message:", parseError);

      return {
        errorMsg: "Error parsing error message.",
      };
    }
  }

  // Default fallback for non-object errors or unexpected error formats
  return {
    errorMsg: "An unexpected error occurred.",
    status: 404,
  };
};

// REST API query function with improved structure and error handling
export const getApiBaseService = async (props: ApiQueryType) => {
  try {
    // const { method, route, formData, isCountry, isDev } = props;
    const { auth, method, route, params, formData } = props;
    const payload = {
      method: method ?? "GET",
      url: `${route}${params || ""}`,
      // headers: {
      //   Authorization: `Bearer ${auth?.access_token ?? ""}`,
      //   "X-Session-ID": auth?.session ?? "",
      // },
      headers: {
        "Content-Type": "application/json",
        ...(auth?.isUserAuthenticated && {
          Authorization: `Bearer ${auth?.idToken ?? ""}`,
        }),
      },
      data: formData, // Pass formData as the request data
    };
    const response = await BASE_API({ ...payload });

    return response.data;
  } catch (error: DefaultType) {
    throw error?.response?.data || error;
  }
};
