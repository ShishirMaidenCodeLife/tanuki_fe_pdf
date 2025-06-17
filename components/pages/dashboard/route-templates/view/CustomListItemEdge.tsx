"use client";

import React from "react";
import { getBezierPath, useInternalNode, Position } from "@xyflow/react";

import { CustomEdgeType } from "@/types/new-types";
import { NODE_HEADER_HEIGHT } from "@/utils/pages/route-templates/view/constants";
import { getEdgeParams } from "@/utils/pages/route-templates/view/utils";

// interface CustomListItemEdgeProps {
//   id: string;
//   source: string;
//   target: string;
//   style?: React.CSSProperties;
// }

export const CustomListItemEdge = ({
  id,
  source,
  target,
  ...rest
}: CustomEdgeType) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const data = rest.data;

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  // Detect if this is a parent-parent edge (no data or no parentIdx, or source/target both start with 'parent-')
  const isParentToParentEdgeEdge =
    !data ||
    typeof data.parentIdx !== "number" ||
    (source.startsWith("parent-") && target.startsWith("parent-"));

  // For parent-parent edges, use same style: white, bold, arrow marker, no circles
  if (isParentToParentEdgeEdge) {
    const [parentEdgePath] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      targetX: tx,
      targetY: ty,
    });

    return (
      <g style={{ pointerEvents: "none" }}>
        <path
          className="react-flow__edge-path animated"
          d={parentEdgePath}
          id={id}
          markerEnd="url(#arrowclosed-white)"
          style={{ stroke: "#FFFFFF", strokeWidth: 4 }}
        />
        <defs>
          <marker
            id="arrowclosed-white"
            markerHeight="16"
            markerUnits="strokeWidth"
            markerWidth="16"
            orient="auto"
            refX="10"
            refY="10"
          >
            <path d="M4,4 L16,10 L4,16 Z" fill="#FFFFFF" />
          </marker>
        </defs>
      </g>
    );
  }

  // Dynamically position the source circle (and edge start) at the selected list item
  let dynamicSy = sy;

  if (
    typeof data?.sourceIndex === "number" &&
    typeof data?.itemHeight === "number"
  ) {
    dynamicSy =
      (sourceNode.internals.positionAbsolute.y || 0) + NODE_HEADER_HEIGHT / 2;
  }

  // Use parentIdx from edge data to determine zig-zag direction
  const parentIdx =
    typeof data?.parentIdx === "number" ? data.parentIdx : undefined;

  let dynamicSourcePos = sourcePos;
  let dynamicTargetPos = targetPos;
  let markerStartFinal = "";

  // --- ADDED: Adjust sx for left/right edge origin ---
  let adjustedSx = sx;

  if (typeof parentIdx === "number") {
    if (parentIdx % 2 === 1) {
      // Even parent: left of parent to right of child
      dynamicSourcePos = Position.Left;
      dynamicTargetPos = Position.Right;
      // Set sx to left edge of parent
      adjustedSx = sourceNode.internals.positionAbsolute.x;
    } else {
      // Odd parent: right of parent to left of child
      dynamicSourcePos = Position.Right;
      dynamicTargetPos = Position.Left;
      // Set sx to right edge of parent (default)
      adjustedSx =
        sourceNode.internals.positionAbsolute.x +
        (sourceNode.measured?.width || 0);
    }
    markerStartFinal = "url(#arrowclosed-white)";
  } else {
    // Fallback: use x positions
    if (tx < sx) {
      dynamicSourcePos = Position.Left;
      dynamicTargetPos = Position.Right;
      adjustedSx = sourceNode.internals.positionAbsolute.x;
    } else {
      dynamicSourcePos = Position.Right;
      dynamicTargetPos = Position.Left;
      adjustedSx =
        sourceNode.internals.positionAbsolute.x +
        (sourceNode.measured?.width || 0);
    }
    markerStartFinal = "url(#arrowclosed-white)";
  }

  // --- ADDED: Adjust tx for child node edge origin (even parent) ---
  let adjustedTx = tx;

  if (typeof parentIdx === "number") {
    if (parentIdx % 2 === 1) {
      // Even parent: child node should have edge/circle on right side
      adjustedTx =
        targetNode.internals.positionAbsolute.x +
        (targetNode.measured?.width || 0) +
        16;
    } else {
      // Odd parent: child node edge/circle on left side (default)
      adjustedTx = targetNode.internals.positionAbsolute.x - 16;
    }
  } else {
    // Fallback: use x positions
    if (tx < sx) {
      adjustedTx = targetNode.internals.positionAbsolute.x;
    } else {
      adjustedTx =
        targetNode.internals.positionAbsolute.x +
        (targetNode.measured?.width || 0);
    }
  }

  const [edgePath] = getBezierPath({
    sourceX: adjustedSx,
    sourceY: dynamicSy,
    sourcePosition: dynamicSourcePos,
    targetPosition: dynamicTargetPos,
    targetX: adjustedTx,
    targetY: ty,
  });

  return (
    <g style={{ pointerEvents: "none" }}>
      <path
        className="react-flow__edge-path animated"
        d={edgePath}
        id={id}
        markerEnd="url(#arrowclosed-white)"
        markerStart={markerStartFinal}
        style={{ stroke: "#FFFFFF", strokeWidth: 4 }}
      />
      {/* Custom white marker definition */}
      <defs>
        <marker
          id="arrowclosed-white"
          markerHeight="16"
          markerUnits="strokeWidth"
          markerWidth="16"
          orient="auto"
          refX="10"
          refY="10"
        >
          <path d="M4,4 L16,10 L4,16 Z" fill="#FFFFFF" />
        </marker>
      </defs>
    </g>
  );
};
