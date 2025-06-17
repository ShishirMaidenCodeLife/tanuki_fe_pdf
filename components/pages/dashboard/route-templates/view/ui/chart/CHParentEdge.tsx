import React from "react";
import { getBezierPath, Position } from "@xyflow/react";

import { CHParentEdgeType } from "@/types/new-types";

export const CHParentEdge = ({
  id,
  source,
  target,
  sourceX = 0,
  sourceY = 0,
  targetX = 0,
  targetY = 0,
  sourcePosition,
  targetPosition,
  data,
}: CHParentEdgeType) => {
  if (!source || !target) {
    return null;
  }

  const isParentToParentEdge =
    data?.isParentToParentEdge ||
    (source.startsWith("parent-") && target.startsWith("parent-"));

  if (isParentToParentEdge) {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      targetX,
      targetY,
    });

    return (
      <g style={{ pointerEvents: "none" }}>
        <path
          className="react-flow__edge-path animated"
          d={edgePath}
          id={id}
          markerEnd="url(#arrowclosed-child)"
          style={{ stroke: "#FFFFFF", strokeWidth: 4 }}
        />
        <defs>
          <marker
            id="arrowclosed-child"
            markerHeight="16"
            markerUnits="strokeWidth"
            markerWidth="16"
            orient="auto"
            refX="10"
            refY="10"
            viewBox="0 0 20 20"
          >
            <path d="M4,4 L16,10 L4,16 Z" fill="#FFFFFF" />
          </marker>
        </defs>
      </g>
    );
  }

  // Regular child connection
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  return (
    <g style={{ pointerEvents: "none" }}>
      <path
        className="react-flow__edge-path animated"
        d={edgePath}
        id={id}
        markerEnd="url(#arrowclosed-child)"
        style={{ stroke: "#FFFFFF", strokeWidth: 4 }}
      />
      <defs>
        <marker
          id="arrowclosed-child"
          markerHeight="16"
          markerUnits="strokeWidth"
          markerWidth="16"
          orient="auto"
          refX="10"
          refY="10"
          viewBox="0 0 20 20"
        >
          <path d="M4,4 L16,10 L4,16 Z" fill="#FFFFFF" />
        </marker>
      </defs>
    </g>
  );
};
