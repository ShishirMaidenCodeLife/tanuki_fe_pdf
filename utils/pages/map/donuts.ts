import * as d3 from "d3";

import { siteImages } from "../../../data/custom/site";

import { pineappleListColors } from "@/config/style";
import * as T from "@/types";
import * as c from "@/utils/pages/map/constants";
import { createRoadmapData } from "@/utils/pages/map/data";
import * as events from "@/utils/pages/map/events";
import * as ids from "@/utils/pages/map/ids";
import * as styles from "@/utils/pages/map/styles";
import * as texts from "@/utils/pages/map/texts";
import * as utils from "@/utils/pages/map/utils";
import { toTitleCase } from "@/utils/methods/string";
import {
  getAlternatingIndex,
  adjustBoundaryIndex,
} from "@/utils/pages/map/utils";
import { handleTooltipHover } from "@/utils/methods/d3";
import { wrapText } from "@/utils/methods/text";
import { RoadmapCustomEdgeType } from "@/types";

// Default donut chart data
export const convertToDonut = (names: string[] = []): T.DefaultType => {
  // Guard clause to handle empty names
  if (!names?.length) return [];

  const midpoint = Math.floor(pineappleListColors.length / 2);
  const fallbackColor = "#000000"; // Define a default color in case of out-of-bounds

  const modifiedNames = names?.map((name, index) => {
    const baseIndex = getAlternatingIndex(
      index,
      midpoint,
      pineappleListColors.length,
    );

    // Adjust finalIndex and ensure it is non-negative
    const finalIndex =
      ((adjustBoundaryIndex(
        baseIndex,
        index === names.length - 1,
        pineappleListColors.length,
      ) %
        pineappleListColors.length) +
        pineappleListColors.length) %
      pineappleListColors.length;

    // Use color from list or fallback if undefined
    const color = pineappleListColors[finalIndex] || fallbackColor;

    return {
      id: index + 1,
      name,
      label: toTitleCase(name),
      value: 1,
      icon:
        siteImages.svg.category[name as keyof typeof siteImages.svg.category] ||
        siteImages.svg.category["designer"],
      group: "Grandparent",
      color,
    };
  });

  return modifiedNames;
};

