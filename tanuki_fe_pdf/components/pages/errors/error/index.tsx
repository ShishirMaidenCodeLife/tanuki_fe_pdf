"use client";

import { CustomTemplateError } from "@/components/errors/custom";

type ErrorPageClientProps = {
  error: Error;
  reset: () => void;
};

export const ErrorPageClient = ({ error }: ErrorPageClientProps) => {
  return (
    <CustomTemplateError
      errorMsg={error.message}
      extendCss="apply_height _apply_container_width"
      pageErrorType="error-page"
    />
  );
};
