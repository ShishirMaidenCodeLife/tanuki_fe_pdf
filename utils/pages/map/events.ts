// Import: node_modules
import * as d3 from "d3";

import { siteImages } from "../../../data/custom/site";

import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleTooltipHover } from "@/utils/methods/d3";
import * as c from "@/utils/pages/map/constants";
import * as _data from "@/utils/pages/map/data";
import * as _donuts from "@/utils/pages/map/donuts";
import * as _ids from "@/utils/pages/map/ids";
import * as images from "@/utils/pages/map/images";
import * as _styles from "@/utils/pages/map/styles";
import * as _svg from "@/utils/pages/map/svg";
import * as _texts from "@/utils/pages/map/texts";
import * as _utils from "@/utils/pages/map/utils";
import { handleCustomToast } from "@/utils/methods/style";
import { debounce, throttleRAF } from "@/utils/methods/perf";
import {
  D3SelectionAllType,
  DefaultType,
  RoadmapCustomNodeType,
  RoadmapTitleType,
  RoadmapStoreType,
  UseQueryRoadmapHookType,
} from "@/types";
import { RoadmapCustomEdgeType, TextOffsetType } from "@/types";

export const handleMapTooltip = (
  show: boolean,
  event: MouseEvent,
  d: d3.PieArcDatum<RoadmapTitleType> | RoadmapCustomNodeType,
) => {
  const { param, name } = d?.data || {};
  const isGrandparent = d?.data?.group === "grandparent";
  // const offsetX = (isGrandparent ? 0 : 6) + TOOLTIP_XOFFSET;
  // const offsetY = (isGrandparent ? 0 : -12) + TOOLTIP_YOFFSET;
  const label = isGrandparent ? param : name;
  // const nonParamOffsetY = param ? 0 : -12;

  handleTooltipHover(show, event, label);
};

// Event: Handle donut group text click
export const handleDonutGroupTextClick = (
  d: d3.PieArcDatum<RoadmapTitleType>,
) => {
  // Select: Get the corresponding arc using the ID
  const arcPath = d3.select(_ids.getDonutPathId(d, true));

  // Event: Trigger the click event of the arc
  arcPath.dispatch("click");
};

