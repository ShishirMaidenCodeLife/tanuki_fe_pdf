import * as d3 from "d3";
import { UseQueryResult } from "@tanstack/react-query";

import {
  RoadmapDataType,
  RoadmapCHNodeType,
  UseQueryRoadmapHookType,
} from "@/types";
import { createMapD3Hierarchy } from "@/utils/methods/d3";
import { collapseAllDescendants } from "@/utils/pages/map/utils";
import { RoadmapCHParentEdgeType } from "@/types";

// Extracts nodes, links, or both from a given nodesRoot structure
export const getNodesAndLinks = (
  nodesRoot: RoadmapCHNodeType[],
  type?: "nodes" | "links",
) => {
  let nodes: RoadmapCHNodeType[] = [];
  let links: RoadmapCHParentEdgeType[] = [];

  // Use a standard loop for better performance
  for (let i = 0; i < nodesRoot?.length; i++) {
    const item = nodesRoot[i];

    if (!type || type === "nodes") {
      // Directly push valid nodes
      const descendants = item?.descendants?.();

      if (descendants && descendants.length) {
        nodes.push(...descendants);
      }
    }

    if (!type || type === "links") {
      // Directly push valid links
      const itemLinks = item?.links?.();

      if (itemLinks && itemLinks.length) {
        links.push(...itemLinks);
      }
    }
  }

  // Return based on type requested
  if (type === "nodes") {
    return { nodes, links: [] }; // Return only the nodes array
  }

  if (type === "links") {
    return { nodes: [], links }; // Return only the links array
  }

  return { nodes, links }; // Return both nodes and links in an object
};

export const createRoadmapData = (
  roadmapQueries: UseQueryRoadmapHookType | any,
) => {
  const { roadmapResponses } = roadmapQueries ?? {};

  // if (roadmapResponses?.length < 1) return;

  const roadmapData = roadmapResponses?.map(
    (response: UseQueryResult<RoadmapDataType>) => response?.data,
  );
  // console.log("roadmapData", roadmapData);
  const chartData = createMapD3Hierarchy(roadmapData);
  const nodesRoot = roadmapData?.map((singleMapData: RoadmapDataType) => {
    const roadmapJson = singleMapData?.roadmap_json;

    // Return early without executing anything in case there is no roadmapJson
    if (!roadmapJson) return;

    const root: RoadmapCHNodeType = d3.hierarchy(roadmapJson);

    // Modify the x value of each node in root
    root.each(collapseAllDescendants);
    let x0 = Infinity;
    let x1 = -x0;

    root.each((d: RoadmapCHNodeType) => {
      if (d.x) {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      }
    });

    return root;
  });

  return { chartData, nodesRoot, roadmapData };
};

export const updateNodesRoot = (
  nodesRoot: RoadmapCHNodeType[],
  root: RoadmapCHNodeType,
) => {
  return (
    nodesRoot?.map((item: RoadmapCHNodeType) =>
      item.data?.uuid === root.data?.uuid ? root : item,
    ) ?? nodesRoot
  );
};
