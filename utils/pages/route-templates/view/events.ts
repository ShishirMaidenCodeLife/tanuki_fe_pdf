import { MutableRefObject, Dispatch, SetStateAction } from "react";

import {
  PARENT_X_RIGHT,
  CHILD_X_OFFSET,
  PARENT_X_LEFT,
  NODE_HEADER_HEIGHT,
  ROUTE_NODE_ITEM_HEIGHT,
} from "./constants";
import {
  areNodesOverlapping,
  checkIfChild,
  checkIfParent,
  generateEdgeId,
  getEdgeColorByNodeName,
} from "./utils";
import { recalculateNodePositions } from "./hooks";

import * as _t from "@/types/new-types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast, handleErrorToast } from "@/utils/methods/style";

// Helper function to convert nodes back to markdown
export const convertNodesToMarkdown = (
  nodes: _t.CHNodeType[],
  currentHeading: string,
): string => {
  if (!nodes.length) return `# ${currentHeading}\n\n`;

  let md = `# ${currentHeading}\n\n`;

  // Sort nodes by vertical position to maintain order
  const sortedNodes = nodes
    .filter((node) => checkIfParent(node.id) && node.data.title) // Only include parent nodes with titles
    .sort((a, b) => a.position.y - b.position.y);

  sortedNodes.forEach((node) => {
    // Add the section heading
    md += `## ${node.data.title}\n\n`;

    // Add the items under this section
    if (node.data.items && node.data.items.length > 0) {
      node.data.items.forEach((item, index) => {
        md += `${index + 1}. ${item.title}\n`;

        // Add sub-items if they exist
        if (item.items && item.items.length > 0) {
          item.items.forEach((subItem) => {
            md += `    - ${subItem.title}\n`;
          });
        }
      });
    }

    md += "\n"; // Add empty line after each section
  });

  return md.trim();
};

// Helper function for resetting drag behavior
const resetDragBehavior = (
  draggedNodeRef: MutableRefObject<_t.CHNodeType | null>,
  initialPositionsRef: MutableRefObject<_t.InitialPositionsRefType>,
  setNodes: Dispatch<SetStateAction<_t.CHNodeType[]>>,
  setDraggingNodeId: (id: string | null) => void,
  message?: (typeof TOAST_MESSAGES.pages.displayRoute.drag)[keyof typeof TOAST_MESSAGES.pages.displayRoute.drag],
): void => {
  if (!draggedNodeRef.current) return;

  const draggedId = draggedNodeRef.current.id;
  const initialPos = initialPositionsRef?.current.get(draggedId);

  if (initialPos) {
    setNodes((nds) =>
      nds.map((n) => (n.id === draggedId ? { ...n, position: initialPos } : n)),
    );
  }

  message && handleCustomToast(message);
  draggedNodeRef.current = null;
  setDraggingNodeId(null);
};

// Helper functions for node position management
export const updateNodePositions = (
  draggedId: string,
  targetId: string,
  draggedPos: _t.CustomPositionType,
  targetPos: _t.CustomPositionType,
): ((nds: _t.CHNodeType[]) => _t.CHNodeType[]) => {
  return (nds: _t.CHNodeType[]): _t.CHNodeType[] => {
    // Calculate position differences for child node adjustments
    const deltaX = targetPos.x - draggedPos.x;
    const deltaY = targetPos.y - draggedPos.y;

    return nds.map((n) => {
      if (n.id === draggedId) {
        return { ...n, position: targetPos };
      }

      if (n.id === targetId) {
        return { ...n, position: draggedPos };
      }

      // Move child nodes along with their parents
      if (checkIfChild(n.id)) {
        const parentId = n.data.parentId;

        if (parentId === draggedId) {
          // Child of dragged node - move it with the parent
          return {
            ...n,
            position: {
              x: n.position.x + deltaX,
              y: n.position.y + deltaY,
            },
          };
        } else if (parentId === targetId) {
          // Child of target node - move it with the target
          return {
            ...n,
            position: {
              x: n.position.x - deltaX,
              y: n.position.y - deltaY,
            },
          };
        }
      }

      return n;
    });
  };
};