// Event: Handle node hover
export const handleNodeHover = (params: {
  currentNode: RoadmapCustomNodeType;
  d: d3.PieArcDatum<RoadmapTitleType>;
  root: RoadmapCustomNodeType;
  treeGroup?: DefaultType;
  show: boolean;
  showTextSkeleton?: boolean;
}) => {
  // Variable: Destructure the parameters
  const { currentNode, d, treeGroup, root, show = false } = params;

  // Select all nodes related to the node, including ancestors
  const nodeAncestors = currentNode.ancestors();
  // const nodeDescendants = currentNode.descendants();

  // Variable: Get all links related to the current node and its related nodes
  const relatedLinks = root.links().filter((link: RoadmapCustomEdgeType) => {
    const isCurrentNodeLink = _utils.isLinkRelatedToNode(link, currentNode);
    const isRelatedAncestorLink = nodeAncestors.some(
      (ancestor: RoadmapCustomNodeType) =>
        _utils.isLinkRelatedToNode(link, ancestor, true),
    );

    return isCurrentNodeLink || isRelatedAncestorLink;
  });

  // Variable: Get the related nodes from the related links
  const relatedNodes = Array.from(
    new Map(
      relatedLinks
        .flatMap((rl: RoadmapCustomEdgeType) => [rl.source, rl.target])
        .map((node: RoadmapCustomNodeType) => [node.data.uuid, node]),
    ).values(),
  );

  // console.log("relatedNodes", relatedNodes);
  // Highlight the node related nodes
  treeGroup
    .selectAll(".node")
    .filter((d: RoadmapCustomNodeType) =>
      relatedNodes?.some(
        (node: RoadmapCustomNodeType) => node?.data?.uuid === d?.data?.uuid,
      ),
    )
    .style(
      "opacity",
      (d: RoadmapCustomNodeType) => _styles.adjustOpacityHover(show, d),
      // show ? 1 : undefined,
    );

  // Highlight the node related links
  (treeGroup as DefaultType)
    .selectAll(".link")
    .filter((link: unknown) =>
      relatedLinks.some(
        (rl: RoadmapCustomEdgeType) =>
          rl.source === (link as RoadmapCustomEdgeType).source &&
          rl.target === (link as RoadmapCustomEdgeType).target,
      ),
    )
    .transition()
    .duration(200)
    .attr("stroke", (insideEdge: DefaultType) =>
      show
        ? d?.data?.color
        : (insideEdge as RoadmapCustomEdgeType)?.randomColor || null,
    )
    .attr(
      "opacity",
      // (d: RoadmapCustomNodeType) => _styles.adjustOpacityHover(show, d?.target, showTextSkeleton)
      show ? 1 : 0.5,
    )
    .style(
      "visibility",
      function (this: SVGElement) {
        const zoomedVisible = d3.select(this).attr("visibility");

        // If the link is already visible, return visible
        if (zoomedVisible === "visible") return "visible";

        // If the link is highlighted, calculate visibility
        return show ? "visible" : "hidden";
        // return _styles.adjustVisibility(show || link.target.isHighlighted);
      },
      // show ? "visible" : "hidden"
    )
    .attr(
      "stroke-width",
      show ? c.STROKE_WIDTH_HOVERED : c.STROKE_WIDTH_DEFAULT,
    );

  // Highlight the node related nodes
  treeGroup
    .selectAll(".node circle")
    .filter((node: unknown) =>
      nodeAncestors.includes(node as RoadmapCustomNodeType),
    )
    .transition()
    .duration(200)
    .attr("class", "bg-background")
    .style("fill", (d: RoadmapCustomNodeType) => d?.parentColor || null)
    .attr("r", (d: RoadmapCustomNodeType) =>
      _styles.adjustNodeCircleHover(show, d),
    );

  // Highlight the node label as well
  treeGroup
    .selectAll(".node text")
    .filter((node: RoadmapCustomNodeType) => node === currentNode)
    .attr("class", (d: RoadmapCustomNodeType) =>
      _styles.adjustColorClass(d, show),
    )
    .attr("text-decoration", (d: RoadmapCustomNodeType) =>
      show && !d?.isLastDepth ? "underline" : "none",
    )
    .style("fill", (d: RoadmapCustomNodeType) =>
      !show || d?.isFirstParent ? "currentColor" : d.parentColor,
    );
};

// Event: Handle segment click
export const handleSegmentClick = (
  d: d3.PieArcDatum<RoadmapTitleType>,
  segmentElement: D3SelectionAllType,
  selectedGroups: RoadmapStoreType["selectedGroups"],
  toggleSelectedGroups: RoadmapStoreType["toggleSelectedGroups"],
) => {
  // Variables: Destucture the parameters
  const { arc, enlargedArc } = _donuts.getDonutComponents();

  // Variable: Destructure the data
  const { param } = d?.data || {};

  // Toggle the selected groups based on the clicked segment
  toggleSelectedGroups(param || "");

  // Animation: Transition the clicked segment to the enlarged arc
  segmentElement
    .transition() // Apply transition on click
    .duration(500)
    .attr("d", function (d: DefaultType) {
      return selectedGroups.includes(d?.data?.param) ? enlargedArc(d) : arc(d); // Enlarged arc for selected segments
    });
};

// Collapse all the children of a node
const collapseChildren = (
  node: RoadmapCustomNodeType | undefined,
  show: boolean,
) => {
  if (!node?.children || !Array.isArray(node.children)) return; // Ensure children exist and are an array

  node.children.forEach((child: RoadmapCustomNodeType) => {
    child.collapsed = show; // Collapse the child
    collapseChildren(child, show); // Recursively collapse grandchildren
  });
};

// Toggle the collapse state of a node
export const toggleNodeCollapse = (currentNode: RoadmapCustomNodeType) => {
  // Get ancestors and filter out first parent
  const ancestors = currentNode
    .ancestors()
    ?.filter((node: RoadmapCustomNodeType) => !node.isFirstParent);
  const descendants = currentNode.descendants();

  // Determine if the current node is expanding
  const isExpanding = !currentNode.collapsed;

  // Toggle the collapsed state of the current node
  currentNode.collapsed = isExpanding;

  // Collapse all ancestors
  if (isExpanding) {
    ancestors.forEach((ancestor) => collapseChildren(ancestor, true));
  }

  // Collapse all descendants
  descendants.forEach((descendant) => collapseChildren(descendant, true));
};

