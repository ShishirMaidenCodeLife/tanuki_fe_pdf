"use client";

import clsx from "clsx";

import {
  BodyImage,
  FooterWave,
  HappyPineappleSpinner,
  Header,
} from "@/components";
import { useAmplify } from "@/contexts/amplify";
import * as H from "@/hooks";
import { ChildrenType } from "@/types";

export const OtpGuardLayout = ({ children }: ChildrenType) => {
  const {
    state: {
      isOtpSent,
      loading: { isOtpLoading },
    },
  } = useAmplify(); // Check if OTP is sent and loading
  const isMounted = H.useCheckMountedHook(); // Check if component is mounted

  // Clear the global loading states on mount
  H.useResetGlobalLoadingHook();
  H.useResetMdLoading();
  H.useRedirectOtpHook();

  // Block rendering completely until OTP check is done
  const showSpinnerPage = !isMounted || isOtpLoading || !isOtpSent; // Show spinner page if not mounted, OTP is loading, or OTP is not sent

  if (showSpinnerPage) return <HappyPineappleSpinner />; // Prevents rendering until OTP check passes

  return (
    <>
      <Header />

      <>
        <BodyImage />
        <main
          className={clsx(
            "otp-guard-layout-main",
            "main overflow-auto relative w-full flex flex-col",
          )}
        >
          {children}
          <FooterWave />
        </main>
      </>
    </>
  );
};
