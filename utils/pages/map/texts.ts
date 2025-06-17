import * as d3 from "d3";

import * as _constants from "@/utils/pages/map/constants";
import * as _donuts from "@/utils/pages/map/donuts";
import * as _events from "@/utils/pages/map/events";
import * as _ids from "@/utils/pages/map/ids";
import * as _styles from "@/utils/pages/map/styles";
import * as _utils from "@/utils/pages/map/utils";
import { wrapText } from "@/utils/methods/text";
import {
  D3SelectionAllType,
  DefaultType,
  RoadmapCustomNodeType,
  RoadmapTitleType,
  TextOffsetType,
  RoadmapStoreType,
} from "@/types";

// Append: Text to the donut segment
export const appendSegmentText = (params: {
  arc: DefaultType;
  d: d3.PieArcDatum<RoadmapTitleType>;
  donutGroup: D3SelectionAllType;
  selectedGroups: RoadmapStoreType["selectedGroups"];
}) => {
  // Destructure parameters
  const { arc, d, donutGroup, selectedGroups } = params;
  const { param } = d?.data ?? {};

  // Calculate centroid and angle for positioning and rotation
  const centroid = arc.centroid(d);
  const angle = (d.startAngle + d.endAngle) / 2;
  const rotation = (angle * 180) / Math.PI;
  const adjustedRotation =
    rotation > 90 && rotation < 270 ? rotation + 180 : rotation; // Ensure the text is readable
  const transform = `translate(${centroid}) rotate(${adjustedRotation})`;

  // Check if the text element already exists, otherwise create it
  let text: D3SelectionAllType = donutGroup.select(
    `#${_ids.getSegmentTextId(d)}`,
  );

  if (text.empty()) {
    text = donutGroup
      .append("text")
      .attr("id", _ids.getSegmentTextId(d)) // Unique ID for the text label
      .attr("class", "text-background")
      .attr("transform", transform) // Position and rotate the text
      .attr("text-anchor", "middle") // Center the text horizontally
      .attr("alignment-baseline", "middle") // Center the text vertically
      .style("font-size", "0.5rem") // Font size
      .style("font-weight", "medium") // Font weight
      .style("cursor", "pointer") // Pointer cursor on hover
      .style("fill", "currentColor")
      .style("display", selectedGroups.includes(param) ? "block" : "none") // Conditional visibility based on selected group
      .text(param); // Set text content
  }

  // Calculate the text width and arc length
  const textWidth = text.node().getComputedTextLength();
  const arcLength = d.endAngle - d.startAngle;
  const maxTextWidth =
    (Math.abs(arcLength) *
      (_constants.DONUT_OUTER_RADIUS + _constants.DONUT_INNER_RADIUS)) /
    2; // Available space for text

  // If text width exceeds available space, truncate and add "..."
  if (textWidth > maxTextWidth) {
    const truncatedText = param.length > 3 ? `${param.slice(0, 13)}...` : param;

    text.text(truncatedText); // Set truncated text
  }

  // Attach mouse events to the text element
  text
    .on("mousemove", (event: MouseEvent) => {
      _events.handleMapTooltip(true, event, d); // Show tooltip
    })
    .on("mouseout", (event: MouseEvent) => {
      _events.handleMapTooltip(false, event, d); // Hide tooltip
    })
    .on("click", () => _events.handleDonutGroupTextClick(d)); // Handle text click
};

