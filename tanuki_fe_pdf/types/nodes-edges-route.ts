// import { DefaultType, NextImageType } from "@/types/global";
// import { D3SelectionGType, D3SelectionSVGType } from "@/types/d3";

// export type RouteCustomNodeType = {
//   // Mandatory properties
//   id: string;
//   text: string;
//   color: string;
//   group: "child" | "parent" | "grandparent";

//   // Optional properties
//   fullText?: string;
//   icon?: NextImageType | string;
//   index?: number;
//   indices?: {
//     indexGrandparent?: number;
//     indexParent?: number;
//     indexChild?: number;
//     grandparentCount?: number;
//     parentCount?: number;
//     childrenCount?: number;
//     d?: DefaultType;
//     e?: DefaultType;
//   };
//   strokeColor?: string;
//   x?: number;
//   y?: number;
//   vy?: number;
//   vx?: number;
// };

// export type RouteCustomEdgeType = {
//   // Mandatory properties
//   length: number;
//   source: RouteCustomNodeType;
//   target: RouteCustomNodeType;

//   // Optional properties
//   from?: string;
//   to?: string;
//   index?: number;
//   strokeDashArray?: string;
// };

// export type RouteNodeDataType = {
//   __data__: RouteCustomNodeType;
// };

// export type RouteNodeSelectionType = {
//   _groups: RouteCustomNodeType[][];
//   _parents: (RouteCustomNodeType | null)[];
// };

// export type RouteSvgType = {
//   svg?: D3SelectionSVGType | null;
//   roadmapGraph?: D3SelectionGType | null;
//   width?: number;
//   height?: number;
// };
