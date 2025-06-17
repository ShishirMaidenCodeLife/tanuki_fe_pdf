import * as d3 from "d3";

import * as _constants from "@/utils/pages/map/constants";
import * as _data from "@/utils/pages/map/data";
import * as ids from "@/utils/pages/map/ids";
import {
  D3SelectionAllType,
  DefaultType,
  RoadmapCustomEdgeType,
  RoadmapCustomNodeType,
  RoadmapTitleType,
} from "@/types";

export const getAlternatingIndex = (
  index: number,
  midpoint: number,
  length: number,
): number => {
  return index % 2 === 0
    ? (midpoint + Math.floor(index / 2)) % length
    : (midpoint - Math.ceil(index / 2) + length) % length;
};

// Helper function to adjust the final index if it falls on a boundary (e.g., first or last position)
export const adjustBoundaryIndex = (
  index: number,
  isLastElement: boolean,
  length: number,
): number => {
  if (isLastElement && (index === 0 || index === length - 1)) {
    return (index + 1) % length; // Shift to avoid first or last position
  }

  return index;
};

// Check if a node is at the last depth
export const checkIfLastDepthNode = (node: RoadmapCustomNodeType): boolean => {
  if (!node) return false;

  // A node is at the last depth if it has no children
  return !node.children || node.children?.length === 0;
};

// Check if the current node is the first parent
export const checkIfFirstParentNode = (
  currentNode: RoadmapCustomNodeType,
  activeParentNode: d3.PieArcDatum<RoadmapTitleType>,
) => currentNode?.data?.name === activeParentNode?.data?.param;

// Determine if a link is related to a node
export const isLinkRelatedToNode = (
  link: RoadmapCustomEdgeType,
  node: RoadmapCustomNodeType,
  isOnlyTarget?: boolean,
): boolean => {
  if (isOnlyTarget) return link.target === node;

  return link.source === node || link.target === node;
};

// Get the node transform based on the quadrant flags
export const getFirstParentNodeTransform = (
  d: RoadmapCustomNodeType,
  qd: RoadmapCustomNodeType["quadrantFlags"],
) => {
  // Variable: Destructure the node
  const { x = 0, y = 0 } = d;
  let finalX = x;
  let finalY = y;

  if (qd?.isTop) {
    finalX -= 10;
    finalY += 10;
  } else if (qd?.isMidLeft) {
    finalX += 110;
    finalY += -60;
    // rotation = 180;
  } else if (qd?.isMidRight) {
    finalX -= 110;
    finalY -= 60;
  } else if (qd?.isBottom) {
    finalY -= 130;
  }

  return { x: finalX, y: finalY, transform: `translate(${finalX}, ${finalY})` };
};

export const toggleVisibleAttribute = (id: string, show?: boolean) => {
  // Get the DOM element of the node using d3.select
  const element = d3.select(`#${id}`);

  if (!element.empty()) {
    if (show) {
      // element.attr("visibility", "visible").attr("opacity", 1.0);
      element.attr("opacity", _constants.OPACITY_DEFAULT);
      // .on("mouseout", function () {
      //   // Prevents previous logic from resetting styles
      //   // d3.select(this).attr("visibility", "visible").attr("opacity", 1.0);
      //   clearTooltip();
      // });
    } else {
      element.attr("opacity", _constants.OPACITY_TRANSPARENT);
    }
  }
};

export const toggleLinkVisible = (id: string, show?: boolean) => {
  // Get the DOM element of the node using d3.select
  const element = d3.select(`#${id}`);

  if (!element.empty()) {
    if (show) {
      element.attr("visibility", "visible").attr("opacity", 1.0);
    } else {
      element.attr("visibility", "hidden").attr("opacity", 0.0);
    }
  }
};

export const isMatchingLink = (
  link: RoadmapCustomEdgeType,
  node: RoadmapCustomNodeType,
) =>
  link.source?.data?.uuid === node?.data?.uuid ||
  link.target?.data?.uuid === node?.data?.uuid;

// Helper to calculate relative position with CTM
export function getRelativePositionWithCTM(
  innerNode: DefaultType,
  referenceGroup: DefaultType,
) {
  // Get the transformation matrices for the inner node and reference group
  const innerCTM = innerNode?.getCTM?.();
  const referenceCTM = referenceGroup?.getScreenCTM?.();

  // Check if the transformation matrices are available
  if (!innerCTM || !referenceCTM) {
    throw new Error("Unable to retrieve transformation matrices.");
  }

  // Calculate relative position based on the transformation matrices
  const relativeMatrix = innerCTM.multiply(referenceCTM.inverse());

  return { x: relativeMatrix.e, y: relativeMatrix.f };
}

