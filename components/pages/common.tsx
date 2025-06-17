"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";

import { siteImages } from "../../data/custom/site";

import * as C from "@/components";
import { DASHBOARD_SWIPER } from "@/config/swiper";
import * as H from "@/hooks";
import { RouteTemplatesApiType, RouteTemplateApiType } from "@/types";
// import { prependMdHeaderIfAbsent } from "@/utils/pages/route-templates/data";
import { formatRelativeTime } from "@/utils/methods/date";

export const CategoryCard: React.FC<RouteTemplatesApiType> = (props) => {
  const { category, routeTemplates } = props;

  // Custom hooks
  const showSwiperNav = H.useShowSwiperNavHook(
    routeTemplates?.length || 1,
    DASHBOARD_SWIPER()?.breakpoints,
  );
  const mounted = H.useCheckMountedHook();
  const {
    isMdLoading,
    setIsMdLoading,
    // setMd,
    selectedRoute,
    setSelectedRoute,
  } = H.useRoadmapStoreHook();
  const { isNavigating, navigateWithLoader } = H.useNavigationLoaderHook();
  const { setIsGlobalLoading } = H.useRoadmapStoreHook();

  const SwiperTitle = () => (
    <>
      {!mounted ? (
        <C.CommonSkeleton
          extendCss="_apply_common_margin"
          height="h-6"
          width="w-96"
        />
      ) : (
        <div className="_apply_common_padding h-6 title font-semibold text-xl">
          {category}
        </div>
      )}
    </>
  );

  return (
    <div className="relative flex flex-col gap-4">
      <SwiperTitle />

      {!mounted ? (
        <C.CategoryCardSkeleton />
      ) : (
        <Swiper
          className={clsx("route-categories-swiper", "relative h-[250px]")}
          modules={[Keyboard, Navigation, Pagination]}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
              return (
                '<span class="' + className + '">' + (index + 1) + "</span>"
              );
            },
          }}
          // slideNextClass="!bg-highlight"
          {...DASHBOARD_SWIPER(showSwiperNav)}
        >
          {routeTemplates?.map(
            (singleRoute: RouteTemplateApiType, index: number) => {
              const {
                uuid,
                thumbnailPath = siteImages.png.sss.fullLogo,
                title = "Untitled Route",
                updatedAt = "",
              } = singleRoute;

              // Store the selected route
              const isSelectedRoute =
                (isNavigating || isMdLoading) && selectedRoute?.uuid === uuid;

              // Handlers
              const handleClick = () => {
                // If already selected, return
                // if (selectedRoute) return;
                setIsMdLoading(true);
                setIsGlobalLoading(true);
                setSelectedRoute(singleRoute);
                setTimeout(() => {
                  navigateWithLoader(`route-templates/${uuid}`);
                  // setMd(prependMdHeaderIfAbsent(content, title));
                  // setIsMdLoading(false);
                }, 300);
              };

              return (
                <SwiperSlide
                  key={`${index}-${title}`}
                  className="swiper w-full h-full max-h-[250px]"
                  onClick={handleClick}
                >
                  <Card
                    className={clsx([
                      mounted && "apply_hover_border_mounted",
                      isSelectedRoute && "apply_border_mounted",
                      "w-full h-4/5 py-0 m-0 group",
                      "!shadow-none apply_hover_border",
                      "bg-white/30 hover:bg-white/70",
                      "dark:bg-gray-500/30 hover:dark:bg-blue-950",
                      isSelectedRoute && "bg-white/70 dark:bg-blue-950",
                      "cursor-pointer ease-soft-spring apply_common_transition",
                    ])}
                  >
                    {/* "group relative w-full h-4/5 flex items-center justify-center",
                      "bg-white/30 dark:bg-gray-500/30 border-4 border-transparent rounded-lg shadow-lg transition-all duration-300",
                      "hover:shadow-[8px_8px_0px_#0AB69B] dark:hover:shadow-[8px_8px_0px_#D27A14]  hover:translate-x-[-8px] hover:translate-y-[-8px]",
                      "hover:border-highlight ", */}

                    <CardHeader className="relative px-4 pb-2 flex-col items-start text-sm">
                      <small className="text-default-500 text-[10px] capitalize">
                        Last Updated: {formatRelativeTime(updatedAt) || "N/A"}
                      </small>
                      <C.CommonTooltip
                        className={clsx(
                          title?.length < 22 && "hidden",
                          "text-xs bg-overlay20 backdrop-blur-[2px] apply_common_transition",
                        )}
                        content={title}
                      >
                        <div className="line-clamp-1 group-hover:cursor-pointer font-semibold">
                          {title}
                        </div>
                      </C.CommonTooltip>

                      {isSelectedRoute && (
                        <>
                          <C.RouteCardSpinner />
                          <C.CardHappyPineapple />
                        </>
                      )}
                    </CardHeader>

                    {/* Image Container */}
                    <CardBody
                      className={clsx(
                        "relative grid w-[calc(100%-2rem)] max-h-[128px]  overflow-hidden mx-auto p-0 rounded-xl  apply_common_transition",
                        "group-hover:w-full group-hover:max-h-[200px] group-hover:rounded-t-none",
                        isSelectedRoute &&
                          "w-full max-h-[200px] rounded-t-none scale-100",
                      )}
                    >
                      <C.CommonImage
                        showBlurImage
                        alt="Card background"
                        className={clsx([
                          // "w-full h-full object-cover rounded-xl",
                          "w-full h-full object-cover",
                          mounted &&
                            "apply_common_transition origin-center group-hover:scale-125",
                          isSelectedRoute && "scale-125",
                        ])}
                        src={thumbnailPath}
                      />
                    </CardBody>
                  </Card>
                </SwiperSlide>
              );
            },
          )}
        </Swiper>
      )}
    </div>
  );
};