// Helper function for edge updates
export const updateEdgeConnections = (
  draggedNode: _t.CHNodeType,
  overlappingNode: _t.CHNodeType,
  allNodes: _t.CHNodeType[],
): ((eds: _t.CHParentEdgeType[]) => _t.CHParentEdgeType[]) => {
  return (eds: _t.CHParentEdgeType[]): _t.CHParentEdgeType[] => {
    const parentNodes = allNodes.filter((n) => checkIfParent(n.id));
    const isParentSwap =
      checkIfParent(draggedNode.id) && checkIfParent(overlappingNode.id);

    if (isParentSwap) {
      // For parent node swaps, we need to handle sequential parent-to-parent edges

      // Get the indices of the swapped parent nodes
      const draggedIndex = parentNodes.findIndex(
        (n) => n.id === draggedNode.id,
      );
      const overlappingIndex = parentNodes.findIndex(
        (n) => n.id === overlappingNode.id,
      );

      // Create a new sorted array with swapped positions
      const newParentOrder = [...parentNodes];

      if (draggedIndex !== -1 && overlappingIndex !== -1) {
        [newParentOrder[draggedIndex], newParentOrder[overlappingIndex]] = [
          newParentOrder[overlappingIndex],
          newParentOrder[draggedIndex],
        ];
      }

      return eds.map((edge) => {
        // Check if this is a parent-to-parent sequential edge using the new edge ID pattern
        const isSequentialParentEdge =
          edge.id.match(/^edge-parent-\d+-parent-\d+$/) &&
          checkIfParent(edge.source) &&
          checkIfParent(edge.target);

        if (isSequentialParentEdge) {
          // Extract the indices from the edge source and target
          const sourceMatch = edge.source.match(/^parent-(\d+)$/);
          const targetMatch = edge.target.match(/^parent-(\d+)$/);

          if (sourceMatch && targetMatch) {
            const sourceIdx = parseInt(sourceMatch[1]) - 1; // Convert to 0-based index
            const targetIdx = parseInt(targetMatch[1]) - 1; // Convert to 0-based index

            // Update the edge to use the new parent order
            if (
              sourceIdx < newParentOrder.length &&
              targetIdx < newParentOrder.length
            ) {
              const newSource = newParentOrder[sourceIdx].id;
              const newTarget = newParentOrder[targetIdx].id;

              return {
                ...edge,
                id: generateEdgeId(newSource, newTarget),
                source: newSource,
                target: newTarget,
                data: {
                  ...edge.data,
                  parentIdx: sourceIdx,
                },
              };
            }
          }
        }

        // Handle child edges connected to swapped parent nodes
        const isEdgeAffected =
          edge.source === draggedNode.id ||
          edge.target === draggedNode.id ||
          edge.source === overlappingNode.id ||
          edge.target === overlappingNode.id;

        if (
          isEdgeAffected &&
          edge.type === "customListItem" &&
          !isSequentialParentEdge
        ) {
          let updatedEdge = { ...edge };

          // Swap source connections
          if (edge.source === draggedNode.id) {
            updatedEdge.source = overlappingNode.id;
          } else if (edge.source === overlappingNode.id) {
            updatedEdge.source = draggedNode.id;
          }

          // Swap target connections
          if (edge.target === draggedNode.id) {
            updatedEdge.target = overlappingNode.id;
          } else if (edge.target === overlappingNode.id) {
            updatedEdge.target = draggedNode.id;
          }

          // Update parentIdx based on the new source node
          const sourceParentIdx = newParentOrder.findIndex(
            (n) => n.id === updatedEdge.source,
          );

          return {
            ...updatedEdge,
            data: {
              ...edge.data,
              parentIdx:
                sourceParentIdx >= 0 ? sourceParentIdx : edge.data?.parentIdx,
            },
          };
        }

        return edge;
      });
    } else {
      // For non-parent swaps (child nodes), use simpler logic
      return eds.map((edge) => {
        const isEdgeAffected =
          edge.source === draggedNode.id ||
          edge.target === draggedNode.id ||
          edge.source === overlappingNode.id ||
          edge.target === overlappingNode.id;

        if (!isEdgeAffected || edge.type !== "customListItem") {
          return edge;
        }

        let updatedEdge = { ...edge };

        // Swap source connections
        if (edge.source === draggedNode.id) {
          updatedEdge.source = overlappingNode.id;
        } else if (edge.source === overlappingNode.id) {
          updatedEdge.source = draggedNode.id;
        }

        // Swap target connections
        if (edge.target === draggedNode.id) {
          updatedEdge.target = overlappingNode.id;
        } else if (edge.target === overlappingNode.id) {
          updatedEdge.target = draggedNode.id;
        }

        // Update parentIdx if needed
        const sourceParentIdx = parentNodes.findIndex(
          (n) => n.id === updatedEdge.source,
        );

        return {
          ...updatedEdge,
          data: {
            ...edge.data,
            parentIdx:
              sourceParentIdx >= 0 ? sourceParentIdx : edge.data?.parentIdx,
          },
        };
      });
    }
  };
};