export const getZoomedNodes = (
  event: DefaultType,
  nodesRoot: RoadmapCustomNodeType[],
) => {
  try {
    // Destructure required properties from tidyPageSvgDetails
    const g: D3SelectionAllType = d3.select(
      `.${_constants.MAP_PAGE_CLASS_MAIN_GROUP}`,
    );

    if (!g || typeof g.node !== "function") {
      console.error("SVG group element (g) is missing or invalid.");

      return;
    }

    // Validate nodesRoot and extract nodes and links
    if (!Array.isArray(nodesRoot)) {
      console.error(
        "KONICHIWA, UDIP-KUN: Invalid nodesRoot: Expected an array.",
      );

      return;
    }

    // Nodes, links, or both from a given nodesRoot structure
    const { nodes, links } = _data.getNodesAndLinks(nodesRoot);

    // Check if they exist
    if (!nodes.length || !links.length) {
      // customConsole("log", "Tree data is missing valid nodes or links.");
      return;
    }

    // Reset visibility for all nodes and links that are not highlighted
    nodes.forEach((node: RoadmapCustomNodeType) => {
      if (!node.isHighlighted) {
        const nodeId = ids.getNodeId(node);

        if (node.depth > 1) toggleVisibleAttribute(nodeId, false);
      }
    });

    links.forEach((link: RoadmapCustomEdgeType) => {
      if (!link?.target?.isHighlighted) {
        const linkId = ids.getLinkId(link);

        if (link.source.depth > 1) toggleLinkVisible(linkId, false);
      }
    });

    // Validate event transform
    const { x: transformX, y: transformY, k } = event?.transform || {};

    if (
      transformX === undefined ||
      transformY === undefined ||
      k === undefined
    ) {
      console.error("Invalid transform data in the event.");

      return;
    }

    // Set up circular area
    const circleRadius = 250;
    const zoomTransform = d3.zoomTransform(g.node());
    const eventX = event?.sourceEvent?.offsetX || 0;
    const eventY = event?.sourceEvent?.offsetY || 0;
    const [svgX, svgY] = zoomTransform.invert([eventX, eventY]);

    // let circularArea = g.select(".circular-area");
    // if (circularArea.empty()) {
    //   circularArea = g
    //     .append("circle")
    //     .attr("class", "circular-area")
    //     .attr("fill", "pink")
    //     // .attr("fill", "none")
    //     // .attr("stroke", "red")
    //     // .attr("stroke-width", 2)
    //     .attr("opacity", 0.1)
    //     .lower();
    // }
    // circularArea.attr("cx", svgX).attr("cy", svgY).attr("r", circleRadius);

    // Memoize node positions to avoid redundant calculations
    const nodePositions = new Map();

    // Filter nodes within the zoomed circular area
    const zoomAreaNodes = nodes.filter((node: RoadmapCustomNodeType) => {
      const nodeId = ids.getNodeId(node);
      const nodeElement = d3.select(`#${nodeId}`);

      if (!nodeElement.empty()) {
        if (!nodePositions.has(nodeId)) {
          const { x: nodeRelativeX, y: nodeRelativeY } =
            getRelativePositionWithCTM(nodeElement.node(), g.node());

          nodePositions.set(nodeId, { nodeRelativeX, nodeRelativeY });
        }
        const { nodeRelativeX, nodeRelativeY } = nodePositions.get(nodeId);
        const dx = (nodeRelativeX - 0.7 * svgX) * (k + 0.5);
        const dy = (nodeRelativeY - 0.8 * svgY) * (k + 0.5);
        const isInsideCircle = Math.sqrt(dx * dx + dy * dy) <= circleRadius;

        if (isInsideCircle) {
          // Make the node visible
          toggleVisibleAttribute(nodeId, true);

          // Make the children visible up to 1 level
          if (node.children && node.children?.length > 0) {
            node.children.forEach((child: RoadmapCustomNodeType) => {
              const childId = ids.getNodeId(child);

              // Make the first child node visible inside children
              toggleVisibleAttribute(childId, true);
            });
          }

          links.forEach((link: RoadmapCustomEdgeType) => {
            const linkId = ids.getLinkId(link);
            // prevEdges.push({ linkId, link, node });
            const show =
              isMatchingLink(link, node) || link?.target?.isHighlighted;

            // Toggle visibility for the link based on the match
            toggleLinkVisible(linkId, show);
          });
        } else {
          // const allHighlightedNodes = nodes?.filter(
          //   (node: RoadmapCustomNodeType) => node?.isHighlighted
          // );
          // const allHighlightedLinks = links?.filter(
          //   (link: RoadmapCustomEdgeType) => link?.target?.isHighlighted
          // );
        }

        return isInsideCircle;
      }

      return false;
    });

    zoomAreaNodes.forEach((node: RoadmapCustomNodeType) => {
      // #region Node workings
      // Make the children visible up to 1 level
      node.children?.forEach((child: RoadmapCustomNodeType) => {
        const childId = ids.getNodeId(child);

        toggleVisibleAttribute(childId, true);
      });
      // #endregion Node workings

      // #region Link workings
      // Get direct links (node as source or target)
      const directLinks = links.filter(
        (link: RoadmapCustomEdgeType) =>
          link.source?.data?.uuid === node?.data?.uuid ||
          link.target?.data?.uuid === node?.data?.uuid,
      );

      // Step 2: Collect ancestor links
      let ancestorLinks: RoadmapCustomEdgeType[] = [];
      let currentNode = node;

      while (currentNode.parent) {
        const parentNode = currentNode.parent;

        toggleVisibleAttribute(ids.getNodeId(parentNode), true);
        const parentLink = links.find(
          (link: RoadmapCustomEdgeType) =>
            (link.source?.data?.uuid === parentNode.data?.uuid &&
              link.target?.data?.uuid === currentNode.data?.uuid) ||
            (link.target?.data?.uuid === parentNode.data?.uuid &&
              link.source?.data?.uuid === currentNode.data?.uuid),
        );

        if (parentLink) ancestorLinks.push(parentLink);
        currentNode = parentNode;
      }

      // Combine both direct and ancestor links
      const allRelatedLinks = [...directLinks, ...ancestorLinks];

      // Style the related links
      allRelatedLinks.forEach((link: RoadmapCustomEdgeType) => {
        const linkId = ids.getLinkId(link);

        toggleLinkVisible(linkId, true);
      });

      // // Debug: Log the related links for the current node
      // customConsole("log",`All related links for node ${nodeId}:`, allRelatedLinks);
      // #endregion Link workings
    });
  } catch (error) {
    console.error("Error in getZoomedNodes:", error);
  }
};

// Function to recursively collapse all children
export const collapseAllDescendants = (node: RoadmapCustomNodeType) => {
  node.collapsed = false;

  if (node.children) {
    node.children?.forEach(collapseAllDescendants);
  }
};
