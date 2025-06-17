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

export interface CustomNodeDataType extends Record<string, unknown> {
  items: ItemType[];
  // id: string;
  title?: string;
  group?: "secondary";
  parentId?: string;
  isCheckable?: boolean;
  // selectedItemId?: string | null;
  onItemClick?: (itemId?: string | unknown) => void;
  onNodeDelete?: (id: string | unknown) => void;
  onItemDelete?: (id: string | unknown, itemId: string) => void;
}

export type CustomPositionType = {
  x: number;
  y: number;
};

export interface CustomNodeType extends Node<CustomNodeDataType> {
  title?: string;
}

export type CustomNodeNoPosType = Omit<CustomNodeType, "position">;
export type CustomNodeNoPosDataType = Omit<CustomNodeType, "data" | "position">;

export interface CustomCustomNodeType extends Omit<NodeProps, "data"> {
  data: CustomNodeDataType;
}

// export type CustomEdgeType = {
//   id: string;
//   source: string;
//   target: string;
// };

export interface CustomEdgeType {
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
  nodes: CustomNodeDataType | {};
  nodesDraggable: boolean;
  setNodesDraggable: (draggable: boolean) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  canReorder: boolean;
  setCanReorder: (canReorder: boolean) => void;

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
