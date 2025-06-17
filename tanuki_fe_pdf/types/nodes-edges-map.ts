export type BudgetaryScaleType = {
  smallBudget: number;
  mediumBudget: number;
  largeBudget: number;
};

export type BusinessScaleType = {
  smallBusiness: number;
  startupBusiness: number;
  mediumSizedBusiness: number;
  largeBusiness: number;
};

export type IndustryType = {
  retail: number;
  manufacturing: number;
  finance: number;
  healthcare: number;
  media: number;
  [key: string]: number;
};

export type StageOfDevelopmentType = {
  developmentInitialStage: number;
  developmentMidStage: number;
  developmentLateStage: number;
};

export type TypeOfBusinessType = {
  newBusiness: number;
  digitizationOfExistingBusiness: number;
  operationalEfficiency: number;
  improvementOfCustomerExperience: number;
};

export type BusinessType = {
  budgetaryScale: BudgetaryScaleType;
  businessScale: BusinessScaleType;
  industry: IndustryType;
  stageOfDevelopment: StageOfDevelopmentType;
  typeOfBusiness: TypeOfBusinessType;
};

export type RoadmapJsonType = {
  businessType?: BusinessType;
  children?: RoadmapJsonType[];
  collapsed?: boolean;
  name: string;
  uuid: string;
  param?: string;
  color?: string;
  group?: "child" | "parent" | "grandparent";
};

export type RoadmapDataType = {
  map_title: string;
  map_type: string;
  roadmap_json: RoadmapJsonType;
};

export type RelatedSkillType = {
  name: string;
  uuid: string;
  weight: number;
};

export type D3HierarchyCustomNodeType = {
  name: string;
  children?: D3HierarchyCustomNodeType[]; // Recursive structure
};

export type RoadmapRouteNodeDataType = {
  businessType: BusinessType;
  description: string;
  name: string;
  uuid: string;
  relatedSkills: RelatedSkillType[];
  children: RoadmapRouteNodeDataType[];
};

export type CustomCustomNodeType = {
  filterId?: string;
  rx?: number;
  ry?: number;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  x?: number;
  y?: number;
  isLastDepth?: boolean;
  isFirstParent?: boolean;
};

export interface TextOffsetType extends CustomCustomNodeType {
  width: number;
  height: number;
}

export interface RoadmapCustomNodeType
  extends d3.HierarchyNode<RoadmapJsonType>,
    CustomCustomNodeType {
  collapsed?: boolean;
  isHighlighted?: boolean;
  parentColor?: string;
  quadrantFlags?: {
    isTopLeft: boolean;
    isTopRight: boolean;
    isBottomLeft: boolean;
    isBottomRight: boolean;
    isMidLeft: boolean;
    isMidRight: boolean;
    isTop: boolean;
    isBottom: boolean;
    isVertical: boolean;
    isHorizontal: boolean;
  };
  children?: this[];
  // param?: string;
}

export type RoadmapCustomEdgeType = {
  randomColor?: string;
  source: RoadmapCustomNodeType;
  target: RoadmapCustomNodeType;
};
