"use client";

import { CustomTemplateError } from "@/components/errors/custom";

export const NotFoundPageClient = ({ error }: { error: string }) => {
  return (
    <CustomTemplateError
      errorMsg={error}
      extendCss="apply_height _apply_container_width"
      pageErrorType="not-found-page"
    />
  );
};
