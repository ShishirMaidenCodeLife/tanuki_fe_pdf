import { MutableRefObject, Dispatch, SetStateAction } from "react";

import {
  updateNodePositions,
  updateEdgeConnections,
  convertNodesToMarkdown,
} from "./events";
import { areNodesOverlapping, checkIfParent } from "./utils";

import {
  CHNodeType,
  InitialPositionsRefType,
  CHParentEdgeType,
  UseMindMapStoreState,
} from "@/types/new-types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast, handleErrorToast } from "@/utils/methods/style";

// Helper function for resetting drag behavior
export const resetDragBehavior = (
  draggedNodeRef: MutableRefObject<CHNodeType | null>,
  initialPositionsRef: MutableRefObject<InitialPositionsRefType>,
  setNodes: Dispatch<SetStateAction<CHNodeType[]>>,
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

// Main onNodeDragStop callback
export function handleNodeDragStop({
  eventNode,
  draggedNodeRef,
  initialPositionsRef,
  nodes,
  setNodes,
  setEdges,
  _setSelectedItemId, // Renamed to indicate it's intentionally unused during drag
  setDraggingNodeId,
  setMd,
  currentHeading,
}: {
  eventNode: CHNodeType;
  draggedNodeRef: MutableRefObject<CHNodeType | null>;
  initialPositionsRef: MutableRefObject<InitialPositionsRefType>;
  nodes: CHNodeType[];
  setNodes: Dispatch<SetStateAction<CHNodeType[]>>;
  setEdges: Dispatch<SetStateAction<CHParentEdgeType[]>>;
  _setSelectedItemId: UseMindMapStoreState["setSelectedItemId"]; // Renamed to indicate it's intentionally unused during drag
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

    // Don't close children during drag operations - only when explicitly clicking another node
    // setSelectedItemId(null); // Commented out to preserve child visibility during drag

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
  eventNode: CHNodeType;
  draggedNodeRef: MutableRefObject<CHNodeType | null>;
  initialPositionsRef: MutableRefObject<InitialPositionsRefType>;
  setDraggingNodeId: (id: string | null) => void;
}) => {
  draggedNodeRef.current = eventNode;
  initialPositionsRef.current.set(eventNode.id, eventNode.position);
  setDraggingNodeId(eventNode.id);
};
