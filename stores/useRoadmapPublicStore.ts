"use client";

import { create } from "zustand";

import { RoadmapStoreType } from "@/types/stores";
import { safeParseStorage } from "@/utils/methods/object";
import { DefaultType } from "@/types";
import { INITIAL_SELECTED_ROUTE } from "@/utils/pages/route-templates/view/constants";

// Custom hook to store the state of the tidy tree
export const useRoadmapPublicStore = create<RoadmapStoreType>((set) => ({
  // #region Home/Dashboard Page

  // Dashboard parameters
  dashboardParams: {
    selectedCategories: ["Cybersecurity", "Design"],
  },
  setSelectedCategories: (selectedCategories: string[]) =>
    set((state) => ({
      ...state,
      dashboardParams: {
        ...state.dashboardParams,
        selectedCategories,
      },
    })),
  setDashboardParams: (dashboardParams: RoadmapStoreType["dashboardParams"]) =>
    set((state) => ({
      ...state,
      dashboardParams: {
        ...state.dashboardParams,
        ...dashboardParams,
      },
    })),

  // #endregion Home/Dashboard Page

  // #region Global Page

  // Mounted states
  isMounted: false,
  setIsMounted: (isMounted) => set({ isMounted }),

  // Navigation states
  isGlobalLoading: false,
  setIsGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
  // #region Global Page

  // Checked nodes in checkboxes
  checkedNodes: safeParseStorage("checkedNodes", []),
  setCheckedNodes: (checkedNodes) => {
    // Set the checked nodes in the local storage
    localStorage.setItem("checkedNodes", JSON.stringify(checkedNodes));

    // Set the checked nodes in the Zustand store
    set({ checkedNodes });
  },
  toggleCheckedNodes: (checkedNode) => {
    set((state) => {
      const prevCheckedNodes = state.checkedNodes;
      const checkedNodes = prevCheckedNodes?.some(
        (item: DefaultType) => item?.data?.uuid === checkedNode?.data?.uuid,
      )
        ? prevCheckedNodes?.filter(
            (item: DefaultType) => item?.data?.uuid !== checkedNode?.data?.uuid,
          )
        : [
            ...prevCheckedNodes,
            {
              data: {
                uuid: checkedNode?.data?.uuid,
                name: checkedNode?.data?.name,
              },
            },
          ];

      // Set the checked nodes in the local storage
      localStorage.setItem("checkedNodes", JSON.stringify(checkedNodes));

      // Set the checked nodes in the Zustand store
      return { ...state, checkedNodes };
    });
  },

  // Route states
  selectedRoute: INITIAL_SELECTED_ROUTE,
  setSelectedRoute: (selectedRoute) => set({ selectedRoute }),

  // Markdown states
  md: "",
  setMd: (md) => set({ md }),
  isMdLoading: false,
  setIsMdLoading: (isMdLoading: boolean) => set({ isMdLoading }),

  // Selected groups for the tidy tree
  selectedGroups: [],
  setSelectedGroups: (selectedGroups: string[]) => set({ selectedGroups }),
  toggleSelectedGroups: (selectedGroup: string) =>
    set((state) => {
      const prevSelectedGroups = state.selectedGroups;
      const selectedGroups = prevSelectedGroups?.includes(selectedGroup)
        ? prevSelectedGroups?.filter((item: string) => item !== selectedGroup)
        : [...prevSelectedGroups, selectedGroup];

      return { ...state, selectedGroups };
    }),

  tidyPageSvgTransform: safeParseStorage("tidyPageSvgTransform", ""),
  setTidyPageSvgTransform: (tidyPageSvgTransform) => {
    localStorage.setItem(
      "tidyPageSvgTransform",
      JSON.stringify(tidyPageSvgTransform),
    );
    set({ tidyPageSvgTransform });
  },
}));

// Listen to storage changes and sync Zustand state
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (!event.key) return;
    if (
      ["checkedNodes", "isMounted", "tidyPageSvgTransform"]?.includes(event.key)
    ) {
      const newValue = safeParseStorage(
        event.key,
        useRoadmapPublicStore.getState()[event.key as keyof RoadmapStoreType],
      );

      useRoadmapPublicStore.setState({ [event.key]: newValue });
    }
  });
}
