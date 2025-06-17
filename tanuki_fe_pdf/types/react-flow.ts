import { Node, Edge, EdgeMarkerType } from "@xyflow/react";

import { CreateToastPayloadType } from "@/types";

export type RFConnectedNodesType = {
  currentHeading: string;
  currentDraggedNodePos: { x: number; y: number };
  INITIAL_NODES?: RFCustomNodeType[];
  nodes: RFCustomNodeType[];
  sourceNode: RFCustomNodeType;
  targetNode: RFCustomNodeType;
  setNodes: (nodes: RFCustomNodeType[]) => void;
  setMd: (md: string) => void;
  activeParentNode?: RFCustomNodeType;
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
  setNodes?: (nodes: RFCustomNodeType[]) => void;
};

export type RFNodeIndicesType = {
  indexGrandparent: number;
  indexParent?: number | null;
  indexChild?: number | null;
};

export interface RFCustomNodeType extends Node<RFNodeDataType> {
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

export interface RFCustomEdgeType extends Edge<RFEdgeDataType> {
  edgeGroup?:
    | "grandparentToGrandparentEdge"
    | "grandparentToParentEdge"
    | "parentToChildEdge";
}

export type RFNodeMouseHandler<CustomNodeType extends RFCustomNodeType> = (
  event: MouseEvent,
  node: CustomNodeType,
) => void;
