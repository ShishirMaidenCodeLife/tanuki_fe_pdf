import {
  Node,
  NodeProps,
  EdgeProps,
  Position,
  MarkerType,
} from "@xyflow/react";
import { CSSProperties } from "react";

export type ItemType = {
  id: string;
  title?: string;
  checked?: boolean;
  items?: ItemType[];
  isParent?: boolean;
  parentId?: string;
  isSelected?: boolean;
  // url?: string;
  // isTodo?: boolean;
};

export interface CHNodeDataType extends Record<string, unknown> {
  items: ItemType[];
  // id: string;
  title?: string;
  group?: "secondary";
  parentId?: string;
  isCheckable?: boolean;
  // selectedItemId?: string | null;
  onItemClick?: (itemId?: string | unknown) => void;
  onItemDelete?: (id: string | unknown, itemId?: string) => void;
  onItemReorder?: (
    nodeId: string,
    newOrder: ItemType[],
    isChildNode?: boolean,
    parentItemId?: string,
  ) => void;
  onAddItem?: (afterItemId: string) => void;
  onTitleChange?: (nodeId: string, newTitle: string) => void;
}

export type CustomPositionType = {
  x: number;
  y: number;
};

export interface CHNodeType extends Node<CHNodeDataType> {
  title?: string;
}

export type InitialPositionsRefType = Map<string, CustomPositionType>;

export type CHNodeNoPosType = Omit<CHNodeType, "position">;
export type CHNodeNoPosDataType = Omit<CHNodeType, "data" | "position">;

export interface CustomCHNodeType extends Omit<NodeProps, "data"> {
  data: CHNodeDataType;
}

// export type CHParentEdgeType = {
//   id: string;
//   source: string;
//   target: string;
// };

export interface CHParentEdgeType {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceX?: number;
  sourceY?: number;
  targetX?: number;
  targetY?: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  markerEnd?: MarkerType | any;
  label?: string;
  labelStyle?: CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  data?: {
    sourceIndex?: number;
    targetIndex?: number;
    itemHeight?: number;
    color?: string;
    parentIdx?: number;
    isParentToParentEdge?: boolean;
  };
  style?: React.CSSProperties;
}

export interface MyListItemEdgeProps extends EdgeProps {
  data?: {
    sourceIndex?: number;
    targetIndex?: number;
    itemHeight?: number;
    color?: string;
    parentIdx?: number;
  };
}

export type UseMindMapStoreState = {
  // Required variables
  nodes: CHNodeDataType | {};
  nodesDraggable: boolean;
  setNodesDraggable: (draggable: boolean) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  activeChildId: string | null; // Track which child node should be displayed
  setActiveChildId: (id: string | null) => void;
  activeParentId: string | null; // Track which parent has the active child
  setActiveParentId: (id: string | null) => void;
  isUpdatingMdAfterReorder: boolean; // Track when we're updating MD after child reorder
  setIsUpdatingMdAfterReorder: (updating: boolean) => void;
  canReorder: boolean;
  setCanReorder: (canReorder: boolean) => void;
  draggingNodeId: string | null;
  setDraggingNodeId: (id: string | null) => void;

  // // Parent node CRUD
  // updateParent: (id: string, title: string, items: ItemType[]) => void;
  // getParent: (id?: string) => { title: string; items: ItemType[] } | undefined;
  // addParent: (id: string, title: string) => void;
  // deleteParent: (id?: string | unknown) => void;

  // // Child node CRUD
  // updateChild: (id: string, itemId: string, updates: Partial<ItemType>) => void;
  // addChild: (id: string, parentItemId: string, newItem: ItemType) => void;
  // deleteChild: (id: string, parentItemId: string, childItemId: string) => void;
};
