import { MarkerType, Position } from "@xyflow/react";
import { marked, Tokens } from "marked";

import {
  NODE_HEADER_HEIGHT,
  PARENT_VERTICAL_SPACING,
  PARENT_X_LEFT,
  PARENT_X_RIGHT,
} from "./constants";

import * as T from "@/types";
import {
  CHParentEdgeType,
  ItemType,
  CHNodeNoPosType,
  CHNodeType,
  CHNodeNoPosDataType,
} from "@/types/new-types";
import { markdownToJSON } from "@/utils/methods/md_editor";
import { DEFAULT_ROADMAP_TITLE } from "@/utils/pages/route-templates/view/constants";
import { getConnectedNodes } from "@/utils/pages/route-templates/view/data";
import { parseRouteNodeId } from "@/utils/pages/route-templates/view/ids";

// Check if both nodes are grandparents
export const areBothGrandparents = (
  nodes: T.RFCHNodeType[],
  d: T.RFEdgeDataType,
) => {
  // Find the source and target nodes
  const { sourceNode, targetNode } = getConnectedNodes(nodes, d);

  // Return false if either node is not found
  if (!sourceNode || !targetNode) return false;

  // Get the group information for both nodes
  const { isGrandparent: i1 } = checkForGroups(sourceNode);
  const { isGrandparent: i2 } = checkForGroups(targetNode);

  return i1 && i2;
};

// Check for groups
export const checkForGroups = (d: T.RFNodeDataType) => {
  // Conditions for the groups to be matched
  const isChild = d.group === "child";
  const isGrandparent = d.group === "grandparent";
  const isParent = d.group === "parent";

  // Modified variables
  const isColorWhite = isGrandparent;

  // Prepare all variables in a single line
  const result = { isChild, isParent, isGrandparent, isColorWhite };

  return result;
};

// Get the node details
export const getRouteNodeDetails = (d: T.RFCHNodeType) => {
  const { indexGrandparent = 0 } = parseRouteNodeId(d.id);
  const isEvenGrandparentNode = indexGrandparent % 2 === 0;
  const evenNodeMultiplier = isEvenGrandparentNode ? 1 : -1;
  const totalItems = 12;

  // Assemble the result
  const result = {
    isEvenGrandparentNode,
    evenNodeMultiplier,
    totalItems,
  };

  return result;
};

export const checkIfParent = (id?: string | unknown): boolean =>
  typeof id === "string" && id.startsWith("parent-");

export const checkIfChild = (id?: string | unknown): boolean =>
  typeof id === "string" && id.startsWith("child-");

export const checkIfEdge = (id?: string | unknown): boolean =>
  typeof id === "string" && id.startsWith("edge-");

// Generate consistent edge ID from source and target IDs
export const generateEdgeId = (sourceId: string, targetId: string): string =>
  `edge-${sourceId}-${targetId}`;

// Color cycling utility for edges (white, green, blue, red)
export const getEdgeColorByIndex = (index: number): string => {
  const colors = ["#FFFFFF", "#10B981", "#3B82F6", "#EF4444"]; // white, green, blue, red

  return colors[index % colors.length];
};

// Get edge color based on node name/title initials
export const getEdgeColorByNodeName = (nodeName: string): string => {
  // const colors = ["#FFFFFF", "#10B981", "#3B82F6", "#EF4444"]; // white, green, blue, red
  const colors = ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]; // white, green, blue, red

  // Extract initials or use first few characters
  const initials = nodeName
    .split(/\s+/) // Split by whitespace
    .map((word) => word.charAt(0).toUpperCase()) // Get first letter of each word
    .join(""); // Join them together

  // If no initials found, use first character
  const keyString = initials || nodeName.charAt(0).toUpperCase();

  // Create a simple hash from the key string
  let hash = 0;

  for (let i = 0; i < keyString.length; i++) {
    hash = keyString.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use absolute value to ensure positive index
  const colorIndex = Math.abs(hash) % colors.length;

  return colors[colorIndex];
};

export const getChildIdxFromId = (id: string) => {
  const childIdx = Number(id.split("-")[2]);
  const result = isNaN(childIdx) ? 0 : childIdx;

  return result;
};