// Update the highlight state of a node
export const adjustNodeHighlight = (currentNode: RoadmapCustomNodeType) => {
  // Boundary Ensure currentNode is valid
  if (!currentNode) return;

  // Variable: Destucture the currentNode data
  const { data, isHighlighted = false, collapsed } = currentNode;

  // Toggle the highlight state of the current node
  currentNode.isHighlighted = !isHighlighted;

  // Variables: Get the ancestors and descendants of the current node
  const ancestors = currentNode.ancestors();
  const descendants = currentNode.descendants();

  // Workings for ancestors/descendants if the node has been clicked for the 1st time (to add)
  if (collapsed) {
    // Debug: Show the collapsed state
    // console.log("log", "COLLAPSED");

    // Workings for ancestors
    ancestors.forEach((ancestor: RoadmapCustomNodeType) => {
      // This will highlight the current node as well as its previous parents
      // So I do not need to highlight like this: descendant.isHighlighted = true in next section
      ancestor.isHighlighted = true;

      // If the current node is the same as the ancestor node and it has children
      if (data?.uuid === ancestor?.data?.uuid && ancestor?.children) {
        ancestor.children.forEach((child: RoadmapCustomNodeType) => {
          child.isHighlighted = true;
        });
      }
    });

    // Workings for descendants
    descendants.forEach((descendant: RoadmapCustomNodeType) => {
      if (data?.uuid === descendant?.data?.uuid && descendant?.children) {
        descendant.children.forEach((child: RoadmapCustomNodeType) => {
          child.isHighlighted = true;
          child.collapsed = false;
        });
      }
    });
  }
  // Workings for ancestors/descendants if the node has been clicked for the 2nd time (to remove)
  else {
    // Debug: Show the collapsed state
    // console.log("log", "NOT COLLAPSED");

    // Workings for ancestors
    ancestors.forEach((ancestor: RoadmapCustomNodeType) => {
      if (data?.uuid === ancestor?.data?.uuid && ancestor?.children) {
        ancestor.isHighlighted = false;
        ancestor.children.forEach((child: RoadmapCustomNodeType) => {
          child.isHighlighted = false;
        });
      }
    });

    const updateDescendantHighlight = (
      node: RoadmapCustomNodeType,
      highlight: boolean,
    ) => {
      // Base case: If no node is provided, exit the recursion
      if (!node) return;

      // Update the current node's highlight state
      node.isHighlighted = highlight;
      node.collapsed = false;

      // Recursively update children if they exist
      if (node.children && node.children.length > 0) {
        node.children.forEach((child: RoadmapCustomNodeType) => {
          updateDescendantHighlight(child, highlight);
        });
      }
    };

    // Example usage within the loop
    descendants.forEach((descendant: RoadmapCustomNodeType) => {
      if (data?.uuid === descendant?.data?.uuid) {
        // descendant.isHighlighted = true;
        updateDescendantHighlight(descendant, false); // Set highlight to `false`
      }
    });
  }
};

