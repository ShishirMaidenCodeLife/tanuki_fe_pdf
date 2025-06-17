// Import: node_modules
import * as d3 from "d3";

// Import: utils/pages/map
import * as c from "@/utils/pages/map/constants";
import { DefaultType, RoadmapCustomNodeType, RoadmapTitleType } from "@/types";

// Define the random color function for link styling
export const getColorByIndex = (index: number) =>
  d3.schemeCategory10[index % d3.schemeCategory10.length];

// Adjust the text color
export const adjustColorClass = (d: RoadmapCustomNodeType, show?: boolean) => {
  // Destructure
  const { isFirstParent, isHighlighted, parentColor } = d;

  const defaultColor = isHighlighted
    ? parentColor
    : isFirstParent
      ? "text-background"
      : "text-foreground";

  return show ? parentColor : defaultColor;
};

// Get the font size based on the node
export const getNodeFontSize = (d: RoadmapCustomNodeType) => {
  // If data is undefined, return transparent opacity
  if (!d) return c.FONT_SIZE_DEFAULT;

  const { isFirstParent } = d ?? {};

  return isFirstParent ? c.FONT_SIZE_LARGE : c.FONT_SIZE_DEFAULT;
};

export const isSkeletonText = (zoomLevel: number): boolean => {
  // Check if the zoom level is defined and meets the condition
  if (zoomLevel != null && zoomLevel <= c.ZOOM_SCALE_SKELETON_MINIMUM) {
    return true; // Skeleton text is visible
  } else {
    // Handle the false case explicitly if needed
    // You can perform other logic here when the condition is not met
    return false; // Skeleton text is not visible
  }
};

export const getTextOrSkeletonVisibility = (
  zoomLevel: number,
  item: "text" | "skeleton",
): "visible" | "hidden" => {
  const isSkeleton = item === "skeleton";
  const isText = item === "text";

  if (isSkeleton) {
    return zoomLevel < c.ZOOM_SCALE_SKELETON_MINIMUM ? "visible" : "hidden";
  } else if (isText) {
    return zoomLevel > c.ZOOM_SCALE_SKELETON_MINIMUM ? "visible" : "hidden";
  }

  return "hidden";
};

// Adjust opacity based on data properties
export const adjustOpacity = (
  d?: RoadmapCustomNodeType | "default" | "transparent",
  showTextSkeleton?: boolean,
) => {
  // If data is undefined, return transparent opacity
  if (!d || showTextSkeleton || d === "transparent")
    return c.OPACITY_TRANSPARENT;

  // If data is the default label, return default opacity
  if (d === "default") return c.OPACITY_DEFAULT;

  // Check for isHighlighted property to adjust opacity
  return d?.isHighlighted ? c.OPACITY_DEFAULT : c.OPACITY_TRANSPARENT;
};

// Adjust opacity based on the node
export const adjustOpacityHover = (
  show: boolean,
  d: RoadmapCustomNodeType,
  showTextSkeleton?: boolean,
) => {
  const isHighlighted = d?.isHighlighted;

  return adjustOpacity(
    show ? "default" : isHighlighted ? "default" : "transparent",
    showTextSkeleton,
  );
};

// Adjust visibility based on data properties and transform
export const adjustVisibility = (isHighlighted?: boolean) => {
  // If the data is highlighted, show the node
  if (isHighlighted) return c.VISIBILITY_VISIBLE;
  else return c.VISIBILITY_HIDDEN;
};

export const adjustNodeCircle = (d: RoadmapCustomNodeType) => {
  return (
    (d?.isLastDepth ? c.CIRCLE_MULTIPLIER : 1) * c.NODE_RADIUS_SMALL_CIRCLE
  );
};

export const adjustNodeCircleHover = (
  show: boolean,
  d: RoadmapCustomNodeType,
) => {
  return adjustNodeCircle(d) * (show ? (d?.isLastDepth ? 1.1 : 1.5) : 1);
};

// Segment coordinates for the donut chart
export const getSegmentCoordinates = (params: {
  arc: DefaultType;
  d: d3.PieArcDatum<RoadmapTitleType>;
}) => {
  // Variable: Destructure the parameters
  const { arc, d } = params;

  // Variable: Centroid (x, y) position of each donut segment
  const [xPos, yPos] = arc.centroid(d);

  // Variable: Calculate the angle from the centroid (assuming polar coordinates)
  const angle = Math.atan2(yPos, xPos); // This gives the angle in radians

  // Variable: Adjust the distance to push icons further outwards from the donut
  const x = xPos + c.SVG_DISTANCE_X_OUTWARDS * Math.cos(angle);
  const y = yPos + c.SVG_DISTANCE_Y_OUTWARDS * Math.sin(angle);
  const transform = `translate(${xPos}, ${yPos})`;

  return { angle, transform, x, y };
};

// Adjust the font weight based on the depth
export const adjustDepthFontWeight = (depth: number = 2) => {
  return Math.max(
    c.FONT_WEIGHT_BASE_GROUP - depth * c.FONT_WEIGHT_REDUCTION_DEPTH_GROUP,
    500,
  );
};

export const isTextSkeleton = (zoomLevel: number) =>
  zoomLevel <= c.ZOOM_SCALE_SKELETON_MINIMUM;
