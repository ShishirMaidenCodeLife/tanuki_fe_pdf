"use client";

import { ErrorLayout, NotFoundPageClient } from "@/components";

export default function NotFoundPage() {
  return (
    <ErrorLayout>
      <NotFoundPageClient error="The page you are looking for was not found." />
    </ErrorLayout>
  );
}
