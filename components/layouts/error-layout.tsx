"use client";

import clsx from "clsx";

import {
  BodyImage,
  FooterWave,
  HappyPineappleSpinner,
  Header,
} from "@/components";
import * as H from "@/hooks";
import { ChildrenType } from "@/types";

export const ErrorLayout = ({ children }: ChildrenType) => {
  // Clear the global loading states on mount
  H.useResetGlobalLoadingHook();
  H.useResetMdLoading();

  const { isRootPath } = H.useCombinedAuthNavHook(); // Check if root path
  const isMounted = H.useCheckMountedHook(); // Check if component is mounted
  const showSpinnerPage = !isMounted && !isRootPath; // Show spinner page if not mounted and not root path

  return (
    <>
      <Header pageLayout="error" />

      {showSpinnerPage ? (
        <HappyPineappleSpinner />
      ) : (
        <>
          <BodyImage />
          <main
            className={clsx([
              "error-layout-main",
              "overflow-auto relative w-full flex flex-col",
            ])}
          >
            {children}
            <FooterWave />
          </main>
        </>
      )}
    </>
  );
};