// Utility to get edge params for different types of connections
export const getEdgeParams = (
  sourceNode: any,
  targetNode: any,
  selectedItemId?: string,
  offset: number = -24,
) => {
  const sourceBounds = sourceNode.measured || { width: 0, height: 0 };
  const targetBounds = targetNode.measured || { width: 0, height: 0 };

  // Check if this is a parent-to-child connection
  const isParentToChild =
    checkIfParent(sourceNode.id) && checkIfChild(targetNode.id);

  if (isParentToChild) {
    // Calculate source Y position based on selected item or use header mid-point as fallback
    let sourceY =
      sourceNode.internals.positionAbsolute.y + NODE_HEADER_HEIGHT / 2;

    // If there's a selected item, position the edge at that item's mid-point
    if (selectedItemId && sourceNode.data?.items) {
      const selectedItemIndex = sourceNode.data.items.findIndex(
        (item: any) => item.id === selectedItemId,
      );

      if (selectedItemIndex !== -1) {
        // Calculate the Y position of the selected item
        // Header height + padding + (item index * item height) + (item height / 2)
        sourceY =
          sourceNode.internals.positionAbsolute.y +
          NODE_HEADER_HEIGHT +
          16 + // padding top from the content section
          selectedItemIndex * 83.2 + // item height (5.2rem = 83.2px)
          83.2 / 2; // Mid-point of the item
      }
    }

    // Determine if child is on left or right side based on position
    const isChildOnRight =
      targetNode.internals.positionAbsolute.x >
      sourceNode.internals.positionAbsolute.x;

    if (isChildOnRight) {
      // Child is on the right side: connect from right side of parent to left side of child header
      const sx = sourceNode.internals.positionAbsolute.x + sourceBounds.width;
      const sy = sourceY;
      const tx = targetNode.internals.positionAbsolute.x + offset; // Add offset to prevent arrow hiding
      const ty =
        targetNode.internals.positionAbsolute.y + NODE_HEADER_HEIGHT / 2;

      return {
        sx,
        sy,
        tx,
        ty,
        sourcePos: Position.Right,
        targetPos: Position.Left,
      };
    } else {
      // Child is on the left side: connect from left side of parent to right side of child header
      const sx = sourceNode.internals.positionAbsolute.x;
      const sy = sourceY;
      const tx =
        targetNode.internals.positionAbsolute.x + targetBounds.width - offset; // Subtract offset to prevent arrow hiding
      const ty =
        targetNode.internals.positionAbsolute.y + NODE_HEADER_HEIGHT / 2;

      return {
        sx,
        sy,
        tx,
        ty,
        sourcePos: Position.Left,
        targetPos: Position.Right,
      };
    }
  } else {
    // For parent-to-parent connections: bottom-to-top connections
    const sx = sourceNode.internals.positionAbsolute.x + sourceBounds.width / 2;
    const sy = sourceNode.internals.positionAbsolute.y + sourceBounds.height;
    const tx = targetNode.internals.positionAbsolute.x + targetBounds.width / 2;
    const ty = targetNode.internals.positionAbsolute.y + offset; // Add offset to prevent arrow hiding

    return {
      sx,
      sy,
      tx,
      ty,
      sourcePos: Position.Bottom,
      targetPos: Position.Top,
    };
  }
};

// Helper function to calculate dynamic node height based on content
export const calculateDynamicNodeHeight = (node: CHNodeType): number => {
  const headerHeight = NODE_HEADER_HEIGHT; // 112px for header
  const itemHeight = 112; // Approximately 7rem (112px) per item - updated for enhanced dimensions
  const paddingBottom = 16; // 4 units of padding bottom
  const baseMinHeight = 50; // From Reorder.Group minHeight

  // Count the number of items in the node
  const itemCount = node.data.items?.length || 0;

  // Calculate total content height
  const contentHeight = itemCount * itemHeight;

  // Total estimated height: header + content + padding
  const totalHeight =
    headerHeight + Math.max(contentHeight, baseMinHeight) + paddingBottom;

  return totalHeight;
};

export const areNodesOverlapping = (node1: CHNodeType, node2: CHNodeType) => {
  // Use actual node dimensions: min-w-[480px] for width and dynamic height based on content
  const nodeWidth = 480; // Matches min-w-[480px] from CHNode

  // Calculate dynamic heights for both nodes
  const node1Height = calculateDynamicNodeHeight(node1);
  const node2Height = calculateDynamicNodeHeight(node2);

  // Use the average height for overlap detection
  const avgHeight = (node1Height + node2Height) / 2;

  const dx = Math.abs(node1.position.x - node2.position.x);
  const dy = Math.abs(node1.position.y - node2.position.y);

  // More generous overlap detection - trigger swap when nodes actually intersect
  // Allow for some margin so swapping feels more natural
  const horizontalOverlap = dx < nodeWidth * 0.7; // 70% of node width (336px)
  const verticalOverlap = dy < avgHeight * 1; // 80% of average node height for better overlap detection

  return horizontalOverlap && verticalOverlap;
};

