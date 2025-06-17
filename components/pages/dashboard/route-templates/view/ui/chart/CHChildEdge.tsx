"use client";

import React from "react";
import { getBezierPath, useInternalNode } from "@xyflow/react";

import { CHParentEdgeType } from "@/types/new-types";
import { getEdgeParams } from "@/utils/pages/route-templates/view/utils";

// interface CHChildEdgeProps {
//   id: string;
//   source: string;
//   target: string;
//   style?: React.CSSProperties;
// }

export const CHChildEdge = ({
  id,
  source,
  target,
  ...rest
}: CHParentEdgeType) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const data = rest.data;

  if (!sourceNode || !targetNode) {
    return null;
  }

  // Extract selected item ID from source node data or derive it from sourceIndex
  let selectedItemId: string | undefined;

  if (data?.sourceIndex !== undefined && sourceNode.data?.items) {
    // Get the item at the sourceIndex from the parent node's items
    const selectedItem = sourceNode.data.items[data.sourceIndex];

    selectedItemId = selectedItem?.id;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
    selectedItemId,
  );

  // Get edge color from data or default to white
  const edgeColor = data?.color || "#FFFFFF";

  // Create unique marker ID based on color
  const getMarkerIdFromColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "#FFFFFF": "white",
      "#10B981": "green",
      "#3B82F6": "blue",
      "#EF4444": "red",
    };

    return colorMap[color] || "white";
  };

  const markerColorName = getMarkerIdFromColor(edgeColor);
  const markerId = `arrowclosed-${markerColorName}`;

  // Detect if this is a parent-parent edge (no data or no parentIdx, or source/target both start with 'parent-')
  const isParentToParentEdgeEdge =
    !data ||
    typeof data.parentIdx !== "number" ||
    (source.startsWith("parent-") && target.startsWith("parent-"));

  // For parent-parent edges, use the positions from getEdgeParams directly
  if (isParentToParentEdgeEdge) {
    const [parentEdgePath] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      sourcePosition: sourcePos,
      targetPosition: targetPos,
      targetX: tx,
      targetY: ty,
    });

    return (
      <g style={{ pointerEvents: "none" }}>
        <path
          className="react-flow__edge-path animated"
          d={parentEdgePath}
          id={id}
          markerEnd={`url(#${markerId})`}
          style={{ stroke: edgeColor, strokeWidth: 4 }}
        />
        <defs>
          <marker
            id={markerId}
            markerHeight="16"
            markerUnits="strokeWidth"
            markerWidth="16"
            orient="auto"
            refX="10"
            refY="10"
          >
            <path d="M4,4 L16,10 L4,16 Z" fill={edgeColor} />
          </marker>
        </defs>
      </g>
    );
  }

  // Use the coordinates from getEdgeParams which already handles selected item positioning
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <g style={{ pointerEvents: "none" }}>
      <path
        className="react-flow__edge-path animated"
        d={edgePath}
        id={id}
        markerEnd={`url(#${markerId})`}
        style={{ stroke: edgeColor, strokeWidth: 4 }}
      />
      {/* Custom marker definition for current color */}
      <defs>
        <marker
          id={markerId}
          markerHeight="16"
          markerUnits="strokeWidth"
          markerWidth="16"
          orient="auto"
          refX="10"
          refY="10"
        >
          <path d="M4,4 L16,10 L4,16 Z" fill={edgeColor} />
        </marker>
      </defs>
    </g>
  );
};
