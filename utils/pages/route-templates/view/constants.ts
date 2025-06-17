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
export const DEFAULT_ROUTE_TEMPLATE_CATEGORIES = ["Design", "Cybersecurity"];

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

export const ROUTE_NODE_WIDTH = 224; // px, matches min-w-56 in CHNode (14*16)
export const ROUTE_NODE_PADDING = 10; // px, by default for the react-flow node this is 10px
export const ROUTE_NODE_ITEM_HEIGHT = 32; // px, matches h-8 in CHNode (2*16)
export const ROUTE_NODE_ITEM_HEADERS_HEIGHT = 56; // px, matches h-14 in CHNode (2*28)

export const PARENT_SCALE = 5; // scale for parent nodes
export const PARENT_VERTICAL_SPACING = 650; // px, increased significantly to prevent overlap with larger nodes
export const CHILD_VERTICAL_SPACING = 200; // px, increased for larger child nodes
export const PARENT_X_LEFT = 100;
export const PARENT_X_RIGHT = 500; // increased zigzag x distance for wider nodes
export const CHILD_X_OFFSET = 850; // increased child node offset from parent for wider nodes
export const NODE_HEADER_HEIGHT = 224; // updated to match ENHANCED_DIMENSIONS.HEADER_MIN_HEIGHT

// Enhanced component sizing constants
export const ENHANCED_DIMENSIONS = {
  // Node dimensions - Increased for better readability
  NODE_MIN_WIDTH: 720, // Increased from 600px to 720px
  NODE_MAX_WIDTH: 720, // Increased from 700px to 720px
  NODE_MIN_HEIGHT: 380, // Increased from 320px to 380px

  // Header dimensions - Increased for better text readability
  HEADER_MIN_HEIGHT: 224, // Increased from 180px to 224px
  HEADER_MAX_HEIGHT: 224, // Increased from 200px to 224px
  HEADER_PADDING_X: 24, // Increased from 20px to 24px
  HEADER_PADDING_Y: 24, // Increased from 20px to 24px

  // Item dimensions - Increased for better readability
  ITEM_MIN_HEIGHT: 164, // Increased from 120px to 164px
  ITEM_MAX_HEIGHT: 164, // Increased from 130px to 164px
  ITEM_PADDING_X: 24, // Increased from 20px to 24px
  ITEM_PADDING_Y: 16, // Increased from 12px to 16px

  // Text and typography - Much larger for better readability
  HEADER_ICON_SIZE: 72, // Increased from 64px to 72px (4.5rem)
  HEADER_TEXT_SIZE: "text-3xl", // Keep text-3xl for headers
  ITEM_TEXT_SIZE: "text-xl", // Keep text-xl for items

  // Icon sizes for drag, delete, and plus buttons
  DRAG_ICON_SIZE: 24, // Same as before
  DELETE_ICON_SIZE: 22, // Increased from 18px
  PLUS_ICON_SIZE: 60, // Increased from 56px to 60px

  // Reorderable list padding
  LIST_PADDING_BOTTOM: 24, // Increased from 20px to 24px
} as const;

// Step positioning for child nodes
export const STEP_OFFSET = {
  VERTICAL: 100, // Vertical distance between each step
  HORIZONTAL: 350, // Horizontal distance for each step
};

export const MAX_CHARACTERS = 80;