// Focus on a node
export const focusNode = (params: {
  currentNode: RoadmapCustomNodeType;
  roadmapQueries: UseQueryRoadmapHookType;
  roadmapStore: RoadmapStoreType;
  quadrantFlags: RoadmapCustomNodeType["quadrantFlags"];
}) => {
  // Variable: Destrucutre the parameters
  const { currentNode, roadmapQueries, roadmapStore, quadrantFlags } = params;

  // Variable: Destructure the roadmapStore
  const svg: D3SelectionAllType = d3.select(`.${c.MAP_PAGE_CLASS_SVG}`);
  const width = svg.node()?.clientWidth || c.SVG_WIDTH_DEFAULT;
  const height = svg.node()?.clientHeight || c.SVG_HEIGHT_DEFAULT;
  // Variable: Initialize and declare the required variables
  let x = 0;
  let y = 0;
  const { x: cx = 0, y: cy = 0, depth = 0 } = currentNode ?? {};

  // } else if (isTopRight) {
  //   offsetX = -currentX * k;
  //   offsetY = 125 + currentY * k;
  // } else if (isBottomLeft) {
  //   offsetX = currentX * k + 250;
  //   offsetY = -currentY * k - 250;
  // } else if (isBottomRight) {
  //   offsetX = currentX * k - 100;
  //   offsetY = -currentY * k - 250;
  // } else if (isMidLeft) {
  //   offsetX = currentX * k + 425;
  //   offsetY = currentY * k - 80;
  // } else if (isMidRight) {
  //   offsetX = currentX * k - 150;
  //   offsetY = currentY * k + 125;
  // }

  if (quadrantFlags?.isTopLeft) {
    x =
      -cx +
      width / 2 +
      (cx === 0
        ? width - 0.9 * c.DONUT_CENTRAL_RADIUS
        : (cx < 0 ? -1 : 1) * cx) /
        5;
    y = cy + (cy === 0 ? height / 2 + 160 : height / 2 + 220);
  } else if (quadrantFlags?.isTopRight) {
    x =
      -cx +
      width / 2 +
      (cx === 0 ? -width / 2 + c.DONUT_CENTRAL_RADIUS / 2 : 0);
    y = cy + (cy === 0 ? height / 2 + 160 : height / 2 + 220);
  } else if (quadrantFlags?.isMidLeft) {
    x = width + (cy === 0 ? -115 : (cy / 160 || 1) * 140);
    y = cx + height / 2;
  } else if (quadrantFlags?.isMidRight) {
    x = cy === 0 ? 115 : (cy / 200 || 1) * -180;
    y = -cx + height / 2;
  } else if (quadrantFlags?.isBottomLeft) {
    x =
      cx +
      width / 2 +
      (cx === 0
        ? width - 0.9 * c.DONUT_CENTRAL_RADIUS
        : (cx < 0 ? -1 : 1) * cx) /
        6;
    y = cy + (cy === 0 ? 115 : -height * (depth || 1) * 0.6);
  } else if (quadrantFlags?.isBottomRight) {
    x =
      cx + width / 2 + (cx === 0 ? -width / 2 + c.DONUT_CENTRAL_RADIUS / 2 : 0);
    y = cy + (cy === 0 ? 115 : -height * (depth || 1) * 0.6);
  }

  handleZoom({
    action: "focus",
    roadmapStore,
    x,
    y,
    roadmapQueries,
  });
};

