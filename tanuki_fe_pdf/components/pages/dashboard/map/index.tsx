"use client";

import clsx from "clsx";
import { useCallback, useEffect } from "react";

import * as H from "@/hooks";
import * as _constants from "@/utils/pages/map/constants";
import * as donuts from "@/utils/pages/map/donuts";
import { handleZoom } from "@/utils/pages/map/events";
import { Controls, PageContainer, WrapperApiError } from "@/components";

export const MapPageClient = () => {
  const roadmapStore = H.useRoadmapStoreHook();
  const roadmapQueries = H.useQueryRoadmapHook();
  const isMounted = H.useCheckMountedHook();

  // Variables from the hooks
  const { selectedGroups } = roadmapStore;
  const { isSuccess, roadmapResponses } = roadmapQueries;

  const isLoading = !isMounted || !isSuccess;
  const wrapperProps = {
    errorMsg: roadmapQueries.errorMsg,
    isLoading,
    isSuccess: roadmapQueries.isSuccess,
    status: roadmapQueries.status,
  };

  // Memoize: Handle the donut rendering
  const drawDonutChart = useCallback(() => {
    if (isLoading) return;
    donuts.drawDonutChart({
      roadmapQueries,
      roadmapStore,
    });
  }, [isMounted, roadmapResponses, selectedGroups]);

  // Memoize: Handle the zoom reset
  const resetZoom = useCallback(() => {
    if (isLoading) return;
    handleZoom({
      action: "reset",
      roadmapQueries,
      roadmapStore,
    });
  }, [isSuccess, isMounted]);

  useEffect(() => {
    if (isLoading) return;

    drawDonutChart();
  }, [isSuccess, roadmapResponses, selectedGroups, isMounted]);

  useEffect(() => {
    if (isLoading) return;
    // if (typeof window === "undefined") return;
    resetZoom();
  }, [isSuccess, isMounted]);

  return (
    <PageContainer extendCss={clsx("page-map")}>
      <Controls />
      <WrapperApiError {...wrapperProps}>
        <div className="_apply_dimensions grid place-items-center">
          {/* {isLoading ? (
            <div className="relative grid place-items-center">
              <CommonSkeleton
                colorTransparent
                imageDonut
                height="h-40"
                imageSize="w-40 h-40"
                width="w-52"
              />
            </div>
          ) : ( */}
          <svg className={`${_constants.MAP_PAGE_CLASS_SVG} svg w-full h-full`}>
            {/* Main group responsible for panning/zooming */}
            <g className={_constants.MAP_PAGE_CLASS_MAIN_GROUP}>
              {/* Donut group */}
              <g className={_constants.MAP_PAGE_CLASS_DONUT_GROUP} />
            </g>
          </svg>
        </div>
      </WrapperApiError>
    </PageContainer>
  );
};
