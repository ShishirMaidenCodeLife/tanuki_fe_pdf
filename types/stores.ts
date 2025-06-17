import { DefaultType, RouteTemplateApiType } from "@/types";

// Used for the map and route pages; roadmap as a whole
export type RoadmapStoreType = {
  // #region Home/Dashboard Page

  // Dashboard parameters
  dashboardParams: {
    selectedCategories: string[];
  };
  setSelectedCategories: (selectedCategories: string[]) => void;
  setDashboardParams: (
    dashboardParams: RoadmapStoreType["dashboardParams"],
  ) => void;

  // #endregion Home/Dashboard Page

  // #region Global page

  // Mounted states
  isMounted: boolean;
  setIsMounted: (isMounted: boolean) => void;

  // Navigation states
  isGlobalLoading: boolean;
  setIsGlobalLoading: (isNavigating: boolean) => void;
  // #endregion Global page

  // #region Map Page

  // Markdown states for the route page
  checkedNodes: DefaultType;
  setCheckedNodes: (checkedNodes: DefaultType) => void;
  toggleCheckedNodes: (checkedNode: DefaultType) => void;

  // Selected groups for the tidy tree
  selectedGroups: string[];
  setSelectedGroups: (selectedGroups: string[]) => void;
  toggleSelectedGroups: (selectedGroup: string) => void;

  // Tidy page svg transform
  tidyPageSvgTransform: { x: number; y: number; k: number; action: string };
  setTidyPageSvgTransform: (
    svgTransform: RoadmapStoreType["tidyPageSvgTransform"],
  ) => void;

  // #endregion Map Page

  // #region Route Page
  selectedRoute: RouteTemplateApiType;
  setSelectedRoute: (selectedRoute: RouteTemplateApiType) => void;

  // Markdown states for the route page
  md: string;
  setMd: (md: string | undefined) => void;
  isMdLoading: boolean;
  setIsMdLoading: (isMdLoading: boolean) => void;

  // #endregion Route Page
};

// Handles the tidy page store hook
export interface RoadmapStoreHookType extends RoadmapStoreType {}
