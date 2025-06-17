import { Node, Edge, EdgeMarkerType } from "@xyflow/react";

import { CreateToastPayloadType } from "@/types";

export type RFConnectedNodesType = {
  currentHeading: string;
  currentDraggedNodePos: { x: number; y: number };
  INITIAL_NODES?: RFCHNodeType[];
  nodes: RFCHNodeType[];
  sourceNode: RFCHNodeType;
  targetNode: RFCHNodeType;
  setNodes: (nodes: RFCHNodeType[]) => void;
  setMd: (md: string) => void;
  activeParentNode?: RFCHNodeType;
  toast?: CreateToastPayloadType;
};

export type RFNodeDataType = {
  group?: "grandparent" | "parent" | "child";
  fullText?: string;
  label?: string;
  icon?: string;
  parentId?: string;
  grandparentId?: string;
  color?: string;
  strokeColor?: string;
  setNodes?: (nodes: RFCHNodeType[]) => void;
};

export type RFNodeIndicesType = {
  indexGrandparent: number;
  indexParent?: number | null;
  indexChild?: number | null;
};

export interface RFCHNodeType extends Node<RFNodeDataType> {
  idx?: {
    grandparent: string | null;
    parent: string | null;
    child: string | null;
  };
}

// Define custom edge data if needed
export type RFEdgeDataType = {
  source: string;
  target: string;
  label?: string;
  style?: React.CSSProperties;
  animated?: boolean;
  type?: string;
  markerEnd?: EdgeMarkerType;
};

export interface RFCHParentEdgeType extends Edge<RFEdgeDataType> {
  edgeGroup?:
    | "grandparentToGrandparentEdge"
    | "grandparentToParentEdge"
    | "parentToChildEdge";
}

export type RFNodeMouseHandler<CHNodeType extends RFCHNodeType> = (
  event: MouseEvent,
  node: CHNodeType,
) => void;