export const mdToNestedTree = (md: string) => {
  const tokens = marked.lexer(md);
  const result: CHNodeNoPosType[] = [];

  let parentIndex = 1;

  let currentNode: CHNodeNoPosType | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "heading" && token.depth === 2) {
      currentNode = {
        id: `parent-${parentIndex}`,
        type: "custom",
        data: {
          title: token.text,
          nodeId: `parent-${parentIndex}`,
          items: [],
        },
      };
      result.push(currentNode);
      parentIndex++;
    }

    if (token.type === "list" && currentNode) {
      // console.log("token", token);
      token.items.forEach((item: Tokens.Generic, idx: number) => {
        const topLevelId = `${parentIndex - 1}-${idx + 1}`;
        const topLevelLabel = item.text?.split("\n")[0].trim() || "";

        const subItems: ItemType[] = [];

        if (item.tokens) {
          const nestedList = item.tokens.find(
            (t) => t.type === "list",
          ) as Tokens.List;

          if (nestedList?.items) {
            nestedList.items.forEach((subItem, subIdx) => {
              subItems.push({
                id: `${topLevelId}-${subIdx + 1}`,
                title: subItem.text,
              });
            });
          }
        }

        const topLevelItem: CHNodeNoPosDataType = {
          id: topLevelId,
          title: topLevelLabel,
          ...(subItems.length > 0 ? { items: subItems } : {}),
        };

        currentNode !== null && currentNode.data.items.push(topLevelItem);
      });
    }
  }

  // Workings for edges
  const MD_NODES = assignParentPositions(result);
  const MD_EDGES = generateParentEdges(MD_NODES);

  // console.log("MD_NODES", MD_NODES);

  return { MD_NODES, MD_EDGES };
};

export const generateParentEdges = (nodes: CHNodeType[]) => {
  const edges: CHParentEdgeType[] = [];

  for (let i = 1; i < nodes?.length; i++) {
    const sourceId = `parent-${i}`;
    const targetId = `parent-${i + 1}`;

    // Get the source node to extract its title for color generation
    const sourceNode = nodes.find((node) => node.id === sourceId);
    const edgeColor = sourceNode?.data?.title
      ? getEdgeColorByNodeName(sourceNode.data.title)
      : getEdgeColorByIndex(i - 1);

    edges.push({
      id: generateEdgeId(sourceId, targetId),
      source: sourceId,
      target: targetId,
      type: "customListItem",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 40,
        height: 40,
        color: edgeColor,
      },
      label: `Level your skill ${i}`,
      style: {
        strokeWidth: 4,
        stroke: edgeColor,
      },
      labelBgPadding: [16, 16],
      labelStyle: {
        fontSize: 20,
        fill: "green",
      },
      data: {
        parentIdx: i - 1,
        isParentToParentEdge: true,
        color: edgeColor,
      },
    });
  }

  return edges;
};

export const assignParentPositions = (
  nodes: CHNodeNoPosType[],
  draggable = true,
) => {
  let y = 0; // Parent y position will be dynamically calculated

  return nodes.map((node, index) => {
    // Parent x position as per index based on even/odd
    const x = index % 2 === 0 ? PARENT_X_LEFT : PARENT_X_RIGHT;

    // Calculate dynamic spacing based on node content
    if (index > 0) {
      // Get the previous node to calculate spacing based on its content
      const previousNode = nodes[index - 1];
      const estimatedHeight = calculateNodeHeight(previousNode);

      // Add spacing: estimated height + gap between nodes
      y += estimatedHeight + PARENT_VERTICAL_SPACING;
    }

    return {
      ...node,
      draggable,
      position: { x, y },
    };
  });
};

// Helper function to estimate node height based on content
const calculateNodeHeight = (node: CHNodeNoPosType): number => {
  const headerHeight = NODE_HEADER_HEIGHT; // 112px for header
  const itemHeight = 112; // Approximately 7rem (112px) per item - updated for enhanced dimensions
  const paddingBottom = 16; // 4 units of padding bottom
  const baseMinHeight = 50; // From Reorder.Group minHeight

  // Count the number of items in the node
  const itemCount = node.data.items?.length || 0;

  // Calculate total content height
  const contentHeight = itemCount * itemHeight;

  // Total estimated height: header + content + padding
  const totalHeight =
    headerHeight + Math.max(contentHeight, baseMinHeight) + paddingBottom;

  return totalHeight;
};

// Remove the first heading (H1) from the markdown JSON object
export const removeMdH1 = (mdJson: Tokens.Generic[]) =>
  mdJson?.filter(
    ({ type, depth }: Tokens.Generic) => !(type === "heading" && depth === 1),
  );

// Extract the content from the markdown JSON object
export const extractMdContent = (md = "") => {
  const mdJson: Tokens.Generic[] = markdownToJSON(md || "");
  const mdWithoutH1 = removeMdH1(mdJson);
  const grandparents = getMdObject(mdWithoutH1, "list");

  // Headings
  const currentHeading = DEFAULT_ROADMAP_TITLE;
  const headings = getMdObject(mdJson, "heading");
  const headings1 = headings.filter(
    (heading: Tokens.Generic) => heading.depth === 1,
  );
  const headings2 = headings.filter(
    (heading: Tokens.Generic) => heading.depth === 2,
  );

  return {
    grandparents,
    currentHeading,
    headings,
    headings1,
    headings2,
    mdWithoutH1,
  };
};

// Get the markdown object based on the item type
export const getMdObject = (json?: Tokens.Generic[], itemType?: string) =>
  json?.filter(({ type }: Tokens.Generic) => itemType === type) ?? [];