// Get: Text rotation based on the quadrant
export const getTextRotation = (
  qd: RoadmapCustomNodeType["quadrantFlags"],
  d?: RoadmapCustomNodeType,
) => {
  const rotation = qd?.isTopLeft
    ? _constants.ROTATION_TOP_LEFT - _constants.ROTATION_TEXT_DEFAULT
    : qd?.isTopRight
      ? _constants.ROTATION_TOP_RIGHT + _constants.ROTATION_TEXT_DEFAULT
      : qd?.isMidLeft
        ? _constants.ROTATION_MIDDLE_LEFT
        : qd?.isBottomLeft
          ? _constants.ROTATION_BOTTOM_LEFT + _constants.ROTATION_TEXT_DEFAULT
          : qd?.isMidRight
            ? _constants.ROTATION_MIDDLE_RIGHT
            : qd?.isBottomRight
              ? _constants.ROTATION_BOTTOM_RIGHT -
                _constants.ROTATION_TEXT_DEFAULT
              : 0;
  const rotateTransform = `rotate(${rotation})`;
  const transform = d
    ? `translate(${d.y}, ${d.x}) ${rotateTransform}`
    : rotateTransform;

  return { rotation, transform };
};

// Calculate: Text offset based on the quadrant and depth
export const getTextOffset = (
  d: RoadmapCustomNodeType,
  qd: RoadmapCustomNodeType["quadrantFlags"],
  length: number = 160,
) => {
  // Variable: Destructure the node d
  const {
    isLastDepth,
    data: { children = [] },
  } = d;

  // Constants: Get the common offsets for the text
  const l = _constants.OFFSET_TEXT_DEFAULT;

  // Variables: Initialize offsets x and y and required variables
  let x = 0;
  let y = 0;
  const isNoChildren = children?.length < 1;

  // Check
  if (qd?.isHorizontal) {
    x = isNoChildren
      ? 0
      : qd?.isMidLeft
        ? isLastDepth
          ? -l / 6
          : l
        : qd?.isMidRight
          ? isLastDepth
            ? l / 2.8
            : -l / 10
          : l;
    y = isNoChildren ? 0 : qd?.isMidLeft ? (isLastDepth ? l / 2.4 : l / 6) : 0;
  } else if (qd?.isVertical) {
    x = isNoChildren ? -l : isLastDepth ? 0 : -l / 8;
    y = isLastDepth
      ? qd?.isTop
        ? (-l / 3) * length + 7 * (length - 1) + -l / 5
        : l / 3
      : children
        ? -7
        : 0;
  }

  return { x, y };
};

// Calculate: Skeleton text offset based on the quadrant and depth
export const getSkeletonTextOffset = (params: {
  d: RoadmapCustomNodeType;
  length?: number;
}): TextOffsetType => {
  // Variable
  const { d, length = 160 } = params;
  const { isFirstParent, isLastDepth, quadrantFlags: qd } = d;
  const { x: x0, y: y0 } = _utils.getFirstParentNodeTransform(d, qd);
  const { x: x1, y: y1 } = getTextOffset(d, qd, length);

  const [width, height, rx, ry, opacity, x, y, offsetX, offsetY] = isFirstParent
    ? [
        _constants.NODE_FIRST_PARENT.width,
        _constants.NODE_FIRST_PARENT.height,
        _constants.NODE_FIRST_PARENT.borderRadiusX,
        _constants.NODE_FIRST_PARENT.borderRadiusY,
        _constants.SKELETON_TEXT_OPACITY,
        x0,
        y0,
        qd?.isMidLeft
          ? 0 + 10
          : qd?.isMidRight
            ? -_constants.NODE_FIRST_PARENT.width - 10
            : qd?.isVertical
              ? qd?.isTop
                ? -_constants.NODE_FIRST_PARENT.width / 2 - 10
                : -_constants.NODE_FIRST_PARENT.width / 2
              : 0,
        0,
      ]
    : [
        _constants.SKELETON_TEXT_WIDTH,
        _constants.SKELETON_TEXT_HEIGHT,
        _constants.SKELETON_TEXT_BORDER_RADIUS_X,
        _constants.SKELETON_TEXT_BORDER_RADIUS_Y,
        _constants.SKELETON_TEXT_OPACITY,
        x1,
        y1,
        qd?.isHorizontal
          ? isLastDepth
            ? qd?.isMidLeft
              ? -8
              : _constants.SKELETON_TEXT_WIDTH / 2 - 16
            : qd?.isMidLeft
              ? 0
              : -_constants.SKELETON_TEXT_WIDTH - 6
          : qd?.isVertical
            ? isLastDepth
              ? 0
              : -_constants.SKELETON_TEXT_WIDTH - 10
            : 0,
        qd?.isHorizontal
          ? isLastDepth
            ? qd?.isMidLeft
              ? -4
              : -10
            : qd?.isMidLeft
              ? -4
              : -8
          : qd?.isVertical
            ? qd?.isTop
              ? isLastDepth
                ? -y1 - 40
                : 0
              : qd?.isBottom
                ? isLastDepth
                  ? 4
                  : 0
                : 0
                  ? 0
                  : -4
            : 0,
      ];

  const result = {
    width,
    height,
    rx,
    ry,
    opacity,
    x,
    y,
    offsetX,
    offsetY,
    isFirstParent,
    isLastDepth,
  };

  return result;
};