// Main onNodeDragStop callback
export function handleNodeDragStop({
  eventNode,
  draggedNodeRef,
  initialPositionsRef,
  nodes,
  setNodes,
  setEdges,
  _setSelectedItemId, // Renamed to indicate it's intentionally unused
  setDraggingNodeId,
  setMd,
  currentHeading,
}: {
  eventNode: _t.CHNodeType;
  draggedNodeRef: MutableRefObject<_t.CHNodeType | null>;
  initialPositionsRef: MutableRefObject<_t.InitialPositionsRefType>;
  nodes: _t.CHNodeType[];
  setNodes: Dispatch<SetStateAction<_t.CHNodeType[]>>;
  setEdges: Dispatch<SetStateAction<_t.CHParentEdgeType[]>>;
  _setSelectedItemId: _t.UseMindMapStoreState["setSelectedItemId"]; // Renamed to indicate it's intentionally unused
  setDraggingNodeId: (id: string | null) => void;
  setMd: (md: string) => void;
  currentHeading: string;
}): void {
  try {
    if (!draggedNodeRef.current) return;

    const draggedId = eventNode.id;
    const draggedInitialPos = initialPositionsRef.current.get(draggedId);
    const otherNodes = nodes.filter((n) => n.id !== draggedId);
    const overlappingNode = otherNodes.find((otherNode) =>
      areNodesOverlapping(eventNode, otherNode),
    );

    if (!overlappingNode || !draggedInitialPos) {
      const message = overlappingNode
        ? TOAST_MESSAGES.pages.displayRoute.drag.notCloseEnough
        : undefined;

      resetDragBehavior(
        draggedNodeRef,
        initialPositionsRef,
        setNodes,
        setDraggingNodeId,
        message,
      );

      return;
    }

    const targetId = overlappingNode.id;
    const areDifferentGroups =
      checkIfParent(targetId) !== checkIfParent(draggedId);

    if (areDifferentGroups) {
      resetDragBehavior(
        draggedNodeRef,
        initialPositionsRef,
        setNodes,
        setDraggingNodeId,
        TOAST_MESSAGES.pages.displayRoute.drag.differentGroup,
      );

      return;
    }

    // Don't close children during parent node drag operations
    // setSelectedItemId(null); // Commented out to preserve child visibility

    setNodes(
      updateNodePositions(
        draggedId,
        targetId,
        draggedInitialPos,
        overlappingNode.position,
      ),
    );

    // const newEdges = updateEdgeConnections(eventNode, overlappingNode, nodes);

    // console.log(newEdges);

    setEdges(updateEdgeConnections(eventNode, overlappingNode, nodes));

    // Swap the positions for reference
    initialPositionsRef.current.set(eventNode.id, overlappingNode.position);
    const overlappingInitialPos = initialPositionsRef.current.get(targetId);

    if (overlappingInitialPos) {
      initialPositionsRef.current.set(overlappingNode.id, draggedInitialPos);
    }

    handleCustomToast(TOAST_MESSAGES.pages.displayRoute.drag.success);

    // Update markdown content to reflect the new node order
    // Use a longer timeout to ensure the nodes state has been fully updated after React's state batching
    setTimeout(() => {
      setNodes((currentNodes) => {
        const updatedMarkdown = convertNodesToMarkdown(
          currentNodes,
          currentHeading,
        );

        setMd(updatedMarkdown);

        return currentNodes;
      });
    }, 100); // Increased timeout to 100ms to ensure state has updated
  } catch (error) {
    console.error("Error in handleNodeDragStop:", error);

    handleErrorToast({ message: "Failed to update node positions" });
  } finally {
    draggedNodeRef.current = null;
    setDraggingNodeId(null);
  }
}

