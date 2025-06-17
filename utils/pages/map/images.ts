import { siteImages } from "../../../data/custom/site";

import {
  D3SelectionAllType,
  RoadmapCHNodeType,
  RoadmapStoreType,
} from "@/types";
import * as _constants from "@/utils/pages/map/constants";
import * as _ids from "@/utils/pages/map/ids";
import * as _styles from "@/utils/pages/map/styles";

// Create: Append the node image to the node elements
export const appendNodeImage = (params: {
  node: D3SelectionAllType;
  nodeEnter: D3SelectionAllType;
  roadmapStore: RoadmapStoreType;
  quadrantFlags?: RoadmapCHNodeType["quadrantFlags"];
}) => {
  // Variable: Destructure the parameters
  const { node, nodeEnter, roadmapStore } = params;

  // Variables: Destructure the tidy page store
  const { checkedNodes, toggleCheckedNodes } = roadmapStore;

  // Variables: Define the image width and height
  const imageWidth = _constants.NODE_RADIUS_BIG_CIRCLE * 1.5;
  const imageHeight = imageWidth;

  // Create: Add circles to the nodes
  const circles = nodeEnter
    .append("circle")
    .style("fill", (d: RoadmapCHNodeType) => d?.parentColor || "")
    .attr("r", (d: RoadmapCHNodeType) => _styles.adjustNodeCircle(d));

  // Merge the existing circles
  circles
    .merge(node.select("circle"))
    .style("fill", (d: RoadmapCHNodeType) => d?.parentColor || "")
    .attr("r", (d: RoadmapCHNodeType) => _styles.adjustNodeCircle(d));

  // Create: Add icons (image elements) to the nodes only if they the node is at the last depth
  nodeEnter
    .append("image")
    .attr(
      "xlink:href",
      // (currentD: RoadmapCHNodeType) => (currentD?.isLastDepth ? d?.data?.icon : null) // Use the image URL for the icon
      (currentD: RoadmapCHNodeType) =>
        currentD?.isLastDepth ? siteImages.svg.pineapple.squareFilled : null, // Use the image URL for the icon
    )
    .attr("width", imageWidth) // Adjust width as needed
    .attr("height", imageHeight) // Adjust height as needed
    .attr("x", -imageWidth / 2) // Position the image horizontally (centered)
    .attr("y", -imageHeight / 2) // Position the image vertically (centered)
    .attr("display", (d: RoadmapCHNodeType) =>
      d?.isLastDepth ? "block" : "none",
    ); // Show the icon only for the last depth nodes

  // Merge the existing image elements
  node
    .select("image")
    .merge(nodeEnter.select("image"))
    .attr(
      "xlink:href",
      // (currentD: RoadmapCHNodeType) => (currentD?.isLastDepth ? d?.data?.icon : null) // Ensure the correct image URL is used
      (currentD: RoadmapCHNodeType) =>
        currentD?.isLastDepth ? siteImages.svg.pineapple.squareFilled : null, // Ensure the correct image URL is used
    )
    .attr("width", imageWidth)
    .attr("height", imageHeight)
    .attr("x", -imageWidth / 2) // Position the image horizontally (centered)
    .attr("y", -imageHeight / 2) // Position the image vertically (centered)
    .attr("display", (d: RoadmapCHNodeType) =>
      d?.isLastDepth ? "block" : "none",
    );

  // Create: Add checkboxes to the nodes
  const existingCheckbox = nodeEnter.select("foreignObject");

  // If the existing checkbox is empty
  if (existingCheckbox.empty()) {
    // Create a new foreignObject if it doesn't already exist
    const foreignObject = nodeEnter
      .append("foreignObject")
      .attr("id", (d: RoadmapCHNodeType) => _ids.getCheckboxId(d))
      .attr("class", "node-checkbox")
      .attr("width", 50) // Temporarily increase size for debugging
      .attr("height", 50)
      .attr("x", -imageWidth)
      .attr("y", -imageHeight)
      .attr("display", (d: RoadmapCHNodeType) =>
        d?.isLastDepth ? "block" : "none",
      );

    foreignObject
      .append("xhtml:input")
      .attr("xmlns", "http://www.w3.org/1999/xhtml")
      .attr("type", "checkbox")
      .style("width", "20px") // Set visible width
      .style("height", "20px") // Set visible height
      .style("border-radius", "6px")
      .attr("checked", (d: RoadmapCHNodeType) =>
        checkedNodes?.some(
          (item: RoadmapCHNodeType) => item?.data?.uuid === d?.data?.uuid,
        )
          ? "checked"
          : null,
      )
      .on(
        "click",
        function (this: d3.BaseType, event: MouseEvent, d: RoadmapCHNodeType) {
          // Stop the click event from propagating to parent nodes
          event.stopPropagation();
          toggleCheckedNodes(d);

          // // Find the parent node and dispatch a click event
          // const targetNode = d3.select(this).node().parentNode.parentNode;

          // if (this.checked)
          //   if (targetNode) {
          //     d3.select(targetNode).dispatch("click");
          //   }
        },
      );

    // If the existing checkbox is not empty
  } else {
    // Update existing foreignObject if needed
    existingCheckbox
      .attr("display", (d: RoadmapCHNodeType) =>
        d?.isLastDepth ? "block" : "none",
      )
      .select("input")
      .attr("checked", (d: RoadmapCHNodeType) =>
        checkedNodes?.includes(d?.data?.uuid) ? "checked" : null,
      );
  }
};
