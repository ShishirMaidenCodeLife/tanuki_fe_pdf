import * as d3 from "d3";

import {
  D3SelectionDefsType,
  RFCustomEdgeType,
  RFCustomNodeType,
} from "@/types";
import { toSnakeCase } from "@/utils/methods/string";
import { getConnectedNodes } from "@/utils/pages/route-templates/view/data";
import { checkForGroups } from "@/utils/pages/route-templates/view/utils";

export const getClassIdName = (
  prefix: string = "",
  value: string | number = "",
): string => {
  return toSnakeCase(`${prefix ? `${prefix}_` : ""}${value}`);
};

// export const isColoredLine = (d: RFEdgeDataType) => {
//   const isGrandparent = ["Grandparent"].includes(d.source.group);
//   // const isDeepChildren = ["Deep Children"].includes(d?.target?.group);
//   const isNewParent =
//     d?.from?.startsWith("new-parent") &&
//     d?.target?.group === "child" &&
//     d?.source?.group === "parent";
//   // const isFlag1 = isNewParent && d?.target?.group === "Children";
//   const isFlag = isGrandparent || isNewParent;

//   return isFlag;
// };

export const getTransparentColor = (d: { color: string }): string => {
  // Use D3's color utility to parse the color
  const color = d3.color(d.color);

  // If the color can't be parsed, return the original color string
  const result = color ? `${color.formatHex()}4D` : d.color;

  return result;
};

export const lightenColor = (color: string, amount: number): string => {
  // Convert the color to HSL
  const hslColor = d3.hsl(color);

  // Increase the lightness, ensuring it doesn't exceed 1
  hslColor.l = Math.min(hslColor.l + amount, 1);

  // Convert back to hex format
  return hslColor.formatHex();
};

export const calculateDonutArcIconDimensions = (
  length: number,
): { donutArcIconWidth: number; donutArcIconHeight: number } => {
  const baseSize = 100; // Starting size for icons
  const decayFactor = 0.15; // Adjusted to control the size decrease more sharply

  // Calculate size using an exponential decay formula
  const size = Math.max(4, baseSize * Math.exp(-decayFactor * length));

  return {
    donutArcIconWidth: size,
    donutArcIconHeight: size,
  };
};

export const createSvgDefs = (svgSelector: SVGSVGElement) => {
  // Check if <defs> exists, if not, append it inside the SVG
  let defs: D3SelectionDefsType = d3.select(svgSelector).select("defs");

  if (defs.empty()) {
    defs = d3.select(svgSelector).append("defs"); // Append <defs> if not already present
  }

  // Define the drop shadow filter within defs
  const dropShadowFilterArc = defs
    .append("filter")
    .attr("id", "dropShadowFilterArc")
    .attr("height", "150%"); // Increase filter size to prevent clipping

  dropShadowFilterArc
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5); // Set the blur level

  dropShadowFilterArc.append("feOffset").attr("dx", 0).attr("dy", -2); // Offset to position the shadow vertically

  dropShadowFilterArc
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("type", "linear")
    .attr("slope", 0.4); // Adjust opacity of the shadow

  const dropShadowFeMerge = dropShadowFilterArc.append("feMerge");

  dropShadowFeMerge.append("feMergeNode");
  dropShadowFeMerge.append("feMergeNode").attr("in", "SourceGraphic");

  defs
    .append("filter")
    .attr("id", "dropShadowFilter")
    .append("feDropShadow")
    .attr("dx", 4) // Horizontal shadow offset
    .attr("dy", 4) // Vertical shadow offset
    .attr("stdDeviation", 5) // Shadow blur radius
    .attr("flood-color", "rgba(0, 0, 0, 0.1)"); // Shadow color

  // Define the glassmorphism filter within defs
  const glassmorphismFilterDefault = defs
    .append("filter")
    .attr("id", "glassmorphismFilterDefault")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");

  // Apply Gaussian blur for the frosted glass effect
  glassmorphismFilterDefault
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5) // Adjusted for a softer blur
    .attr("result", "blur");

  // Apply color matrix to adjust the color and opacity
  glassmorphismFilterDefault
    .append("feColorMatrix")
    .attr("in", "blur")
    .attr("type", "matrix")
    .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.2 0") // Adjusted opacity
    .attr("result", "coloredBlur");

  // Add a white background
  glassmorphismFilterDefault
    .append("feFlood")
    .attr("flood-color", "white")
    .attr("result", "whiteBackground");

  // Composite the white background with the blurred effect
  glassmorphismFilterDefault
    .append("feComposite")
    .attr("in", "whiteBackground")
    .attr("in2", "coloredBlur")
    .attr("operator", "in")
    .attr("result", "compositeBackground");

  // Merge the original graphic with the white background and blurred effect
  const glassmorphismFeMergeDefault =
    glassmorphismFilterDefault.append("feMerge");

  glassmorphismFeMergeDefault
    .append("feMergeNode")
    .attr("in", "compositeBackground");
  glassmorphismFeMergeDefault.append("feMergeNode").attr("in", "SourceGraphic");
};

export const getUniqueEdgeColors = (
  nodes: RFCustomNodeType[],
  edges: RFCustomEdgeType[],
): Set<string> =>
  new Set(
    edges
      .map((d: RFCustomEdgeType) => {
        // Find the source and target nodes
        const { sourceNode, targetNode } = getConnectedNodes(nodes, d.data);

        if (!targetNode) return;

        const { isChild } = checkForGroups(targetNode.data);

        return isChild
          ? targetNode.data?.strokeColor
          : sourceNode?.data?.strokeColor;
      })
      .filter((color): color is string => Boolean(color)), // Type assertion that color is a string
  );
