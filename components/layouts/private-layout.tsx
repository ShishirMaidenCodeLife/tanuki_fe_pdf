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

export const PrivateLayout = ({ children }: ChildrenType) => {
  // Clear the global loading states on mount
  H.useResetGlobalLoadingHook();
  H.useResetMdLoading();

  // Only render if auth check allows
  const shouldRender = H.useRedirectRequireAuthHook();

  // Block rendering completely until auth check is done
  if (!shouldRender) return <HappyPineappleSpinner />;

  return (
    <>
      <Header />

      <BodyImage />

      <main
        className={clsx([
          "private-layout-main",
          "overflow-auto relative w-full flex flex-col",
        ])}
      >
        {children}
        <FooterWave />
      </main>
    </>
  );
};