export const handleNodeDragStart = ({
  eventNode,
  draggedNodeRef,
  initialPositionsRef,
  setDraggingNodeId,
}: {
  eventNode: _t.CHNodeType;
  draggedNodeRef: MutableRefObject<_t.CHNodeType | null>;
  initialPositionsRef: MutableRefObject<_t.InitialPositionsRefType>;
  setDraggingNodeId: (id: string | null) => void;
}) => {
  draggedNodeRef.current = eventNode;
  initialPositionsRef.current.set(eventNode.id, eventNode.position);
  setDraggingNodeId(eventNode.id);
};

export function handleItemDelete({
  id,
  itemId,
  nodes,
  setNodes,
  setEdges,
  currentHeading,
  setMd,
}: {
  id?: string | unknown;
  itemId?: string | unknown;
  nodes: _t.CHNodeType[];
  setNodes: React.Dispatch<React.SetStateAction<_t.CHNodeType[]>>;
  setEdges: React.Dispatch<React.SetStateAction<_t.CHParentEdgeType[]>>;
  currentHeading: string;
  setMd: (md: string) => void;
}): void {
  const childId = `child-${itemId}`;
  const isChildNode = checkIfChild(id);

  try {
    const parentNodeId =
      isChildNode && typeof id === "string" ? id.split("-")[1] : id;
    const originalParentNode = nodes.find((n) => n.id === parentNodeId);

    if (!originalParentNode) {
      console.warn("Parent node not found:", parentNodeId);

      return;
    }

    const nodesToRemove = new Array<string>();

    nodesToRemove.push(childId);

    const collectDescendants = (itemId?: string | unknown) => {
      const childNodeId = `child-${itemId}`;
      const childNode = nodes.find((n) => n.id === childNodeId);

      if (childNode?.data?.items) {
        childNode.data.items.forEach((item: _t.ItemType) => {
          const descendantNodeId = `child-${item.id}`;

          nodesToRemove.push(descendantNodeId);
          collectDescendants(item.id);
        });
      }
    };

    collectDescendants(itemId);

    setNodes((prevNodes) => {
      const updateChilds = (items: _t.ItemType[]): _t.ItemType[] =>
        items
          .filter((item) => item.id !== itemId)
          .map((item) => ({
            ...item,
            items: item.items ? updateChilds(item.items) : [],
          }));

      const updatedNodes = prevNodes
        .filter((node) => !nodesToRemove.includes(node.id))
        .map((node) => {
          if (node.id === parentNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                items: updateChilds(node.data.items),
              },
            };
          }

          return node;
        });

      // Recalculate positions for all nodes when content changes
      const nodesWithRecalculatedPositions =
        recalculateNodePositions(updatedNodes);

      // Schedule markdown update for next render cycle
      setTimeout(() => {
        const newMd = convertNodesToMarkdown(
          nodesWithRecalculatedPositions,
          currentHeading,
        );

        setMd(newMd);
      }, 0);

      return nodesWithRecalculatedPositions;
    });

    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) =>
          !nodesToRemove.some((id) => edge.source === id || edge.target === id),
      ),
    );
  } catch (error) {
    console.error("Error while deleting item:", error);
  }
}