// Create the tree structure
export const updateTree = (params: {
  d: d3.PieArcDatum<RoadmapTitleType>;
  group: D3SelectionAllType;
  roadmapQueries: UseQueryRoadmapHookType;
  root: RoadmapCustomNodeType;
  roadmapStore: RoadmapStoreType;
  quadrantFlags: RoadmapCustomNodeType["quadrantFlags"];
}) => {
  // Variable: Destructure the parameters
  const {
    d,
    group,
    roadmapQueries,
    root,
    roadmapStore,
    quadrantFlags = c.INITIAL_QUADRANT_FLAGS,
  } = params;

  // Variable: Destructure tidy page store
  const { tidyPageSvgTransform } = roadmapStore;
  const svg: D3SelectionAllType = d3.select(`.${c.MAP_PAGE_CLASS_SVG}`);
  const width = svg.node()?.clientWidth || c.SVG_WIDTH_DEFAULT;
  const { k: zoomLevel } = tidyPageSvgTransform;
  const showTextSkeleton = zoomLevel <= c.ZOOM_SCALE_SKELETON_MINIMUM;

  // Variable: Get the nodes and lin\ks for the tree structure
  const nodes = root.descendants();
  const links = root.links();

  // Add a flag to check if the node is the last depth
  nodes.forEach((node: RoadmapCustomNodeType) => {
    node.isFirstParent = _utils.checkIfFirstParentNode(node, d);
    node.isLastDepth = _utils.checkIfLastDepthNode(node);
    node.parentColor = d?.data?.color;
    node.quadrantFlags = {
      ...c.INITIAL_QUADRANT_FLAGS, // Ensures all properties are initialized with `false`
      ...Object.entries(quadrantFlags).reduce(
        (acc: Record<string, boolean>, [key, value]) => {
          if (value) {
            acc[key as keyof RoadmapCustomNodeType["quadrantFlags"]] = true;
          }

          return acc;
        },
        { ...c.INITIAL_QUADRANT_FLAGS } as Record<
          keyof RoadmapCustomNodeType["quadrantFlags"],
          boolean
        >,
      ),
    };
  });

  // Add random colors to the links
  links.forEach((link: RoadmapCustomEdgeType, index: number) => {
    link.randomColor = _styles.getColorByIndex(index);
  });

  const dx = quadrantFlags?.isVertical ? c.OFFSET_TREE_Y : c.OFFSET_TREE_X;
  const dy = width / (root.height + 1);
  const tree = d3.tree().nodeSize([dx, dy]);

  tree(root as d3.HierarchyPointNode<DefaultType>);
  // const newNodesRoot = _data.updateNodesRoot(nodesRoot, root);

  // Variable: Get the group by creating new or selecting if it already exists
  let treeGroup: D3SelectionAllType = group.select("g.tree-group");

  if (treeGroup.empty())
    treeGroup = group.append("g").attr("class", "tree-group");

  // Variable: Restructure the parameters for hover events
  const hoverParams = { d, root, roadmapStore, treeGroup };

  // Create or Update links
  const link: D3SelectionAllType = treeGroup
    .selectAll(".link")
    .data(links, (link: unknown) =>
      _ids.getLinkId(link as RoadmapCustomEdgeType),
    );

  // Add new links and set their attributes
  link
    .enter()
    .append("path")
    .attr("id", (link: RoadmapCustomEdgeType) => _ids.getLinkId(link))
    .attr("class", "link")
    .attr("fill", "none")
    .attr("d", (link: RoadmapCustomEdgeType) =>
      d3
        .linkHorizontal<RoadmapCustomEdgeType, RoadmapCustomNodeType>()
        .x((node) => node.y || 0)
        .y((node) => node.x || 0)(link),
    )
    .merge(link)
    .attr("opacity", (link: RoadmapCustomEdgeType) =>
      _styles.adjustOpacity(link.target, showTextSkeleton),
    )
    .attr("visibility", (link: RoadmapCustomEdgeType) =>
      _styles.adjustVisibility(link?.target?.isHighlighted),
    )
    .attr("stroke", (link: RoadmapCustomEdgeType) => link?.randomColor || null)
    .attr("stroke-width", c.STROKE_WIDTH_DEFAULT);

  // Remove links that no longer exist
  link.exit().remove();

  // Variable: Select all nodes and bind the data
  const node: D3SelectionAllType = treeGroup
    .selectAll(".node")
    .data(nodes, (d: unknown) => _ids.getNodeId(d as RoadmapCustomNodeType));
  // Cache: Debounce the update tree function
  const debouncedUpdateTree = debounce(updateTree, 200);

  // Create: Add groups for each node
  const nodeEnter: D3SelectionAllType = node
    .enter()
    .append("g")
    .attr("id", (d: RoadmapCustomNodeType) => _ids.getNodeId(d))
    .attr("class", "node")
    .attr("transform", (d: RoadmapCustomNodeType) => `translate(${d.y},${d.x})`)
    .attr("cursor", "pointer")
    .attr("opacity", (d: RoadmapCustomNodeType) => _styles.adjustOpacity(d))
    .on("click", (_: MouseEvent, currentNode: RoadmapCustomNodeType) => {
      focusNode({
        currentNode,
        roadmapQueries,
        // roadmapData,
        roadmapStore,
        quadrantFlags,
      });
      toggleNodeCollapse(currentNode);
      adjustNodeHighlight(currentNode);
      debouncedUpdateTree(params); // debouncedUpdateTree({ ...params, nodesRoot: newNodesRoot });
    })
    .on(
      "mousemove",
      (event: MouseEvent, currentNode: RoadmapCustomNodeType) => {
        handleNodeHover({ ...hoverParams, currentNode, show: true });
        handleMapTooltip(true, event, currentNode);
      },
    )
    .on("mouseout", (event: MouseEvent, currentNode: RoadmapCustomNodeType) => {
      handleNodeHover({ ...hoverParams, currentNode, show: false });
      handleMapTooltip(false, event, currentNode);
    });

  // Merge existing nodes (those already in the DOM) and newly appended nodes
  node
    .merge(nodeEnter) // Merge updates to newly appended and existing nodes
    .attr("opacity", (d: RoadmapCustomNodeType) => _styles.adjustOpacity(d))
    .attr(
      "transform",
      (d: RoadmapCustomNodeType) =>
        _texts.getTextRotation(quadrantFlags, d)?.transform,
    );
  // Create: Append images and texts
  images.appendNodeImage({
    node,
    nodeEnter,
    roadmapStore,
    quadrantFlags,
  });
  const t = { nodeEnter, quadrantFlags };

  _texts.appendNodeText(t);
  node.exit().remove();
};

