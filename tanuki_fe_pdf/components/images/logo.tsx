"use client";

import { siteImages } from "../../data/custom/site";

import { CommonImage, LogoSkeleton } from "@/components";
import { useCheckMountedHook } from "@/hooks";

// Logo of tanuki project temporarily
export const TanukiLogo = () => {
  const isMounted = useCheckMountedHook();

  return (
    <>
      {!isMounted ? (
        <div className="-translate-x-3">
          <LogoSkeleton />
        </div>
      ) : (
        <div className="apply_tanuki_logo_div">
          <CommonImage
            alt="Tanuki Logo"
            className="_apply_global_image -translate-x-3"
            src={siteImages.svg.tanuki.logo}
          />
        </div>
      )}
    </>
  );
};
