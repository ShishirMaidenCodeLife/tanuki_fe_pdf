"use client";

import { useMemo } from "react";

import { useAmplify } from "@/contexts/amplify";
import { useRoadmapPrivateStore } from "@/stores/useRoadmapPrivateStore";
import { useRoadmapPublicStore } from "@/stores/useRoadmapPublicStore";
import { DefaultType, RoadmapStoreType } from "@/types";
import { INITIAL_SELECTED_ROUTE } from "@/utils/pages/route-templates/view/constants";

// All the states within the store
const selectors: (keyof RoadmapStoreType)[] = [
  "dashboardParams",
  "setSelectedCategories",
  "setDashboardParams",
  "isMounted",
  "setIsMounted",
  "isGlobalLoading",
  "setIsGlobalLoading",
  "checkedNodes",
  "setCheckedNodes",
  "toggleCheckedNodes",
  "selectedRoute",
  "setSelectedRoute",
  "md",
  "setMd",
  "isMdLoading",
  "setIsMdLoading",
  "selectedGroups",
  "setSelectedGroups",
  "toggleSelectedGroups",
  "tidyPageSvgTransform",
  "setTidyPageSvgTransform",
];

// Custom hook for the map store
export const useRoadmapStoreHook = () => {
  const {
    state: { isUserAuthenticated },
  } = useAmplify();

  // Helper function to extract states from the store
  const getStoreState = <T extends RoadmapStoreType>(
    storeHook: (selector: (state: T) => DefaultType) => DefaultType[],
  ) => {
    return selectors.map((selector) =>
      storeHook((state: T) => state[selector]),
    ) as [
      T["dashboardParams"],
      T["setSelectedCategories"],
      T["setDashboardParams"],
      T["isMounted"],
      T["setIsMounted"],
      T["isGlobalLoading"],
      T["setIsGlobalLoading"],
      T["checkedNodes"],
      T["setCheckedNodes"],
      T["toggleCheckedNodes"],
      T["selectedRoute"],
      T["setSelectedRoute"],
      T["md"],
      T["setMd"],
      T["isMdLoading"],
      T["setIsMdLoading"],
      T["selectedGroups"],
      T["setSelectedGroups"],
      T["toggleSelectedGroups"],
      T["tidyPageSvgTransform"],
      T["setTidyPageSvgTransform"],
    ];
  };

  // Get the states from the private store
  const [
    dashboardParams1,
    setSelectedCategories1,
    setDashboardParams1,
    isMounted1,
    setIsMounted1,
    isNavigating1,
    setIsGlobalLoading1,
    checkedNodes1,
    setCheckedNodes1,
    toggleCheckedNodes1,
    selectedRoute1,
    setSelectedRoute1,
    md1,
    setMd1,
    isMdLoading1,
    setIsMdLoading1,
    selectedGroups1,
    setSelectedGroups1,
    toggleSelectedGroups1,
    tidyPageSvgTransform1,
    setTidyPageSvgTransform1,
  ] = getStoreState(useRoadmapPrivateStore);

  // Get the states from the public store
  const [
    dashboardParams2,
    setSelectedCategories2,
    setDashboardParams2,
    isMounted2,
    setIsMounted2,
    isNavigating2,
    setIsGlobalLoading2,
    checkedNodes2,
    setCheckedNodes2,
    toggleCheckedNodes2,
    selectedRoute2,
    setSelectedRoute2,
    md2,
    setMd2,
    isMdLoading2,
    setIsMdLoading2,
    selectedGroups2,
    setSelectedGroups2,
    toggleSelectedGroups2,
    tidyPageSvgTransform2,
    setTidyPageSvgTransform2,
  ] = getStoreState(useRoadmapPublicStore);

  // Memoize the derived state based on the 'isUserAuthenticated' value
  const [
    dashboardParams,
    setSelectedCategories,
    setDashboardParams,
    isMounted,
    setIsMounted,
    isGlobalLoading,
    setIsGlobalLoading,
    checkedNodes,
    setCheckedNodes,
    toggleCheckedNodes,
    selectedRoute,
    setSelectedRoute,
    md,
    setMd,
    isMdLoading,
    setIsMdLoading,
    selectedGroups,
    setSelectedGroups,
    toggleSelectedGroups,
    tidyPageSvgTransform,
    setTidyPageSvgTransform,
  ] = useMemo(() => {
    return isUserAuthenticated
      ? [
          dashboardParams1,
          setSelectedCategories1,
          setDashboardParams1,
          isMounted1,
          setIsMounted1,
          isNavigating1,
          setIsGlobalLoading1,
          checkedNodes1,
          setCheckedNodes1,
          toggleCheckedNodes1,
          selectedRoute1,
          setSelectedRoute1,
          md1,
          setMd1,
          isMdLoading1,
          setIsMdLoading1,
          selectedGroups1,
          setSelectedGroups1,
          toggleSelectedGroups1,
          tidyPageSvgTransform1,
          setTidyPageSvgTransform1,
        ]
      : [
          dashboardParams2,
          setSelectedCategories2,
          setDashboardParams2,
          isMounted2,
          setIsMounted2,
          isNavigating2,
          setIsGlobalLoading2,
          checkedNodes2,
          setCheckedNodes2,
          toggleCheckedNodes2,
          selectedRoute2,
          setSelectedRoute2,
          md2,
          setMd2,
          isMdLoading2,
          setIsMdLoading2,
          selectedGroups2,
          setSelectedGroups2,
          toggleSelectedGroups2,
          tidyPageSvgTransform2,
          setTidyPageSvgTransform2,
        ];
  }, [
    isUserAuthenticated,
    dashboardParams1,
    setSelectedCategories1,
    setDashboardParams1,
    dashboardParams2,
    setDashboardParams2,
    isMounted1,
    setIsMounted1,
    isMounted2,
    setIsMounted2,
    isNavigating1,
    setIsGlobalLoading1,
    isNavigating2,
    setIsGlobalLoading2,
    checkedNodes1,
    checkedNodes2,
    setCheckedNodes1,
    setCheckedNodes2,
    toggleCheckedNodes1,
    toggleCheckedNodes2,
    selectedRoute1,
    selectedRoute2,
    setSelectedRoute1,
    setSelectedRoute2,
    md1,
    setMd1,
    isMdLoading1,
    setIsMdLoading1,
    md2,
    setMd2,
    isMdLoading2,
    setIsMdLoading2,
    selectedGroups1,
    selectedGroups2,
    setSelectedGroups1,
    setSelectedGroups2,
    toggleSelectedGroups1,
    toggleSelectedGroups2,
    tidyPageSvgTransform1,
    tidyPageSvgTransform2,
    setTidyPageSvgTransform1,
    setTidyPageSvgTransform2,
  ]);

  // Clear the checked nodes
  const clearCheckedNodes = () => setCheckedNodes([]);

  // Clear the selected groups
  const clearSelectedGroups = () => setSelectedGroups([]);

  // Clear the related methods
  const clearTidyPageMethods = () => {
    setIsGlobalLoading(false);
    clearCheckedNodes();
    clearSelectedGroups();
    setSelectedRoute(INITIAL_SELECTED_ROUTE);
    setMd("");
  };

  // Derived states
  const derivedStates = { clearCheckedNodes, clearTidyPageMethods };

  return {
    dashboardParams,
    setSelectedCategories,
    setDashboardParams,
    isMounted,
    setIsMounted,
    isGlobalLoading,
    setIsGlobalLoading,
    checkedNodes,
    setCheckedNodes,
    toggleCheckedNodes,
    selectedRoute,
    setSelectedRoute,
    md,
    setMd,
    isMdLoading,
    setIsMdLoading,
    selectedGroups,
    setSelectedGroups,
    toggleSelectedGroups,
    tidyPageSvgTransform,
    setTidyPageSvgTransform,
    ...derivedStates,
  };
};
