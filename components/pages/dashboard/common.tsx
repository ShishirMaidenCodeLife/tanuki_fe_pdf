"use client";

import clsx from "clsx";
import { useTheme } from "next-themes";
import { IoIosArrowRoundForward } from "react-icons/io";

import * as C from "@/components";
import { siteData } from "@/data/custom/site";
import * as H from "@/hooks";
import { getRouteName } from "@/utils/methods/app";
import { RouteTemplatesApiType } from "@/types";

export const BannerSection = () => {
  const { theme } = useTheme();
  const isOnline = H.useInternetOnlineHook();
  const { isNavigating, navigateWithLoader } = H.useNavigationLoaderHook();
  const mounted = H.useCheckMountedHook();

  const bannerimageSize = clsx(
    "banner-image-container",
    "relative group w-full lg:w-3/5 min-h-[250px] rounded-xl overflow-hidden apply_hover_border",
    mounted && "apply_hover_border_mounted",
  );
  const bannerSpecialCss = clsx([
    "banner-special",
    "relative w-full h-[250px] lg:flex-1 grid place-items-center text-3xl rounded-2xl group",
    mounted && "bg-highlight/30 apply_hover_border",
    mounted && "apply_hover_border_mounted",

    // !mounted && "bg-highlight/30",
  ]);
  const imageBgCss = clsx([
    "image-background",
    "w-full h-[250px] min-h-[250px] bg-no-repeat flex flex-col justify-end cursor-pointer bg-center",
    mounted &&
      "absolute inset-0 bg-cover apply_common_transition scale-100 group-hover:scale-125",
    mounted &&
      isOnline &&
      (theme === "light" ? "bg-tanuki-banner-light" : "bg-tanuki-banner-dark"),
    mounted &&
      !isOnline &&
      (theme === "light"
        ? "bg-tanuki-banner-light-fallback"
        : "bg-tanuki-banner-dark-fallback"),
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!mounted) return;

    if (e.key === "Enter" || e.key === " ") {
      navigateWithLoader("map");
    }
  };

  return (
    <div
      className={clsx(
        "banner-section",
        "relative w-full lg:h-[250px] _apply_common_padding flex flex-col lg:flex-row gap-6",
      )}
    >
      <>
        <div
          className={bannerimageSize}
          role="button"
          tabIndex={0}
          onClick={() => navigateWithLoader("map")}
          onKeyDown={handleKeyDown}
        >
          <div className={imageBgCss}>
            {!mounted && <C.CommonSkeleton rounded2Xl imageSize="w-28 h-28" />}

            {isNavigating && (
              <C.HappyPineapple
                isCenterAbsolute
                extendCss="translate-y-5"
                zIndex="z-plus_100"
              />
            )}
          </div>

          <div
            className={clsx(
              "banner-description",
              "z-plus_10 cursor-pointer absolute bottom-0 left-0 text-section px-4 py-2",
            )}
          >
            {mounted ? (
              <>
                <div className="font-bold text-lg">
                  {siteData.pages.dashboard.banner.title}
                </div>
                <div className="font-medium">
                  {siteData.pages.dashboard.banner.description}
                </div>
              </>
            ) : (
              <>
                <C.CommonSkeleton
                  color400
                  extendCss="mb-2.5"
                  height="h-4"
                  rounded="rounded-lg"
                  width="w-36"
                />
                <C.CommonSkeleton
                  color400
                  extendCss="mb-1"
                  height="h-4"
                  rounded="rounded-lg"
                  width="w-96"
                />
              </>
            )}
          </div>

          {mounted && (
            <div className="relative banner-footer z-plus_1 h-[250px]">
              <C.FooterWave extendCss="absolute bottom-0" />
            </div>
          )}
        </div>

        <div className={bannerSpecialCss}>
          {mounted ? (
            <div className="apply_common_transition scale-100 group-hover:scale-125 cursor-pointer">
              Special (特別)
            </div>
          ) : (
            <>
              <C.CommonSkeleton rounded2Xl imageSize="w-28 h-28" />
              {/* <C.CommonSkeleton
                color400
                extendCss="absolute"
                height="h-12"
                width="w-52"
              /> */}
            </>
          )}
        </div>

        {/* <div className={bannerSpecialCss}>
          {!mounted ? (
            <>Special (特別)</>
          ) : (
            <CommonSkeleton
              color400
              extendCss="mb-1"
              height="h-12"
              rounded="rounded-lg"
              width="w-56"
            />
          )}
        </div> */}
      </>
    </div>
  );
};

export const MoreTemplatesSection = () => {
  const { isUserAuthenticated } = H.useCombinedAuthNavHook();
  const isMounted = H.useCheckMountedHook();

  return (
    <section
      className={clsx("more-templates-section", "grid place-items-center py-8")}
    >
      <C.LinkButton
        isOpposite
        endContent={
          <IoIosArrowRoundForward className="bg-overlay80 text-xl text-highlight font-extrabold rounded-full stroke-highlight stroke-[20]" />
        }
        extendCss="!capitalize !shadow-more-templates"
        href={getRouteName("route-templates", isUserAuthenticated)}
        skeletonProps={{
          heightCommon: true,
          roundedXl: true,
          width: "w-[190.15px]",
          isSkeletonLoading: !isMounted,
        }}
      >
        {siteData.buttons.moreTemplates}
      </C.LinkButton>
    </section>
  );
};

export const CategoriesSection = (props: RouteTemplatesApiType) => {
  return (
    <section
      className={clsx(
        "route-categories-section",
        "relative flex flex-col gap-4 mt-6",
      )}
    >
      <C.CategoryCard {...props} />
    </section>
  );
};

export const YourRoutesSection = () => {
  // const data = H.useRouteTemplateApiService(["useGetByCategory"]);
  const { isDashboard } = H.useCombinedAuthNavHook();

  if (!isDashboard) return null;

  return (
    <section className={clsx("your-routes-section", "mb-14")}>
      {/* {data?.yourRoutes?.map((item: DashboardCardType, index: number) => (
        <C.CategoryCard
          key={generateUniqueId(index, item.title)}
          {...item}
        />
      ))} */}
    </section>
  );
};