// Append: Text to the node
export const appendNodeText = (params: {
  nodeEnter: D3SelectionAllType;
  quadrantFlags: RoadmapCustomNodeType["quadrantFlags"];
}) => {
  // Destructure the parameters
  const { nodeEnter, quadrantFlags: qd } = params;

  // Iterate over each node
  nodeEnter.each(function (this: SVGElement) {
    const element = d3.select(this);

    // Check if text already exists, if so, select it; otherwise, append new text
    let textElement: D3SelectionAllType = element.select("text");

    if (textElement.empty()) {
      textElement = element.append("text");
    }

    // Set text attributes
    textElement
      .attr("dy", "0.31em")
      .attr("text-anchor", (d: RoadmapCustomNodeType) =>
        d?.children ? "end" : "start",
      )
      .each(function (this: SVGElement, d: RoadmapCustomNodeType) {
        // Destructure the current node with defaults
        const { isFirstParent, data: { name = "" } = {} } = d ?? {};

        // Handle the first parent node case
        if (isFirstParent) {
          _donuts.createFirstNode(d3.select(this), qd);

          return; // Exit early for first parent node
        }

        // Check: If the node is horizontal, display the text as is
        if (qd?.isHorizontal) {
          d3.select(this).text(name);
          const { x, y } = getTextOffset(d, qd);

          d3.select(this).attr("dx", x).attr("y", y);

          return; // Exit early for horizontal node
        }

        // Handle wrapped text for other nodes
        const wrappedText = wrapText(
          d3.select(this),
          name,
          _constants.TEXT_MAX_WIDTH_GROUP_LABEL,
          _constants.TEXT_MAX_LINES_GROUP_LABEL,
        );

        const textLength = wrappedText?.tspans?.length || 1;
        const { x, y } = getTextOffset(d, qd, textLength);

        d3.select(this).attr("dx", x).attr("y", y);
      });

    // Apply common style settings after calculations
    textElement
      .attr(
        "class",
        (d: RoadmapCustomNodeType) => _styles.adjustColorClass(d) || "",
      )
      .style("fill", (d: RoadmapCustomNodeType) =>
        d?.isHighlighted || null ? d?.parentColor || null : "currentColor",
      )
      .style("font-size", (d: RoadmapCustomNodeType) =>
        _styles.getNodeFontSize(d),
      )
      .style("font-weight", (d: RoadmapCustomNodeType) =>
        _styles.adjustDepthFontWeight(d?.depth),
      );
  });
};

// Append: Text in the center of the donut
export const appendDonutCenterText = (
  group: D3SelectionAllType,
  label?: string,
) => {
  // Check if center label already exists
  let textElement: D3SelectionAllType = group.select("text.donut-center-text");

  if (textElement.empty()) {
    textElement = group
      .append("text")
      .attr("class", "donut-center-text text-foreground");
  }

  textElement
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-family", "Poppins, sans-serif")
    .style("fill", "currentColor")
    .style("font-size", _constants.FONT_SIZE_TITLE)
    .style("font-weight", "bold")
    .style("text-transform", "uppercase")
    .text(label || _constants.TEXT_DONUT_LABEL_DEFAULT);
};