// Draw the donut
export const drawDonutChart = (params: {
  roadmapQueries: T.UseQueryRoadmapHookType;
  roadmapStore: T.RoadmapStoreType;
}) => {
  // Variable: Destructure the parameters
  const {
    // colors,
    roadmapQueries,
    roadmapStore,
  } = params;
  const { roadmapTitles } = roadmapQueries;
  const { chartData, nodesRoot } = createRoadmapData(roadmapQueries);

  // const donutData = { data: roadmapTitles, centerLabel: chartData?.name };

  // Variable: Destructure the donut configuration
  // const { centerLabel, data } = donutData;

  // Variable: Destructure the tidy page store
  const { selectedGroups, toggleSelectedGroups } = roadmapStore;
  const donutGroup: T.D3SelectionAllType = d3.select(
    `.${c.MAP_PAGE_CLASS_DONUT_GROUP}`,
  );
  // if (donutGroup.empty()) return;

  // Clear previous chart elements
  donutGroup.selectAll("*").remove();

  // Variable: Get the donut components
  const { pie, arc, enlargedArc } = getDonutComponents();

  // #region DEBUG GROUP RECTANGLE
  // Get the width and height of the group or the parent SVG
  // const width = donutGroup.node().getBoundingClientRect()?.width || 800;
  // const height = donutGroup.node().getBoundingClientRect()?.height || 800;

  // Append a rect element with red border around the group
  // donutGroup
  //   .append("rect")
  //   // .attr("x", 0) // Start at the top-left corner
  //   // .attr("y", 0)
  //   .attr("width", width) // Set width to the group's width
  //   .attr("height", height) // Set height to the group's height
  //   .style("fill", "none") // No fill
  //   .style("stroke", "red") // Red border
  //   .style("stroke-width", 2); // Border thickness
  // #endregion DEBUG GROUP RECTANGLE

  // Draw donut segments with unique IDs and logging
  donutGroup
    .selectAll("path")
    .data(pie(roadmapTitles))
    .enter()
    .append("path")
    // .attr("d", (d: d3.PieArcDatum<RoadmapTitleType>) =>
    //   selectedGroups?.includes(d?.data?.param) ? enlargedArc : arc,
    // )
    .attr("d", (d: d3.PieArcDatum<T.RoadmapTitleType>) =>
      selectedGroups?.includes(d?.data?.param) ? enlargedArc(d) : arc(d),
    )
    .attr("id", (d: d3.PieArcDatum<T.RoadmapTitleType>) =>
      ids.getDonutPathId(d),
    )
    .attr("fill", (d: d3.PieArcDatum<T.RoadmapTitleType>) => d?.data?.color)
    // .attr("stroke", colors?.BG_COLOR)
    // .attr("stroke-width", c.STROKE_WIDTH_DEFAULT)
    .attr("cursor", "pointer")
    .style("filter", "url(#dropShadowFilter)")
    .each((d: d3.PieArcDatum<T.RoadmapTitleType>) =>
      texts.appendSegmentText({ arc, d, donutGroup, selectedGroups }),
    )

    // Event: Toggle the selected donut segment on click
    .on(
      "click",
      function (
        this: SVGElement,
        _: MouseEvent,
        d: d3.PieArcDatum<T.RoadmapTitleType>,
      ) {
        events.handleSegmentClick(
          d,
          d3.select(this),
          selectedGroups,
          toggleSelectedGroups,
        );
      },
    )

    // Event: Show the tooltip on mouseover of the donut segment
    .on(
      "mousemove",
      (event: MouseEvent, d: d3.PieArcDatum<T.RoadmapTitleType>) => {
        handleTooltipHover(true, event, d?.data?.name);
      },
    )

    // Event: Hide the tooltip on mouseout of the donut segment
    .on(
      "mouseout",
      (event: MouseEvent, d: d3.PieArcDatum<T.RoadmapTitleType>) =>
        handleTooltipHover(false, event, d?.data?.name),
    );

  // Create: Map the data and create radial groups for each donut segment
  donutGroup
    .selectAll("g")
    .data(pie(roadmapTitles))
    .enter()
    .append("g")
    .attr("id", (d: d3.PieArcDatum<T.RoadmapTitleType>) =>
      ids.getDonutGroupId(d),
    )
    .attr(
      "transform",
      (d: d3.PieArcDatum<T.RoadmapTitleType>) =>
        styles.getSegmentCoordinates({ arc, d }).transform,
    )
    .each(function (this: SVGElement, d: d3.PieArcDatum<T.RoadmapTitleType>) {
      // Variable: Get the param value from the data
      const { param } = d?.data ?? {};

      // Variable: Get the transform and quadrant flags for each segment group
      const { transform, quadrantFlags } = getDonutSegmentGroupTransform(
        arc,
        d,
      );

      // Variable: Check if the group is selected
      const isSelection = selectedGroups?.some(
        (group: string) => param === group,
      );

      // Variable: Get the root node for the selected donut segment
      const root = nodesRoot?.find(
        (item: T.RoadmapCustomNodeType) => item?.data?.name === param,
      );

      // Create: Append a group for each donut segment
      const group = d3
        .select(this)
        .style("display", isSelection ? "block" : "none")
        .attr("id", ids.getDonutGroupId(d))
        .attr("transform", transform);

      if (root) {
        // Clear the highlights from the other donut segments
        nodesRoot?.map((root: T.RoadmapCustomNodeType) => {
          if (root?.data?.name !== param) {
            // Variable: Get the nodes and lin\ks for the tree structure

            root.descendants().forEach((node: T.RoadmapCustomNodeType) => {
              node.isHighlighted = false;
              const nodeId = ids.getNodeId(node);

              utils.toggleVisibleAttribute(nodeId, false);
            });

            root.links().forEach((link: RoadmapCustomEdgeType) => {
              const linkId = ids.getLinkId(link);

              utils.toggleLinkVisible(linkId, false);
            });
          }
        });

        events.updateTree({
          // roadmapData,
          d,
          group,
          root,
          roadmapStore,
          quadrantFlags,
          roadmapQueries,
        });
      }
    });

  // Check if the center label does not already exist
  texts.appendDonutCenterText(donutGroup, chartData?.name);
};

// Donut components for the donut chart
export const getDonutComponents = () => {
  // Create the pie layout
  const pie = d3
    .pie<T.RoadmapTitleType>()
    .sort(null) // Disable sorting to preserve input order
    .value((d: T.RoadmapTitleType) => d.value);

  // Create the arc generators
  const arc = d3
    .arc<d3.PieArcDatum<T.RoadmapTitleType>>()
    .innerRadius(c.DONUT_INNER_RADIUS)
    .outerRadius(c.DONUT_OUTER_RADIUS)
    .padAngle(0.02) // Adds space between segments
    .cornerRadius(5); // Rounds corners (optional)

  // Create the enlarged arc generator
  const enlargedArc = d3
    .arc<d3.PieArcDatum<T.RoadmapTitleType>>()
    .innerRadius(c.DONUT_INNER_RADIUS - 8)
    .outerRadius(c.DONUT_OUTER_RADIUS + 8)
    .padAngle(0.02)
    .cornerRadius(5);

  return { pie, arc, enlargedArc };
};

