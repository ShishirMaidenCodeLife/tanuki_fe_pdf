import { BaseType, Selection, ZoomTransform } from "d3";
import { MutableRefObject } from "react";

import { DefaultType } from "@/types";
// D3 Selection Types
export type D3SelectionAllType = Selection<
  DefaultType,
  DefaultType,
  DefaultType,
  DefaultType
>;

export type D3SelectionDivType = Selection<
  HTMLDivElement,
  unknown,
  HTMLElement,
  DefaultType
>;

export type D3SelectionSVGType = d3.Selection<
  SVGSVGElement,
  unknown,
  HTMLElement,
  DefaultType
>;

export type D3SelectionGType = d3.Selection<
  SVGGElement,
  unknown,
  HTMLElement,
  DefaultType
>;

export type D3SelectionCircleType = d3.Selection<
  SVGCircleElement,
  DefaultType,
  DefaultType,
  DefaultType
>;

export type D3SelectionTextType = d3.Selection<
  SVGTextElement,
  DefaultType,
  DefaultType,
  DefaultType
>;

export type D3SelectionDefsType = d3.Selection<
  SVGDefsElement,
  unknown,
  HTMLElement | SVGSVGElement | null,
  undefined
>;

// Route Page Types
export type D3RouteCustomNodeType = {
  d: DefaultType;
  isSelectedNode?: boolean;
  isFirstParentNode?: boolean;
};

export interface D3RpGroupType extends D3RouteCustomNodeType {
  currentGroup: D3SelectionAllType;
}

export interface D3RpItemType extends D3RouteCustomNodeType {
  nodeItem: D3SelectionAllType;
}

export interface D3RpItemCircleType extends D3RouteCustomNodeType {
  nodeItem: D3SelectionCircleType;
}

export type D3RouteNodeElementType = Selection<
  SVGGElement,
  DefaultType,
  DefaultType,
  DefaultType
>;

export type D3RouteEdgeElementType = Selection<
  SVGGElement | BaseType,
  DefaultType,
  DefaultType,
  DefaultType
>;

// Curve & Transform Types
export type D3CurveParamsType = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  curvature?: number;
  offset?: number;
};

export type D3EdgeEnterType = Selection<
  SVGPathElement,
  DefaultType,
  null,
  undefined
>;

export type D3TransformRefType = MutableRefObject<ZoomTransform>;
