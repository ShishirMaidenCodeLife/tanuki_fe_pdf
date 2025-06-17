"use client";

import { useMediaQuery } from "@/hooks";
import { BreakpointsType } from "@/types";

export const useShowSwiperNavHook = (
  length: number,
  breakpoints: BreakpointsType,
) => {
  // Define breakpoints and their media queries
  const is1280 = useMediaQuery("(min-width: 1280px)");
  const is1024 = useMediaQuery("(min-width: 1024px)");
  const is768 = useMediaQuery("(min-width: 768px)");
  const is640 = useMediaQuery("(min-width: 640px)");
  const is480 = useMediaQuery("(min-width: 480px)");
  const is320 = useMediaQuery("(min-width: 320px)");

  // Determine the current slidesPerView based on the active breakpoint
  const slidesPerView =
    (is1280 && breakpoints?.[1280]?.slidesPerView) ||
    (is1024 && breakpoints?.[1024]?.slidesPerView) ||
    (is768 && breakpoints?.[768]?.slidesPerView) ||
    (is640 && breakpoints?.[640]?.slidesPerView) ||
    (is480 && breakpoints?.[480]?.slidesPerView) ||
    (is320 && breakpoints?.[320]?.slidesPerView) ||
    1; // Default fallback

  return length > slidesPerView;
};