// Determine the quadrant of the donut segment
export const getDonutSegmentInfo = (angle: number): string => {
  const fullCircle = 2 * Math.PI;

  angle = angle % fullCircle; // Normalize the angle to [0, 2π)

  if (angle < 0) angle += fullCircle; // Handle negative angles

  if (angle >= 0 && angle < Math.PI / 4) {
    return "Top-Right Quadrant";
  } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
    return "Middle-Right Quadrant";
  } else if (angle >= (3 * Math.PI) / 4 && angle < Math.PI) {
    return "Bottom-Right Quadrant";
  } else if (angle >= Math.PI && angle < (5 * Math.PI) / 4) {
    return "Bottom-Left Quadrant";
  } else if (angle >= (5 * Math.PI) / 4 && angle < (7 * Math.PI) / 4) {
    return "Middle-Left Quadrant";
  } else if (angle >= (7 * Math.PI) / 4 && angle < fullCircle) {
    return "Top-Left Quadrant";
  }

  return "Invalid angle";
};

// Find the transform for the donut segment group
export const getDonutSegmentGroupTransform = (
  arc: T.DefaultType,
  d: d3.PieArcDatum<T.RoadmapTitleType>,
) => {
  const centroid = arc.centroid(d);
  const angle = (d.startAngle + d.endAngle) / 2; // Midpoint angle in radians

  // rotation = (angle * 180) / Math.PI - 90; // Convert to degrees for alignment

  // Determine position: top, bottom, left, or right
  let x = centroid?.[0];
  let y = centroid?.[1];
  let rotation = 0; // Default no rotation

  // Variable: Get the quadrant of the donut segment
  const qd = getDonutSegmentInfo(angle);

  switch (qd) {
    case "Top-Left Quadrant":
      // x -= c.DONUT_CENTRAL_RADIUS / 2;
      // y -= c.DONUT_CENTRAL_RADIUS / 2;
      x -= c.DONUT_CENTRAL_RADIUS / 2 - 10;
      y -= c.DONUT_CENTRAL_RADIUS / 2 + 6;
      rotation = c.ROTATION_TOP_LEFT;
      // rotation = -90;
      break;
    case "Top-Right Quadrant":
      x += c.DONUT_CENTRAL_RADIUS / 2;
      // y -= c.DONUT_CENTRAL_RADIUS / 2;
      y -= c.DONUT_CENTRAL_RADIUS / 2 + 6;
      // rotation = -90;
      rotation = c.ROTATION_TOP_RIGHT;
      break;
    case "Middle-Left Quadrant":
      x -= c.DONUT_CENTRAL_RADIUS;
      rotation = c.ROTATION_MIDDLE_LEFT;
      break;
    case "Middle-Right Quadrant":
      x += c.DONUT_CENTRAL_RADIUS;
      rotation = c.ROTATION_MIDDLE_RIGHT;
      break;
    case "Bottom-Left Quadrant":
      x -= c.DONUT_CENTRAL_RADIUS / 2;
      y += c.DONUT_CENTRAL_RADIUS / 2;
      // rotation = 90;
      rotation = c.ROTATION_BOTTOM_LEFT;
      break;
    case "Bottom-Right Quadrant":
      x += c.DONUT_CENTRAL_RADIUS / 2;
      y += c.DONUT_CENTRAL_RADIUS / 2;
      // rotation = 90;
      rotation = c.ROTATION_BOTTOM_RIGHT;
      break;
    default:
      break;
  }

  // Variable: Final results
  const transform = `translate(${x}, ${y}) rotate(${rotation})`;

  // Variable: Store the quadrant flags
  const isTopLeft = qd === "Top-Left Quadrant";
  const isTopRight = qd === "Top-Right Quadrant";
  const isMidLeft = qd === "Middle-Left Quadrant";
  const isMidRight = qd === "Middle-Right Quadrant";
  const isBottomLeft = qd === "Bottom-Left Quadrant";
  const isBottomRight = qd === "Bottom-Right Quadrant";
  const isTop = isTopLeft || isTopRight;
  const isMid = isMidLeft || isMidRight;
  const isBottom = isBottomLeft || isBottomRight;
  const isHorizontal = isMid;
  const isVertical = isTop || isBottom;

  // Variable: Prepare the quadrant flags
  const quadrantFlags = {
    isTop,
    isTopLeft,
    isTopRight,
    isMid,
    isMidLeft,
    isMidRight,
    isBottom,
    isBottomLeft,
    isBottomRight,
    isHorizontal,
    isVertical,
    rotation,
  };

  // Variable: Prepare the result
  const result = {
    transform,
    qd,
    quadrantFlags,
    x,
    y,
    rotation,
  };

  return result;
};

