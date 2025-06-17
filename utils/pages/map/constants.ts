import * as d3 from "d3";

// CSS: Border radius
export const BORDER_RADIUS_SMALL = "7px",
  // CSS: Donut properties
  DONUT_INNER_RADIUS = 80,
  DONUT_OUTER_RADIUS = 96,
  DONUT_CENTRAL_RADIUS = 280, // 250 before
  // CSS: Common Node properties
  CIRCLE_MULTIPLIER = 5,
  NODE_RADIUS_SMALL_CIRCLE = 3.5,
  NODE_RADIUS_BIG_CIRCLE = 16.5,
  // CSS: First Node properties
  FIRST_NODE_TEXT_MAX_WIDTH = 350,
  FIRST_NODE_TEXT_MAX_LINES = 2,
  FIRST_NODE_WIDTH = 200,
  FIRST_NODE_HEIGHT = 120,
  FIRST_NODE_DESCRIPTION_MAX_HEIGHT = 72,
  // CSS: Font weight
  FONT_WEIGHT_BASE_GROUP = 750, // Regular weight
  FONT_WEIGHT_REDUCTION_DEPTH_GROUP = 50, // Adjust as needed
  // CSS: Opacity
  OPACITY_DEFAULT = 1.0,
  OPACITY_TRANSPARENT = 0.4,
  VISIBILITY_HIDDEN = "hidden",
  VISIBILITY_VISIBLE = "visible",
  // CSS: Font sizes
  // FONT_SIZE_TITLE = "1.20rem",
  // FONT_SIZE_LARGE = "0.69rem",
  // FONT_SIZE_DEFAULT = "0.60rem",
  // FONT_SIZE_SMALL = "0.50rem",
  FONT_SIZE_TITLE = "16px",
  FONT_SIZE_LARGE = "12px",
  FONT_SIZE_DEFAULT = "10px",
  FONT_SIZE_SMALL = "8px",
  // CSS: Strokes
  STROKE_WIDTH_DEFAULT = 1.1,
  STROKE_WIDTH_HOVERED = 2.2,
  // CSS: Text properties
  // CSS:
  TEXT_DONUT_LABEL_DEFAULT = "Default Label",
  TEXT_MAX_LINES_GROUP_LABEL = 5,
  TEXT_MAX_WIDTH_GROUP_LABEL = 120,
  TEXT_LOREM_DESCRIPTION =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //
  // Variable: First node properties
  NODE_FIRST_PARENT = {
    width: 200,
    height: 120,
    borderRadiusX: 10,
    borderRadiusY: 10,
    strokeWidth: 2.5,
  },
  //
  // Variable: Zoom properties
  // 変数: ズーム プロパティ
  //

  // Variable: Skeleton text properties
  // 変数: スケルトンテキストプロパティ
  SKELETON_TEXT_OPACITY = 0.18,
  SKELETON_TEXT_WIDTH = 80,
  SKELETON_TEXT_HEIGHT = 16,
  // SKELETON_TEXT_OFFSET_X = -6,
  // SKELETON_TEXT_OFFSET_Y = 6,
  SKELETON_TEXT_BORDER_RADIUS_X = 4,
  SKELETON_TEXT_BORDER_RADIUS_Y = 4,
  // Variable: Checkbox properties
  // 変数: チェックボックスのプロパティ
  CHECKBOX_SIZE = 36,
  // Variable: SVG properties
  // 変数: SVG プロパティ
  SVG_TRANSFORM_DEFAULT = { x: 0, y: 0, k: 1 },
  SVG_WIDTH_DEFAULT = 800,
  SVG_HEIGHT_DEFAULT = 800,
  SVG_DISTANCE_X_OUTWARDS = 150, // 150 before
  SVG_DISTANCE_Y_OUTWARDS = 150, // 150 before
  //

  ////////////////////////////////////////
  // #region Zoom (ズーム)
  // Zoom scales
  // ズームスケール
  ZOOM_SCALE_SKELETON_MINIMUM = 0.5,
  ZOOM_SCALE_SVG_MINIMUM = 0.25, // 25%
  ZOOM_SCALE_SVG_MAXIMUM = 1.25, // 125%
  ZOOM_SCALE_SVG_DEFAULT = 1.0, // 100%
  ZOOM_SCALE_SHOW_MINIMUM = ZOOM_SCALE_SKELETON_MINIMUM, // 60%
  ZOOM_SCALE_SHOW_MAXIMUM = 0.9, // 90%
  // Zoom animations
  // ズームアニメーション
  ZOOM_TRANSITION_DURATION = 1000,
  ZOOM_EASING = d3.easeCubicInOut,
  // #endregion Zoom (ズーム)
  ////////////////////////////////////////

  ////////////////////////////////////////
  // #region Offset (オフセット)
  // Offset values for the text
  // テキストのオフセット値
  OFFSET_TEXT_DEFAULT = 60,
  // Offset values for the tree as a whole
  // ツリー全体のオフセット値
  OFFSET_TREE_Y = 160,
  OFFSET_TREE_X = 72,
  // #endregion Offset (オフセット)
  ////////////////////////////////////////

  ////////////////////////////////////////
  // #region Rotation (回転)
  // Default rotations for the map page
  // マップページのデフォルトの回転
  ROTATION_DEFAULT = 45, // 90 // 45
  ROTATION_TEXT_DEFAULT = 90, // 180 // 180 - 45 // 90,
  // Rotations for different positions using the default rotations
  // デフォルトの回転を使用したさまざまな位置の回転
  ROTATION_TOP_LEFT = 180 + ROTATION_DEFAULT,
  ROTATION_TOP_RIGHT = -ROTATION_DEFAULT,
  ROTATION_MIDDLE_LEFT = 180,
  ROTATION_MIDDLE_RIGHT = 0,
  ROTATION_BOTTOM_LEFT = 180 - ROTATION_DEFAULT,
  ROTATION_BOTTOM_RIGHT = ROTATION_DEFAULT,
  // #endregion Rotation (回転)
  ////////////////////////////////////////

  ////////////////////////////////////////
  // #region Debounce (デバウンス)
  // Default time set for the debounce
  // デバウンスに設定されたデフォルト時間
  DEBOUNCE_TIME_DEFAULT = 50,
  MAP_PAGE_CLASS_SVG = "map-page_svg",
  MAP_PAGE_CLASS_MAIN_GROUP = "map-page_main-group",
  MAP_PAGE_CLASS_DONUT_GROUP = "map-page_donut-group";

// #endregion Debounce (デバウンス)
////////////////////////////////////////

export const INITIAL_QUADRANT_FLAGS = {
  isTopLeft: false,
  isTopRight: false,
  isBottomLeft: false,
  isBottomRight: false,
  isMidLeft: false,
  isMidRight: false,
  isTop: false,
  isBottom: false,
  isVertical: false,
  isHorizontal: false,
};
