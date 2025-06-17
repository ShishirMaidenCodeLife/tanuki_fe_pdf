import * as d3 from "d3";

import { D3SelectionDivType, RoadmapDataType } from "@/types";

export const createMapD3Hierarchy = (
  roadmapData: RoadmapDataType[],
  name?: string,
) => {
  if (!roadmapData) return null;

  return {
    name: name || "IT Engineer",
    children: roadmapData?.map((item: RoadmapDataType) => ({
      ...item,
      name: item?.roadmap_json?.name,
      children: item?.roadmap_json?.children,
    })),
  };
};

// Activate tooltip on hover and close on mouseout
export const handleTooltipHover = (
  show: boolean,
  event?: MouseEvent,
  label?: string,
  offsetX?: number,
  offsetY?: number,
) => {
  const tooltipId = "dynamic-tooltip";
  let tooltip: D3SelectionDivType = d3.select(`#${tooltipId}`);

  // If tooltip doesn't exist, create it
  if (tooltip.empty()) {
    tooltip = d3
      .select("body") // Append to body to prevent overflow issues
      .append("div")
      .attr("id", tooltipId)
      .attr("class", "apply_custom_tooltip")
      // .style("position", "absolute")
      // .style("pointer-events", "none")
      .style("display", "none");
  }

  // Ensure event exists
  const pageX = event?.pageX || 0;
  const pageY = event?.pageY || 0;

  // Default offsets
  const leftOffset = pageX + (offsetX ?? 10);
  const topOffset = pageY + (offsetY ?? -20);

  if (show) {
    tooltip
      .html(label ?? "")
      .style("left", `${leftOffset}px`)
      .style("top", `${topOffset}px`)
      .style("display", "block");
  } else {
    tooltip.style("display", "none");
  }
};
