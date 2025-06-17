"use client";

import { ErrorLayout, ErrorPageClient } from "@/components";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorLayout>
      <ErrorPageClient error={error} reset={reset} />
    </ErrorLayout>
  );
}
