"use client";

import clsx from "clsx";
import Image from "next/image";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { siteImages } from "../../data/custom/site";

import * as C from "@/components";
import { CommonImageType } from "@/types";
import { SHOW_DEFAULT_BG_ROUTES } from "@/utils/constants/site";
import { useCheckMountedHook, useInternetOnlineHook } from "@/hooks";

export const CommonImage: React.FC<CommonImageType> = ({
  alt = "Common Image",
  className = "",
  blurDataUrl = siteImages.png.pineapple.blushing,
  showBlurImage = false,
  src,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleOnLoad = () => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300); // 700 ms delay
  };

  return (
    <Image
      alt={alt}
      blurDataURL={showBlurImage ? blurDataUrl : undefined}
      className={clsx([
        className,
        "w-full h-full",
        "transition-all duration-700 ease-in-out",
        "transform",
        !isLoaded && showBlurImage
          ? "mx-auto grid place-items-center -translate-y-10 scale-[60%] !group-hover:scale-100 max-w-[200px] max-h-[200px]"
          : "scale-100",
      ])}
      height={props.height || 140}
      loading={props.priority ? "eager" : "lazy"}
      placeholder={showBlurImage ? "blur" : undefined}
      // src={src}
      // src={blurDataUrl}
      src={!isLoaded && showBlurImage ? blurDataUrl : src}
      width={props.width || 140}
      onLoad={handleOnLoad}
      {...props}
    />
  );
};

export const BodyImage = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isDefaultBg = SHOW_DEFAULT_BG_ROUTES?.includes(pathname);
  const isMounted = useCheckMountedHook();
  const isOnline = useInternetOnlineHook();

  const commonCss =
    "min-w-[360px] min-h-screen z-minus_1 container-page_body fixed inset-0 w-screen h-full";

  const DashboardBg = () => (
    <div className={clsx([commonCss, "shadow-lg"])}>
      {/* Group 2 in Figma */}
      <C.BgGradient5 />
      <C.BgGradient4 />
      <C.BgGradient3 />

      {/* Group 1 in Figma */}
      <C.BgGradient1 />
      <C.BgGradient2 />
    </div>
  );

  // console.log("isOnline", isOnline);

  const bodyClassName = clsx([
    commonCss,
    !isDefaultBg && "bg-no-repeat bg-cover animate-move-bg-linear-240s",
    !isDefaultBg &&
      // (theme === "light" ? "bg-tanuki-bg-light" : "bg-tanuki-bg-dark"),
      (isOnline
        ? theme === "light"
          ? "bg-tanuki-bg-light"
          : "bg-tanuki-bg-dark"
        : theme === "light"
          ? "bg-tanuki-bg-light-fallback"
          : "bg-tanuki-bg-dark-fallback"),
  ]);

  if (!isMounted) return null;

  if (isDefaultBg) return <DashboardBg />;

  return <div className={bodyClassName} />;
};