export function getParentData(element: T.DefaultType) {
  // Ensure element is valid
  if (!element || !element.node()) {
    console.log("error", "Invalid element provided!");

    return null; // Return null if the element is invalid
  }

  // Get the parent group of the provided element
  const parentGroup = element.node().parentNode;

  // If the parent group is not found, log and return early
  if (!parentGroup) {
    console.log("log", "Parent group not found!");

    return null; // Return null if parent group is not found
  }

  // Attempt to retrieve the datum of the parent group, return empty object if not found
  const parentData = d3.select(parentGroup).datum() as T.RoadmapCustomNodeType;

  // Optional: You can log or perform additional checks here if needed
  // console.log("log", "Parent data retrieved: ", parentData);

  return parentData;
}

export function getNodeData(element: T.DefaultType) {
  // Ensure element is valid
  if (!element || !element.node) {
    console.log("error", "Invalid element provided!");

    return null; // Return null if the element is invalid
  }

  // Get the parent group of the provided element
  const nodeSelector = element.node();

  // If the parent group is not found, log and return early
  if (!nodeSelector) {
    console.log("log", "Parent group not found!");

    return null; // Return null if parent group is not found
  }

  // Attempt to retrieve the datum of the parent group, return empty object if not found
  const nodeData = d3.select(nodeSelector).datum() as T.RoadmapCustomNodeType;

  // Optional: You can log or perform additional checks here if needed
  // console.log("log", "Parent data retrieved: ", nodeData);
  return nodeData;
}

// First node or First parent of each donut segment's network
export const createFirstNode = (
  thisElement: T.DefaultType,
  quadrantFlags: T.RoadmapCustomNodeType["quadrantFlags"],
) => {
  // Get the parent group of thisElement
  const parentGroup = thisElement.node()?.parentNode;

  if (!parentGroup) {
    console.log("log", "Parent group not found!");

    return;
  }

  // Extract relevant data
  const { name = "" } = getParentData(thisElement)?.data || {};
  const { parentColor = "" } = getNodeData(thisElement) || {};

  // Wrap the parent group in a D3 selection
  const parentSelection = d3.select(parentGroup);

  // Efficiently remove existing card if it exists
  parentSelection.select(".first-node-card").remove();

  // Append a new group for the card
  const cardGroup: T.D3SelectionAllType = parentSelection
    .append("g")
    .attr("class", "first-node-card custom-scrollbar")
    .attr(
      "transform",
      (d: unknown) =>
        utils.getFirstParentNodeTransform(
          d as T.RoadmapCustomNodeType,
          quadrantFlags,
        )?.transform || "",
    );

  // Add the card background
  cardGroup
    .append("rect")
    .attr("class", "node-rect ")
    .attr("width", c.NODE_FIRST_PARENT.width)
    .attr("height", c.NODE_FIRST_PARENT.height)
    .attr("x", -c.NODE_FIRST_PARENT.width / 2)
    .attr("y", 0)
    .attr("rx", c.NODE_FIRST_PARENT.borderRadiusX)
    .attr("ry", c.NODE_FIRST_PARENT.borderRadiusY)
    .style("fill", parentColor)
    .style("stroke-width", c.NODE_FIRST_PARENT.strokeWidth)
    .style(
      "filter",
      "drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.2)) drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.1))",
    );

  // Add the card title
  const title = cardGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("class", "text-background")
    .style("fill", "currentColor")
    .style("font-size", c.FONT_SIZE_DEFAULT)
    .style("font-weight", "bold");

  // Check if the name is too long
  const { tspans } =
    wrapText(
      title,
      name,
      c.FIRST_NODE_TEXT_MAX_WIDTH - 160,
      c.FIRST_NODE_TEXT_MAX_LINES,
    ) || {};

  title.attr("y", tspans?.length === 1 ? 20 : 10);

  // Add the card description with a scrollbar
  cardGroup
    .append("foreignObject")
    .attr("x", -90) // Adjusted horizontal positioning
    .attr("y", 40) // Positioned below the title
    .attr(
      "class",
      (d: T.RoadmapCustomNodeType) => styles.adjustColorClass(d) || "",
    )
    .style("fill", "currentColor")
    .attr("width", c.FIRST_NODE_TEXT_MAX_WIDTH - 160)
    .attr("height", c.FIRST_NODE_DESCRIPTION_MAX_HEIGHT)
    .append("xhtml:div")
    .style("max-width", `${c.FIRST_NODE_TEXT_MAX_WIDTH}px`)
    .style("height", "100px")
    .style("overflow-y", "auto") // Enables scrolling
    .style("font-size", c.FONT_SIZE_SMALL)
    .style("line-height", "1.2em")
    .style("word-wrap", "break-word")
    .style("padding", "5px")
    .style("box-sizing", "border-box")
    .html(c.TEXT_LOREM_DESCRIPTION);
};
