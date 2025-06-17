import { checkIfParent } from "./utils";

import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast } from "@/utils/methods/style";
import * as _t from "@/types/new-types";

// Helper functions for node position management
export const updateNodePositions = (
  draggedId: string,
  targetId: string,
  draggedPos: _t.CustomPositionType,
  targetPos: _t.CustomPositionType,
): ((nds: _t.CustomNodeType[]) => _t.CustomNodeType[]) => {
  return (nds: _t.CustomNodeType[]): _t.CustomNodeType[] => {
    return nds.map((n) => {
      if (n.id === draggedId) {
        return { ...n, position: targetPos };
      }

      if (n.id === targetId) {
        return { ...n, position: draggedPos };
      }

      return n;
    });
  };
};

// Helper function for edge updates
export const updateEdgeConnections = (
  draggedNode: _t.CustomNodeType,
  overlappingNode: _t.CustomNodeType,
  allNodes: _t.CustomNodeType[],
): ((eds: _t.CustomEdgeType[]) => _t.CustomEdgeType[]) => {
  return (eds: _t.CustomEdgeType[]): _t.CustomEdgeType[] => {
    return eds.map((edge) => {
      const isEdgeAffected =
        edge.source === draggedNode.id ||
        edge.target === draggedNode.id ||
        edge.source === overlappingNode.id ||
        edge.target === overlappingNode.id;

      if (!isEdgeAffected || edge.type !== "customListItem") {
        return edge;
      }

      const parentNodes = allNodes.filter((n) => checkIfParent(n.id));
      let parentIdx = -1;

      if (edge.source === draggedNode.id) {
        parentIdx = parentNodes.findIndex((n) => n.id === overlappingNode.id);
      } else if (edge.source === overlappingNode.id) {
        parentIdx = parentNodes.findIndex((n) => n.id === draggedNode.id);
      } else {
        parentIdx = parentNodes.findIndex((n) => n.id === edge.source);
      }

      if (parentIdx === -1) {
        return edge;
      }

      return {
        ...edge,
        data: {
          ...edge.data,
          parentIdx,
        },
      };
    });
  };
};

// Helper function for resetting drag behavior
export const resetDragBehavior = (
  message: (typeof TOAST_MESSAGES.pages.displayRoute.drag)[keyof typeof TOAST_MESSAGES.pages.displayRoute.drag],
  draggedNode: React.MutableRefObject<_t.CustomNodeType | null>,
  initialPositions: React.MutableRefObject<Map<string, _t.CustomPositionType>>,
  setNodes: React.Dispatch<React.SetStateAction<_t.CustomNodeType[]>>,
): void => {
  if (!draggedNode.current) return;

  const draggedId = draggedNode.current.id;
  const initialPos = initialPositions.current.get(draggedId);

  if (initialPos) {
    setNodes((nds) =>
      nds.map((n) => (n.id === draggedId ? { ...n, position: initialPos } : n)),
    );
  }

  handleCustomToast(message);
  draggedNode.current = null;
};
