"use client";

import { Skeleton } from "@heroui/skeleton";
import clsx from "clsx";
import { CiImageOn } from "react-icons/ci";
import { GiDonut } from "react-icons/gi";
import { TbRouteSquare } from "react-icons/tb";
import { MdOutlineEditRoad } from "react-icons/md";

import { CommonSkeletonType } from "@/types";

export const CommonSkeleton: React.FC<CommonSkeletonType> = (props) => {
  const {
    border = "border-0",
    color = "",
    color100 = false,
    color200 = false,
    color300 = false,
    color400 = false,
    color500 = false,
    colorTransparent = false,
    extendCss = "",
    height = "h-full",
    heightCommon = false,
    imageDonut = false,
    imageMdEditor = false,
    imageRoute = false,
    imageSize = "",
    rounded = "rounded-lg",
    roundedFull = false,
    roundedLg = false,
    roundedMd = false,
    roundedSm = false,
    roundedXl = false,
    rounded2Xl = false,
    width = "w-full",
  } = props;

  const colorCss =
    color ||
    (color100
      ? "bg-gray-200 dark:bg-gray-700"
      : color200
        ? "bg-gray-300 dark:bg-gray-600"
        : color300
          ? "bg-gray-400 dark:bg-gray-500"
          : color400
            ? "bg-gray-500 dark:bg-gray-400"
            : color500
              ? "bg-gray-600 dark:bg-gray-300"
              : colorTransparent
                ? "!bg-transparent !dark:bg-transparent"
                : "bg-gray-300 dark:bg-gray-600");
  const newRounded = roundedFull
    ? "rounded-full"
    : roundedLg
      ? "rounded-lg"
      : roundedMd
        ? "rounded-md"
        : roundedSm
          ? "rounded-sm"
          : roundedXl
            ? "rounded-xl"
            : rounded2Xl
              ? "rounded-2xl"
              : rounded;
  const newHeight = heightCommon ? "apply_height_button" : height;
  const iconClassName = clsx([
    imageSize,
    "text-gray-600 dark:text-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  ]);

  return (
    <>
      <Skeleton
        className={clsx([
          "skeleton-class",
          border,
          colorCss,
          extendCss,
          newHeight,
          newRounded,
          width,
        ])}
      />

      {imageSize &&
        (imageDonut ? (
          <GiDonut className={iconClassName} />
        ) : imageMdEditor ? (
          <MdOutlineEditRoad className={iconClassName} />
        ) : imageRoute ? (
          <TbRouteSquare className={iconClassName} />
        ) : (
          <CiImageOn className={iconClassName} />
        ))}
    </>
  );
};

export const LogoSkeleton: React.FC<CommonSkeletonType> = (props) => (
  <CommonSkeleton
    extendCss="ml-3 mr-7"
    height="h-[2.1rem]"
    width="w-[10.6rem]"
    {...props}
  />
);

export const RoundSkeleton: React.FC<CommonSkeletonType> = ({
  rounded8,
  ...rest
}) => {
  const width = rounded8 ? "w-8" : "w-full";
  const height = rounded8 ? "h-8" : "h-full";

  const skeletonProps = {
    ...rest,
    height,
    roundedFull: true,
    width,
  };

  return <CommonSkeleton {...skeletonProps} />;
};

export const CategoryCardSkeleton = () => {
  return (
    <div
      className={clsx([
        "w-full h-[250px] overflow-hidden grid",
        "grid-cols-1 sm-custom:grid-cols-2 md-custom:grid-cols-3 lg-custom:grid-cols-3 xl-custom:grid-cols-4 2xl-custom:grid-cols-5",
        "gap-[16px] sm-custom:gap-[20px] md-custom:gap-[24px] lg-custom:gap-[28px] xl-custom:gap-[32px] 2xl-custom:gap-[36px]",
      ])}
    >
      {/* Card skeletons */}
      {Array.from({ length: 5 }).map((_, index) => {
        return (
          <div key={index} className="relative col-span-1 mb-20">
            {/* Card info skeletons */}
            <div className="z-plus_1 absolute top-4 left-4 flex flex-col gap-2.5">
              <CommonSkeleton color400 height="h-2.5" width="w-32" />
              <CommonSkeleton color400 height="h-3" width="w-44" />
            </div>

            <CommonSkeleton
              rounded2Xl
              // height="h-[calc(250*0.8)px]"
              height="max-h-[12.5rem] h-[12.5rem]"
              imageSize="w-24 h-24 mt-4"
            />
          </div>
        );
      })}

      {/* Navigation buttons skeletons */}
      <div className="absolute bottom-0 left-1/2 w-[150px] h-[24px] flex gap-5 -translate-x-[1.55rem] -translate-y-[0.5rem]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <CommonSkeleton height="h-[24px]" width="w-[50px]" />
          </div>
        ))}
      </div>
    </div>
  );
};
