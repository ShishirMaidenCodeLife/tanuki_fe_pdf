import { RoadmapTitleType } from "@/types";
import { RoadmapCustomEdgeType, RoadmapCustomNodeType } from "@/types";
import { toKebabCase } from "@/utils/methods/string";
import { MAP_PAGE_CLASS_DONUT_GROUP } from "@/utils/pages/map/constants";

// Unique ID for each link
export const getLinkId = (d: RoadmapCustomEdgeType) =>
  `link-${d.source.data.uuid}-${d.target.data.uuid}`;

// Unique ID for each node
export const getNodeId = (d: RoadmapCustomNodeType) => `node-${d.data.uuid}`;

// Unique ID for each donut segment
export const getDonutPathId = (
  d: d3.PieArcDatum<RoadmapTitleType>,
  withHash?: boolean,
) => {
  // Initializations
  const prefix = `${MAP_PAGE_CLASS_DONUT_GROUP}-`;

  // Variable: Destructure the data
  const { param } = d?.data ?? {};

  // Variables: Generate the unique ID
  const id = toKebabCase(`${prefix}${param}`);
  const idWithHash = `#${id}`;

  const result = withHash ? idWithHash : id;

  return result;
};

// Unique ID for each donut group
export const getDonutGroupId = (
  d: d3.PieArcDatum<RoadmapTitleType>,
  withHash?: boolean,
) => {
  // Initializations
  const prefix = `${MAP_PAGE_CLASS_DONUT_GROUP}-`;

  // Variable: Destructure the data
  const { name } = d?.data ?? {};

  // Variables: Generate the unique ID
  const id = toKebabCase(`${prefix}${name}`);
  const idWithHash = `#${id}`;

  const result = withHash ? idWithHash : id;

  return result;
};

// Unique ID for each checkbox
export const getCheckboxId = (d: RoadmapCustomNodeType) =>
  `checkbox-${d.data.uuid}`;

export const getSegmentTextId = (d: d3.PieArcDatum<RoadmapTitleType>) =>
  `segment-text-${d?.data?.param}`;
