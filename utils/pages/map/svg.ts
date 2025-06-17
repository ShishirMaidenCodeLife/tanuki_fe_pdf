// Create: SVG and Main Group elements
// export const getSvgDetails = () => {
//   try {
//     // Select elements using class names
//     const svg = d3.select(`.${_constants.MAP_PAGE_CLASS_SVG}`);
//     const g = d3.select(`.${_constants.MAP_PAGE_CLASS_MAIN_GROUP}`);
//     const donutGroup = d3.select(`.${_constants.MAP_PAGE_CLASS_DONUT_GROUP}`);

import {
  D3SelectionAllType,
  D3SelectionDefsType,
  D3SelectionSVGType,
} from "@/types";

//     // Ensure that the elements are found in the DOM
//     if (svg.empty() || g.empty() || donutGroup.empty()) {
//       customConsole("warn", "SVG or Main Group element not found in the DOM.");
//     }

//     // Create the definitions for the SVG
//     createDefsForSvg(svg);

//     // Dynamically fetch the width and height of the SVG node with robust fallbacks
//     const svgNode = svg.node() as HTMLElement | null;
//     const width =
//       svgNode?.clientWidth ||
//       svgNode?.getBoundingClientRect()?.width ||
//       _constants.SVG_WIDTH_DEFAULT;
//     const height =
//       svgNode?.clientHeight ||
//       svgNode?.getBoundingClientRect()?.height ||
//       _constants.SVG_HEIGHT_DEFAULT;

//     // Check if the calculated dimensions are valid
//     if (!width || !height) {
//       customConsole("warn", "Failed to calculate SVG dimensions.");
//     }

//     // Return the computed values
//     return { donutGroup, svg, g, width, height };
//   } catch (error) {
//     customConsole("error", "Error in createSvg:", error);

//     // Return default values to prevent downstream failures
//     return {
//       svg: {},
//       g: {},
//       donutGroup: {},
//       width: _constants.SVG_WIDTH_DEFAULT || 0,
//       height: _constants.SVG_HEIGHT_DEFAULT || 0,
//     };
//   }
// };

export const appendGlassMorphismFilter = (defs: D3SelectionDefsType) => {
  const filter = defs
    .append("filter")
    .attr("id", "appendGlassMorphismFilter")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");

  // Apply Gaussian blur for the frosted glass effect
  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5) // Adjusted for a softer blur
    .attr("result", "blur");

  // Apply color matrix to adjust the color and opacity
  filter
    .append("feColorMatrix")
    .attr("in", "blur")
    .attr("type", "matrix")
    .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.2 0") // Adjusted opacity
    .attr("result", "coloredBlur");

  // Add a white background
  filter
    .append("feFlood")
    .attr("flood-color", "white")
    .attr("result", "whiteBackground");

  // Composite the white background with the blurred effect
  filter
    .append("feComposite")
    .attr("in", "whiteBackground")
    .attr("in2", "coloredBlur")
    .attr("operator", "in")
    .attr("result", "compositeBackground");

  // Merge the original graphic with the white background and blurred effect
  const glassmorphismFeMergeDefault = filter.append("feMerge");

  glassmorphismFeMergeDefault
    .append("feMergeNode")
    .attr("in", "compositeBackground");
  glassmorphismFeMergeDefault.append("feMergeNode").attr("in", "SourceGraphic");
};

export const appendDropShadowFilter = (defs: D3SelectionDefsType) => {
  // Define the drop shadow filter within defs
  const filter = defs
    .append("filter")
    .attr("id", "appendDropShadowFilter")
    // .attr("id", "dropShadowFilterArc")
    .attr("height", "150%"); // Increase filter size to prevent clipping

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5); // Set the blur level

  filter.append("feOffset").attr("dx", 0).attr("dy", -2); // Offset to position the shadow vertically

  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("type", "linear")
    .attr("slope", 0.4); // Adjust opacity of the shadow

  const dropShadowFeMerge = filter.append("feMerge");

  dropShadowFeMerge.append("feMergeNode");
  dropShadowFeMerge.append("feMergeNode").attr("in", "SourceGraphic");

  defs
    .append("filter")
    .attr("id", "dropShadowFilter")
    .append("feDropShadow")
    .attr("dx", 0.5) // Horizontal shadow offset
    .attr("dy", 0.5) // Vertical shadow offset
    .attr("stdDeviation", 2) // Shadow blur radius
    .attr("flood-color", "rgba(0, 0, 0, 0.1)"); // Shadow color
};

export const createColorFilterIfNeeded = (
  svg: D3SelectionAllType,
  color: string,
) => {
  // Ensure <defs> exists
  let defs: D3SelectionDefsType = svg.select("defs");

  if (defs.empty()) {
    defs = svg.append("defs");
  }

  // Use color as the ID
  const filterId = `colorFilter-${color.replace("#", "")}`;

  // Check if the filter already exists
  if (!svg.select(`#${filterId}`).empty()) {
    return filterId; // Return existing ID
  }

  // Define the filter with the color as ID
  const filter = defs
    .append("filter")
    .attr("id", filterId)
    .attr("color-interpolation-filters", "sRGB");

  // Add flood and composite for the color
  filter.append("feFlood").attr("flood-color", color).attr("result", "flood");

  filter
    .append("feComposite")
    .attr("in", "flood")
    .attr("in2", "SourceGraphic")
    .attr("operator", "in");

  return filterId; // Return the filter ID
};

export const appendColorFilter = (defs: D3SelectionDefsType) => {
  const filter = defs
    .append("filter")
    .attr("id", "appendColorFilter")
    // .attr("id", "colorFilterCustom")
    .attr("color-interpolation-filters", "sRGB");

  filter
    .append("feColorMatrix")
    .attr("type", "matrix")
    .attr(
      "values",
      "0.393 0.769 0.189 0 0  0.349 0.686 0.168 0 0  0.272 0.534 0.131 0 0  0 0 0 1 0",
    ); // Sepia tone for illustration
};

// Create: Create the defs or styles for the SVG to use
export const createDefsForSvg = (svg: D3SelectionSVGType) => {
  if (!svg || typeof svg.append !== "function") {
    console.error("Invalid SVG element passed to createDefsForSvg.");

    return;
  }

  // Create or select <defs> in the SVG
  const defs: D3SelectionDefsType = svg.select("defs").empty()
    ? svg.append("defs")
    : svg.select("defs");

  //    // Check if <defs> exists, if not, append it inside the SVG
  // let defs: D3SelectionDefsType = svg.select("defs");

  // if (defs.empty()) {
  //   defs = svg.append("defs"); // Append <defs> if not already present
  // }
  appendDropShadowFilter(defs);
  appendGlassMorphismFilter(defs);
  appendColorFilter(defs);
};