// Debounced version of getZoomedNodes
export const debouncedGetZoomedNodes = debounce(
  (event, nodesRoot) => {
    _utils.getZoomedNodes(event, nodesRoot);
  },
  c.DEBOUNCE_TIME_DEFAULT, // Delay in milliseconds (adjust based on performance needs)
  // { leading: false, trailing: true } // Only execute after the debounce period
);

export const toggleSkeletonView = (params: {
  show: boolean;
  nodesRoot: RoadmapCustomNodeType[];
}) => {
  const { show, nodesRoot } = params;
  const svg: D3SelectionAllType = d3.select(`.${c.MAP_PAGE_CLASS_SVG}`);

  // Efficiently remove existing card if it exists
  d3.selectAll(".first-node-card").attr(
    "visibility",
    !show ? "visible" : "hidden",
  );

  // Extract only the nodes from nodesRoot
  const { nodes, links } = _data.getNodesAndLinks(nodesRoot) ?? {};

  // Function to update or create rectangle element
  const updateRectangle = (
    rectElement: D3SelectionAllType,
    attrs: TextOffsetType,
  ) => {
    rectElement
      .attr("width", attrs.width)
      .attr("height", attrs.height)
      .attr("x", attrs.offsetX || 0)
      .attr("y", (attrs.y || 0) + (attrs.offsetY || 0))
      .attr("dx", attrs.x || 0)
      .style("visibility", show ? "visible" : "hidden");
  };

  // Function to append images (first and second) with filters, only when needed
  const appendImagesIfNeeded = (
    element: D3SelectionAllType,
    attrs: TextOffsetType,
  ) => {
    const { offsetX = 0, y = 0, width = 0, height = 0, filterId } = attrs;
    const clipId = "clip-top-part";

    // Only create the clip path once
    let clipPath: D3SelectionAllType = element.select(`#${clipId}`);

    if (clipPath.empty()) {
      clipPath = element
        .append("defs")
        .append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("x", offsetX)
        .attr("y", y)
        .attr("width", width / 1.5)
        .attr("height", height / 1.5 / 2);
    }

    // Check if images are already present; append if not
    let firstImage: D3SelectionAllType = element.select("image.first-image");
    let secondImage: D3SelectionAllType = element.select("image.child-image");

    // If images are missing, append them
    if (firstImage.empty() || secondImage.empty()) {
      // Append the first image
      firstImage = element
        .append("image")
        .attr("class", "first-image")
        .attr("href", siteImages.svg.pineapple.squareFilled) // Default image
        .attr("width", width / 1.2)
        .attr("height", height / 1.2)
        .style("filter", `url(#${filterId})`)
        .attr("x", offsetX + width / 2 - width / (2 * 1.2))
        .attr("y", y + height / 2 - height / (2 * 1.2))
        .attr("preserveAspectRatio", "xMidYMid slice");

      // Append the second image
      secondImage = element
        .append("image")
        .attr("class", "child-image")
        .attr("href", siteImages.svg.pineapple.squareFilled) // Default image
        .attr("width", width / 2)
        .attr("height", height / 2)
        .attr("x", offsetX + width / 2 - width / (2 * 2))
        .attr("y", y + height / 2 - height / (2 * 2) + height / (8 * 2))
        .attr("preserveAspectRatio", "xMidYMid slice");
    }

    // Update visibility based on `show`
    const visibility = show ? "visible" : "hidden";

    firstImage.style("visibility", visibility);
    secondImage.style("visibility", visibility);
  };

  // Loop through all nodes to update their elements
  nodes.forEach((node: RoadmapCustomNodeType) => {
    const element = d3.select(`#${_ids.getNodeId(node)}`);

    // Early return if element is empty or ID is falsy
    if (element.empty()) return;

    // Cache all sub-elements
    const textElement = element.select("text");
    const rectElement = element.select("rect.skeleton-text");
    const firstImage = element.select("image.first-image");
    const secondImage = element.select("image.child-image");

    // Set visibility based on 'show' flag
    if (!show) {
      // Hide skeleton, show text
      textElement.style("visibility", "visible");
      rectElement.style("visibility", "hidden");
      firstImage.style("visibility", "hidden");
      secondImage.style("visibility", "hidden");

      // Hide all the links
      links?.forEach((link: RoadmapCustomEdgeType) => {
        const linkId = _ids.getLinkId(link);

        _utils.toggleLinkVisible(linkId, false);
      });

      return; // Exit early if `show` is false
    }

    // Hide original text and show skeleton
    textElement.style("visibility", "hidden");
    const attrs: TextOffsetType = _texts.getSkeletonTextOffset({ d: node });

    // Update rectangle (append only if it doesn't exist)
    if (rectElement.empty()) {
      // Append only if the rectangle is not present
      element
        .append("rect")
        .attr("class", "skeleton-text text-skeleton")
        .attr("rx", attrs.rx || 0)
        .attr("ry", attrs.ry || 0)
        .attr("stroke", node?.parentColor || null)
        .attr("fill", "currentColor")
        .attr("width", attrs.width || 0)
        .attr("height", attrs.height || 0)
        .attr("x", attrs.offsetX || 0)
        .attr("y", attrs.offsetY || 0)
        .style("visibility", "visible");
    } else {
      // Update the existing rectangle's attributes
      updateRectangle(rectElement, attrs);
    }

    // Handle image elements only if needed
    if (attrs.isFirstParent) {
      const newAttrs = {
        ...attrs,
        filterId: _svg.createColorFilterIfNeeded(svg, node?.parentColor || ""),
      };

      appendImagesIfNeeded(element, newAttrs);
    }
  });
};

