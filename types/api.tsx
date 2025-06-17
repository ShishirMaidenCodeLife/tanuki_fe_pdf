import { AxiosRequestConfig } from "axios";

import { AmplifyContextType, DefaultType } from "@/types";

export type ApiQueryType = {
  route: string;
  params?: string;
  // auth?: AuthDataSchema;
  method?: AxiosRequestConfig["method"];
  formData?: DefaultType;
  auth?: AmplifyContextType["state"];
  // isDev?: boolean;
  // isCountry?: boolean;
};

export type AxiosErrorResponse = {
  response?: {
    data?: DefaultType;
    status?: number;
    statusText?: string;
    headers?: DefaultType;
  };
  message?: string;
};

export type ApiSuccessType = DefaultType | { response: string };
export type ApiErrorType = DefaultType | { message: string };

export type LocalizedContentType = {
  en: string;
  ja: string;
};

export type ProgressType = {
  total: number;
  completed: number;
};

export type RouteTemplateApiType = {
  uuid: string; // Required
  entityType?: string;
  entityId?: string;
  title?: string;
  content?: string;
  status?: string;
  description?: string;
  localizedNames?: LocalizedContentType;
  localizedTitles?: LocalizedContentType;
  localizedDescriptions?: LocalizedContentType;
  localizedContent?: LocalizedContentType;
  progress?: ProgressType;
  thumbnailPath?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string | null;
  categories?: string[];
};

export type RouteTemplatesApiType = {
  category?: string;
  totalCount?: number;
  routeTemplates?: RouteTemplateApiType[];
};
