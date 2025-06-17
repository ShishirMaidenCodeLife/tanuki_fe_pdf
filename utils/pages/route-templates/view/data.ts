import * as T from "@/types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import * as _constants from "@/utils/pages/route-templates/view/constants";
import * as _ids from "@/utils/pages/route-templates/view/ids";

// Add a header to the markdown if it doesn't already have one
export const prependMdHeaderIfAbsent = (
  markdown: string,
  customHeader?: string,
): string => {
  const hasSingleHeader = markdown
    .trim()
    .split("\n")
    .some((line) => /^# (?!#)/.test(line.trim())); // Matches lines starting with exactly one # followed by a space

  if (!hasSingleHeader) {
    // Add the custom header at the beginning of the markdown
    return `# ${customHeader || _constants.DEFAULT_ROADMAP_TITLE}\n\n${markdown}`;
  }

  return markdown;
};

// Find the node by Id from the nodes array
export const findNodeById = (
  nodes: T.RFCustomNodeType[],
  id: string,
): T.RFCustomNodeType | undefined => {
  if (!id) {
    console.warn("No ID provided to findNodeById.");

    return undefined;
  }

  const node = nodes.find((n) => n.id === id);

  if (!node) {
    console.warn(`Node with ID "${id}" not found.`);
  }

  return node;
};

// Find the source and target nodes from the edge data
export const getConnectedNodes = (
  nodes: T.RFCustomNodeType[],
  edgeData?: T.RFEdgeDataType,
) => {
  // Return early with undefined if no nodes are provided
  if (!edgeData) {
    console.warn("No edge data provided to getConnectedNodes.");

    return { sourceNode: undefined, targetNode: undefined };
  }

  // Calculate both source and target nodes
  const sourceNode = findNodeById(nodes, edgeData.source);
  const targetNode = findNodeById(nodes, edgeData.target);

  return { sourceNode, targetNode };
};

// Extract connected nodes information from the connected nodes i.e. source and target nodes
export const parseConnectedNodes = ({
  sourceNode,
  targetNode,
}: Pick<T.RFConnectedNodesType, "sourceNode" | "targetNode">) => {
  // Extract the required properties once
  const {
    id: sourceId,
    data: { group: sourceGroup },
  } = sourceNode;
  const {
    id: targetId,
    data: { group: targetGroup },
  } = targetNode;

  // Derived properties

  //  Check if the source and target nodes are different
  const isDifferentNode = sourceId !== targetId;

  // Calculate the group types
  const isSourceGrandparent = sourceGroup === "grandparent";
  const isTargetGrandparent = targetGroup === "grandparent";
  const isSourceParent = sourceGroup === "parent";
  const isTargetParent = targetGroup === "parent";
  const isSourceChild = sourceGroup === "child";
  const isTargetChild = targetGroup === "child";

  // Calculate the IDs for grandparent, parent, and child
  const sourceGrandparentId = _ids.getNodeIdByGroup(sourceId, "grandparent");
  const targetGrandparentId = _ids.getNodeIdByGroup(targetId, "grandparent");
  const sourceParentId = isSourceParent
    ? _ids.getNodeIdByGroup(sourceId, "parent")
    : null;
  const targetParentId = isTargetParent
    ? _ids.getNodeIdByGroup(targetId, "parent")
    : null;
  const sourceChildId = isSourceChild
    ? _ids.getNodeIdByGroup(sourceId, "child")
    : null;
  const targetChildId = isTargetChild
    ? _ids.getNodeIdByGroup(targetId, "child")
    : null;

  // Check if the source and target have diferent group based entities
  const areSameGrandparents = sourceGrandparentId === targetGrandparentId;
  const areSameParents = sourceParentId === targetParentId;
  const isSameGroup = sourceGroup === targetGroup;
  const isSameGroupDifferentGrandparent = isSameGroup && !areSameGrandparents;
  const isSameGroupDifferentParent = isSameGroup && !areSameParents;

  // Swap validation using the derived properties
  const canSwap =
    (isSourceGrandparent && isTargetGrandparent && isDifferentNode) ||
    (isSourceParent &&
      isTargetParent &&
      areSameGrandparents &&
      isDifferentNode) ||
    (isSourceChild && isTargetChild && areSameParents && isDifferentNode);

  return {
    sourceId,
    sourceGroup,
    targetId,
    targetGroup,

    derived: {
      //  Check if the source and target nodes are different
      isDifferentNode,

      // Calculate the group types
      isSourceGrandparent,
      isTargetGrandparent,
      isSourceParent,
      isTargetParent,
      isSourceChild,
      isTargetChild,

      // Calculate the IDs for grandparent, parent, and child
      sourceGrandparentId,
      targetGrandparentId,
      sourceParentId,
      targetParentId,
      sourceChildId,
      targetChildId,

      // Check if the source and target have diferent group based entities
      areSameGrandparents,
      areSameParents,
      isSameGroup,
      isSameGroupDifferentGrandparent,
      isSameGroupDifferentParent,

      // Swap validation using the derived properties
      canSwap,
    },
  };
};

// Find the toast message based on the swap failure
export const getSwapFailureMessage = (
  params: Pick<T.RFConnectedNodesType, "sourceNode" | "targetNode">,
) => {
  const { sourceNode, targetNode } = params;
  const {
    isSameGroup,
    isSameGroupDifferentGrandparent,
    isSameGroupDifferentParent,
  } = parseConnectedNodes({
    sourceNode,
    targetNode,
  }).derived;

  return !isSameGroup
    ? TOAST_MESSAGES.pages.displayRoute.drag.differentGroup
    : isSameGroupDifferentGrandparent
      ? TOAST_MESSAGES.pages.displayRoute.drag.sameGroupDifferentGrandparent
      : isSameGroupDifferentParent
        ? TOAST_MESSAGES.pages.displayRoute.drag.sameGroupDifferentParent
        : TOAST_MESSAGES.default.failed;
};

// Convert markdown to a structured object
// export const convertMdToObj = (md: string = "", setNodes?: any) => {
//   // Initialize nodes and edges
//   const nodes: T.RFCustomNodeType[] = [];
//   const edges: T.RFCustomEdgeType[] = [];
//   const allGrandparentNodes: T.RFCustomNodeType[] = [];

//   // Default output structure
//   const defaultMdOutput = {
//     MD_NODES: [],
//     MD_EDGES: [],
//     headings1: [],
//     currentHeading: _constants.DEFAULT_ROADMAP_TITLE,
//     mdJson: [],
//     mdWithoutH1: [],
//   };

//   // Get the markdown JSON object
//   const mdJson: Tokens.Generic[] = markdownToJSON(md || "");
//   const { grandparents, currentHeading, headings1, headings2, mdWithoutH1 } =
//     extractMdContent(md);
//   const isMarkdownInvalid =
//     !md || md.trim() === "" || mdJson.length === 0 || grandparents.length === 0;

//   console.log("mdJson", mdJson);

//   // Return early with default values if the markdown is invalid
//   if (isMarkdownInvalid) return defaultMdOutput;
//   console.log("grandparents", grandparents);

//   // Current Y position for layout
//   let currentY = 0;

//   // Loop through the grandparents
//   grandparents.forEach((token, indexGrandparent) => {
//     // Find the color based on the grandparent index
//     const color =
//       _constants.ROUTE_COLORS[
//         indexGrandparent % _constants.ROUTE_COLORS.length || 0
//       ];

//     // Variables
//     const heading = headings2?.[indexGrandparent]?.text; // Find the heading for the grandparent node

//     // Create node for grandparent
//     const grandparentNode = createRouteNode({
//       color,
//       token,
//       group: "grandparent",
//       strokeColor: color,
//       indices: { indexGrandparent },
//       heading,
//       setNodes,
//     });

//     // Update the nodes and edges arrays
//     nodes.push(grandparentNode);

//     // Initialize local Y position for the parent nodes
//     let localY = currentY;

//     // Create an edge from the previous grandparent to the current grandparent only if there are previous grandparent nodes
//     if (allGrandparentNodes.length > 0) {
//       // Get the previous grandparent node
//       const previousGrandparent =
//         allGrandparentNodes[allGrandparentNodes.length - 1];

//       // Create an edge from the previous grandparent to the current grandparent
//       const grandparentTograndparentEdge = createRouteEdge({
//         color,
//         edgeGroup: "grandparentToGrandparentEdge",
//         subNode: grandparentNode,
//         superNode: previousGrandparent,
//         strokeColor: color,
//       });

//       // Update the nodes and edges arrays
//       edges.push(grandparentTograndparentEdge);
//     }

//     // Update the allGrandparentNodes array
//     allGrandparentNodes.push(grandparentNode);

//     // Loop throught the children of the grandparent node
//     getTokenChildren(token)?.forEach(
//       (token: Tokens.Generic, indexParent: number) => {
//         // Create node for parent
//         const parentNode = createRouteNode({
//           color,
//           token,
//           group: "parent",
//           strokeColor: color,
//           // localY,
//           indices: { indexGrandparent, indexParent },
//           setNodes,
//         });

//         // Create an edge from the grandparent to the parent node
//         const grandparentToParentEdge = createRouteEdge({
//           color,
//           edgeGroup: "grandparentToParentEdge",
//           subNode: parentNode,
//           superNode: grandparentNode,
//           strokeColor: color,
//         });

//         // Update the nodes and edges arrays
//         nodes.push(parentNode);
//         edges.push(grandparentToParentEdge);

//         // Update the local Y position
//         localY += _constants.GAP_Y;

//         // Loop through the children of the parent node
//         getTokenChildren(token)?.forEach(
//           (token: Tokens.Generic, indexChild: number) => {
//             //  Create node for child
//             const childNode = createRouteNode({
//               color,
//               group: "child",
//               indices: { indexGrandparent, indexParent, indexChild },
//               // localY,
//               strokeColor: color,
//               token,
//               setNodes,
//             });

//             // Create an edge from the parent to the child node
//             const parentToChildEdge = createRouteEdge({
//               color,
//               edgeGroup: "parentToChildEdge",
//               subNode: childNode,
//               superNode: parentNode,
//             });

//             // Update the nodes and edges arrays
//             nodes.push(childNode);
//             edges.push(parentToChildEdge);

//             // Update the local Y position
//             localY += _constants.GAP_Y;
//           },
//         );
//       },
//     );

//     // Update the current Y position for the next grandparent node
//     currentY = localY + _constants.GAP_Y * 2; // gap before the next grandparent chain
//   });

//   return {
//     MD_NODES: nodes,
//     MD_EDGES: edges,
//     headings1,
//     currentHeading: headings1?.[0]?.text || currentHeading,
//     mdJson,
//     mdWithoutH1,
//   };
// };

// Convert nodes to markdown format
export const convertNodesToMd = (
  nodes: T.RFCustomNodeType[] = [],
  currentHeading: string,
): string => {
  if (!nodes.length) return ""; // Return an empty string if no nodes are provided

  let md = `# ${currentHeading}\n\n`; // Add the main heading with an extra line after it

  // Filter and sort nodes by group and their vertical position
  const grandparentNodes = nodes
    .filter((n) => n.data.group === "grandparent")
    .sort((a, b) => a.position.y - b.position.y);
  const parentNodes = nodes
    .filter((n) => n.data.group === "parent")
    .sort((a, b) => a.position.y - b.position.y);
  const childNodes = nodes
    .filter((n) => n.data.group === "child")
    .sort((a, b) => a.position.y - b.position.y);

  // Loop through each grandparent node
  grandparentNodes.forEach((grandparent) => {
    md += `## ${grandparent.data.fullText}\n\n`; // Add the grandparent heading with an extra line after it

    // Filter parents related to the current grandparent node
    const parentsForGrandparent = parentNodes.filter(
      (p) => _ids.getNodeIdByGroup(p.id, "grandparent") === grandparent.id,
    );

    // Loop through each parent node
    parentsForGrandparent.forEach((parent, index) => {
      md += `${index + 1}. ${parent.data.fullText}\n`; // Add the parent as a numbered list item

      // Filter children related to the current parent node
      const childrenForParent = childNodes.filter(
        (c) => _ids.getNodeIdByGroup(c.id, "parent") === parent.id,
      );

      // Loop through each child node and add it as a sub-list under the parent
      childrenForParent.forEach((child) => {
        md += `    - ${child.data.fullText}\n`; // Add the child as a bulleted list item
      });
    });

    md += "\n"; // Add an empty line after processing all items under the grandparent
  });

  return md.trim(); // Return the final markdown string without leading/trailing spaces
};