export const debouncedUpdateSkeleton = debounce(
  (params) => toggleSkeletonView(params),
  c.DEBOUNCE_TIME_DEFAULT,
);

// Event: Handle zoom events
export const handleZoom = (params: {
  action: string;
  roadmapQueries: UseQueryRoadmapHookType;
  roadmapStore: RoadmapStoreType;
  x?: number;
  y?: number;
}) => {
  // Variable: Destructure the parameters
  const { action, roadmapQueries, roadmapStore, x, y } = params;
  const { nodesRoot } = _data.createRoadmapData(roadmapQueries) ?? {};

  // Variable: Destructure the roadmapStore
  const {
    setCheckedNodes,
    setSelectedGroups,
    setTidyPageSvgTransform,
    tidyPageSvgTransform,
  } = roadmapStore ?? {};

  // Exit: If the required parameters are not available, exit
  const svg: D3SelectionAllType = d3.select(`.${c.MAP_PAGE_CLASS_SVG}`);
  const g: D3SelectionAllType = d3.select(`.${c.MAP_PAGE_CLASS_MAIN_GROUP}`);

  if (!svg) {
    console.log(
      "warn",
      "Missing required parameters: tidyPageSvgDetails or setsvgTransform.",
    );

    return;
  }

  // Variable: Destructure the tidyPageSvgDetails
  const width = svg.node()?.clientWidth || c.SVG_WIDTH_DEFAULT;
  const height = svg.node()?.clientHeight || c.SVG_HEIGHT_DEFAULT;

  // Create a center transform
  const centerTransform = ({
    k = c.ZOOM_SCALE_SVG_DEFAULT,
    overrideDefault = false,
    x = 0,
    y = 0,
  }: {
    k?: number;
    overrideDefault?: boolean;
    x?: number;
    y?: number;
  }) => {
    const tx = overrideDefault && x !== undefined ? x : width / 2;
    const ty = overrideDefault && y !== undefined ? y : height / 2;

    // return d3.zoomIdentity.translate(tx, ty).scale(k);

    // Enforce min/max zoom limits
    const clampedTransform = d3.zoomIdentity
      .translate(tx, ty)
      .scale(
        Math.max(
          c.ZOOM_SCALE_SVG_MINIMUM,
          Math.min(k, c.ZOOM_SCALE_SVG_MAXIMUM),
        ),
      );

    return clampedTransform;
  };

  // Apply transition
  const applyTransition = (transform: d3.ZoomTransform) => {
    if (action === "reset") {
      (d3.select("svg.svg") as D3SelectionAllType).call(
        zoomHandler.transform,
        transform,
      );
      // setTidyPageSvgTransform({ x: transform.x, y: transform.y, k: 1 });

      return;
    }
    svg
      .transition()
      .duration(c.ZOOM_TRANSITION_DURATION)
      .ease(c.ZOOM_EASING)
      .call(zoomHandler.transform, transform);
  };

  // const debouncedSetTransform = debounce((transform) => {
  //   setTidyPageSvgTransform(transform);
  // }, 100); // Debounce the state update to reduce frequency

  // Zoom Handler
  const zoomHandler = d3
    .zoom<SVGSVGElement, unknown>()
    // .scaleExtent([c.ZOOM_LEVEL_MINIMUM, c.ZOOM_LEVEL_MAXIMUM])
    .scaleExtent([c.ZOOM_SCALE_SVG_MINIMUM, c.ZOOM_SCALE_SVG_MAXIMUM])
    .on(
      "zoom",
      throttleRAF((event) => {
        const { x, y, k } = event.transform;

        if (!isNaN(k)) {
          let dynamicAction = "focus";

          if (x !== width / 2 || y !== height / 2) {
            dynamicAction = "pan";
          } else if (x === width / 2 && y === height / 2) {
            dynamicAction = k === 1 ? "reset" : "center";
          }

          if (_styles.isSkeletonText(k)) {
            debouncedUpdateSkeleton({ show: true, nodesRoot });
          }
          // And this only perform when zooming in not zooming out
          // else if (k > c.ZOOM_SCALE_SHOW_MINIMUM) {
          //   debouncedUpdateSkeleton({ show: false, nodesRoot });
          //   debouncedGetZoomedNodes(event, nodesRoot);
          // }
          setTidyPageSvgTransform({ x, y, k, action: dynamicAction });
        }

        // Apply the zoom transform to the <g> element
        g.attr("transform", event.transform);

        // Ensure text remains the same size regardless of zoom level
        // const isTargetZoom = k > c.ZOOM_SCALE_SKELETON_MINIMUM;
        // if (isTargetZoom)
        //   g.selectAll("text").style("transform", `scale(${1 / k})`);
        // else g.selectAll("text").style("transform", `scale(1)`);

        // Optionally scale text elements for better legibility
        // g.selectAll("text").style("transform", `scale(${1 / k})`);
      }),
    );

  svg.call(zoomHandler);

  // Action Handlers
  switch (action) {
    case "initialize":
      applyTransition(centerTransform({ overrideDefault: true }));
      break;

    case "center":
      applyTransition(centerTransform({ k: tidyPageSvgTransform?.k }));
      handleCustomToast(TOAST_MESSAGES.pages.map.centeredGraph);
      break;

    case "reset":
      setCheckedNodes([]);
      setSelectedGroups([]);
      applyTransition(centerTransform(c.SVG_TRANSFORM_DEFAULT));
      // on(
      //   "end",
      //   () => {
      //     svg
      //       .call(zoomHandler)
      //       .call(
      //         zoomHandler.transform,
      //         centerTransform(c.SVG_TRANSFORM_DEFAULT)
      //       );
      //   }
      // );
      handleCustomToast(TOAST_MESSAGES.pages.map.resetComplete);
      break;

    case "focus":
      applyTransition(centerTransform({ overrideDefault: true, x, y }));
      break;

    default:
      console.log("warn", `Unknown action: ${action}`);
  }
};
