import { testApiAiSingleCallJson } from "@/data";
import { RoadmapJsonType, RoadmapStoreType } from "@/types";
import {
  FORM_ERROR_MESSAGES,
  TOAST_MESSAGES,
} from "@/utils/constants/messages";
import { ROUTES_VALUE_REGEX_PATTERN } from "@/utils/constants/regex";
import { handleCustomToast } from "@/utils/methods/style";
import { prependMdHeaderIfAbsent } from "@/utils/pages/route-templates/view/data";

export const getCheckedNodesNames = (
  checkedNodes: RoadmapJsonType[] | null | undefined,
): string => {
  if (!checkedNodes || checkedNodes.length === 0) return ""; // Return empty string if null, undefined, or empty array

  return checkedNodes
    .map(({ name }: RoadmapJsonType) => name)
    .filter(Boolean)
    .join(",");
};

export const parseRoutesValue = (value: string) => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

export const handleFormBuilderTestSubmit = ({
  setMd,
  setIsMdLoading,
}: {
  setMd: RoadmapStoreType["setMd"];
  setIsMdLoading: RoadmapStoreType["setIsMdLoading"];
}) => {
  setMd(prependMdHeaderIfAbsent(testApiAiSingleCallJson?.response));
  setIsMdLoading(false);
  handleCustomToast(TOAST_MESSAGES.api.singleAiCall.success);
};

export const validateRoutesLength = (value: string) => {
  const items = parseRoutesValue(value);

  if (items.length < 3) return FORM_ERROR_MESSAGES.routesValue.minRoutes;
  if (items.length > 10) return FORM_ERROR_MESSAGES.routesValue.maxRoutes;

  return true;
};

export const checkForValidRoutes = (input: string | null | undefined) => {
  if (!input) {
    return FORM_ERROR_MESSAGES.routesValue.required;
  }

  if (!ROUTES_VALUE_REGEX_PATTERN.test(input)) {
    return FORM_ERROR_MESSAGES.routesValue.incorrectFormat;
  }

  return validateRoutesLength(input);
};

export const getRouteName = (pathname = "", isAuthRoute?: boolean) => {
  if (!pathname.trim()) return ""; // Handle empty or whitespace input

  // Normalize the pathname (ensure it starts with a slash)
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  // Remove duplicate "/dashboard" occurrences
  const cleanedPath = normalizedPath
    .replace(/^\/dashboard\/?/, "/") // Remove leading "/dashboard" if present
    .replace(/\/+/g, "/"); // Ensure no duplicate slashes

  if (isAuthRoute) {
    return `/dashboard${cleanedPath === "/" ? "" : cleanedPath}`;
  }

  return cleanedPath;
};
