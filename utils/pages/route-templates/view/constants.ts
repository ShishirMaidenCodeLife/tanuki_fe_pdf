export const DISPLAY_THRESHOLD = 40; // Distance threshold for node swapping
export const LIGHT_COLOR_OPACITY = 0.32; // Opacity level for light colors
export const ROUTE_COLORS = [
  "#54B4D8", // Light blue
  "#62C1A3", // Greenish teal
  "#EE4C7D", // Pinkish red
  "#AD3CB2", // Purple
  "#F0D02D", // Yellow
];
export const DEFAULT_ROADMAP_TITLE = "Default Roadmap Title";

// Constants for layout
export const ROUTE_SCALE_FACTOR = 2;
export const GAP_Y = 1.2 * ROUTE_SCALE_FACTOR * 88;
export const OFFSET_X = 1.0 * ROUTE_SCALE_FACTOR * 120;
export const DEFAULT_ROOUTE_TEMPLATE_CATEGORY = "React.js";

export const INITIAL_SELECTED_ROUTE = {
  content: "",
  entityType: "",
  entityId: "",
  status: "",
  localizedNames: {
    en: "",
    ja: "",
  },
  createdAt: "",
  updatedBy: "",
  createdBy: "",
  localizedDescriptions: {
    en: "",
    ja: "",
  },
  updatedAt: "",
  thumbnailPath: "",
  progress: {
    total: 0,
    completed: 0,
  },
  uuid: "",
  localizedContent: {
    en: "",
    ja: "",
  },
  description: "",
  title: "",
};

export const ROUTE_NODE_WIDTH = 224; // px, matches min-w-56 in CustomNode (14*16)
export const ROUTE_NODE_PADDING = 10; // px, by default for the react-flow node this is 10px
export const ROUTE_NODE_ITEM_HEIGHT = 32; // px, matches h-8 in CustomNode (2*16)
export const ROUTE_NODE_ITEM_HEADERS_HEIGHT = 56; // px, matches h-14 in CustomNode (2*28)

export const PARENT_SCALE = 5; // scale for parent nodes
export const PARENT_VERTICAL_SPACING = 180; // px, adjust as needed
export const CHILD_VERTICAL_SPACING = 88; // px, adjust as needed
export const PARENT_X_LEFT = 100;
export const PARENT_X_RIGHT = 400; // reduced zigzag x distance
export const CHILD_X_OFFSET = 720; // child node offset from parent
export const NODE_HEADER_HEIGHT = 112;

// Step positioning for child nodes
export const STEP_OFFSET = {
  VERTICAL: 100, // Vertical distance between each step
  HORIZONTAL: 350, // Horizontal distance for each step
};
