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

export const OtpLayout = ({ children }: ChildrenType) => {
  H.useResetGlobalLoadingHook();
  H.useResetMdLoading();

  const shouldRender = H.useRedirectOtpHook(); //  Returns false if redirecting

  // Block rendering completely until OTP check is done
  if (!shouldRender) return <HappyPineappleSpinner />; // Prevents rendering until OTP check passes

  return (
    <>
      <Header />

      <BodyImage />

      <main
        className={clsx([
          "otp-layout-main",
          "main overflow-auto relative w-full flex flex-col",
        ])}
      >
        {children}
        <FooterWave />
      </main>
    </>
  );
};