export function handleNodeClick({
  itemId,
  parentId,
  nodes,
  setNodes,
  setEdges,
  onItemDelete,
  setActiveChildId,
  setActiveParentId,
  updateMarkdownFromNodes,
}: {
  itemId?: string | unknown;
  parentId?: string;
  nodes: _t.CHNodeType[];
  setNodes: React.Dispatch<React.SetStateAction<_t.CHNodeType[]>>;
  setEdges: React.Dispatch<React.SetStateAction<_t.CHParentEdgeType[]>>;
  onItemDelete: _t.CHNodeDataType["onItemDelete"];
  setActiveChildId?: (id: string | null) => void;
  setActiveParentId?: (id: string | null) => void;
  updateMarkdownFromNodes?: (nodes: _t.CHNodeType[]) => void;
}) {
  if (!parentId) return;

  // Return early if the item's parent is already a child
  if (checkIfChild(parentId)) return;

  const parentNode = nodes.find((n) => n.id === parentId);

  if (!parentNode) return;

  const parentItems = Array.isArray(parentNode?.data?.items)
    ? parentNode.data.items
    : [];

  const sourceIndex = parentItems.findIndex(
    (item: _t.ItemType) => item.id === itemId,
  );

  if (sourceIndex === -1) return;

  const selectedParentItem = parentItems[sourceIndex];

  if (!selectedParentItem) return;

  const parentNodeY = parentNode.position.y;
  const parentNodes = nodes.filter((n) => checkIfParent(n.id));
  const parentIdx = parentNodes.findIndex((n) => n.id === parentId);
  const isEven = parentIdx % 2 === 0;

  const childX = isEven
    ? PARENT_X_RIGHT + CHILD_X_OFFSET
    : PARENT_X_LEFT - CHILD_X_OFFSET;
  // const childY = parentNodeY + NODE_HEADER_HEIGHT;
  const childY = parentNodeY - NODE_HEADER_HEIGHT;

  const childNodeId = `child-${itemId}`;

  const processNestedItems = (item: _t.ItemType) => ({
    ...item,
    parentId: itemId,
    isSelected: false,
    checked: item.checked ?? false,
    items: item.items
      ? item.items.map((child: any) => processNestedItems(child))
      : [],
  });

  // Update markdown with any pending changes from the current child node before switching
  if (updateMarkdownFromNodes) {
    const currentParentNodes = nodes.filter((n) => checkIfParent(n.id));

    updateMarkdownFromNodes(currentParentNodes);
  }

  const updatedNodes = nodes
    .filter((n) => !checkIfChild(n.id))
    .map((n) => ({
      ...n,
      data: {
        ...n.data,
        // selectedItemId: n.id === parentId ? itemId : null,
      },
    }));

  updatedNodes.push({
    id: childNodeId,
    type: "custom",
    position: { x: childX, y: childY },
    data: {
      title: selectedParentItem.title || "",
      items: selectedParentItem.items
        ? selectedParentItem.items.map((item) => processNestedItems(item))
        : [],
      group: "secondary",
      parentId,
      onItemDelete,
      isCheckable: false,
    },
  });

  // Track the active child and parent for persistence across MD updates
  if (setActiveChildId && typeof itemId === "string") {
    setActiveChildId(itemId);
  }
  if (setActiveParentId && parentId) {
    setActiveParentId(parentId);
  }

  setNodes(updatedNodes);

  setEdges((eds) => [
    // Keep all parent-to-parent edges and remove only child edges from the same parent
    ...eds.filter((e) => {
      // Keep parent-to-parent edges (they connect parent to parent)
      if (checkIfParent(e.source) && checkIfParent(e.target)) {
        return true;
      }

      // Remove existing child edges from the same parent
      if (e.source === parentId && checkIfChild(e.target)) {
        return false;
      }

      // Keep all other edges
      return true;
    }),
    {
      id: generateEdgeId(parentId, childNodeId),
      source: parentId,
      target: childNodeId,
      type: "customListItem",
      data: {
        sourceIndex,
        targetIndex: 0,
        itemHeight: ROUTE_NODE_ITEM_HEIGHT,
        color: getEdgeColorByNodeName(parentNode.data.title || parentId),

        parentIdx,
      },
    },
  ]);
}
