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
  CustomEdgeType,
  ItemType,
  CustomNodeNoPosType,
  CustomNodeType,
  CustomNodeNoPosDataType,
} from "@/types/new-types";
import { markdownToJSON } from "@/utils/methods/md_editor";
import { DEFAULT_ROADMAP_TITLE } from "@/utils/pages/route-templates/view/constants";
import { getConnectedNodes } from "@/utils/pages/route-templates/view/data";
import { parseRouteNodeId } from "@/utils/pages/route-templates/view/ids";

// Check if both nodes are grandparents
export const areBothGrandparents = (
  nodes: T.RFCustomNodeType[],
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
export const getRouteNodeDetails = (d: T.RFCustomNodeType) => {
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

export const getChildIdxFromId = (id: string) => {
  const childIdx = Number(id.split("-")[2]);
  const result = isNaN(childIdx) ? 0 : childIdx;

  return result;
};

// Utility to get edge params for side-to-side connection
export const getEdgeParams = (sourceNode: any, targetNode: any) => {
  // const sourceBounds = sourceNode.measured || { width: 0, height: 0 };
  // const targetBounds = targetNode.measured || { width: 0, height: 0 };
  // const sx = sourceNode.internals.positionAbsolute.x + sourceBounds.width;
  // const sy = sourceNode.internals.positionAbsolute.y + sourceBounds.height / 2;
  // const tx = targetNode.internals.positionAbsolute.x;
  // const ty = targetNode.internals.positionAbsolute.y + targetBounds.height / 2;
  const sx = 0;
  const sy = 0;
  const tx = 0;
  const ty = targetNode.internals.positionAbsolute.y + NODE_HEADER_HEIGHT / 2; // 112 is the height of the node's header container

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos: Position.Right,
    targetPos: Position.Left,
  };
};

export const areNodesOverlapping = (
  node1: CustomNodeType,
  node2: CustomNodeType,
) => {
  // Using node width of 172px and height of NODE_HEADER_HEIGHT (112px) to detect touching
  const dx = Math.abs(node1.position.x - node2.position.x);
  const dy = Math.abs(node1.position.y - node2.position.y);

  // When nodes touch, their centers are 172px apart horizontally or NODE_HEADER_HEIGHT apart vertically
  return dx < 172 && dy < NODE_HEADER_HEIGHT;
};

export const mdToNestedTree = (md: string) => {
  const tokens = marked.lexer(md);
  const result: CustomNodeNoPosType[] = [];

  let parentIndex = 1;

  let currentNode: CustomNodeNoPosType | null = null;

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

        const topLevelItem: CustomNodeNoPosDataType = {
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

export const generateParentEdges = (nodes: CustomNodeType[]) => {
  const edges: CustomEdgeType[] = [];

  for (let i = 1; i < nodes?.length; i++) {
    edges.push({
      id: `parent-${i}-${i + 1}`,
      source: `parent-${i}`,
      target: `parent-${i + 1}`,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 40,
        height: 40,
        color: "#FFF",
      },
      label: `Level your skill ${i}`,
      style: {
        strokeWidth: 4,
        stroke: "#FFF",
      },
      labelBgPadding: [16, 16],
      labelStyle: {
        fontSize: 20,
        fill: "green",
      },
    });
  }

  return edges;
};

export const assignParentPositions = (
  nodes: CustomNodeNoPosType[],
  draggable = true,
) => {
  let y = 0; // Parent y position will be dynamically calculated

  return nodes.map((node, index) => {
    // Parent x position as per index based on even/odd
    const x = index % 2 === 0 ? PARENT_X_LEFT : PARENT_X_RIGHT;

    // Parent y position as per the parent vertical spacing
    y += 5 * PARENT_VERTICAL_SPACING;

    return {
      ...node,
      draggable,
      position: { x, y },
    };
  });
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
