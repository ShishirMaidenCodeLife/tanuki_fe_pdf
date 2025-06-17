"use client";

import "@xyflow/react/dist/style.css";

import * as XYFlow from "@xyflow/react";
import clsx from "clsx";
import * as React from "react";

import * as C from "@/components";
import * as H from "@/hooks";
import { useMindMapStore } from "@/stores/useMindMapStore";
import * as _h from "@/utils/pages/route-templates/view/hooks";
import { checkIfParent } from "@/utils/pages/route-templates/view/utils";

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <C.HappyPineappleSpinner data-testid="happy-pineapple-spinner" />
);

// Markdown editor section component
const MarkdownEditorSection: React.FC<{
  isMounted: boolean;
}> = ({ isMounted }) => (
  <section
    className={clsx(
      "custom-md-editor",
      "_apply_uiw_md_editor_width grid place-items-center relative bg-transparent",
      "!absolute left-0 !z-plus_100",
    )}
    data-testid="custom-md-editor"
  >
    {!isMounted ? (
      <C.CommonSkeleton
        imageMdEditor
        extendCss="mt-[32px]"
        height="h-[calc(100vh-4rem-32px)] max-h-[calc(100vh-4rem-32px)]"
        imageSize="w-40 h-40"
      />
    ) : (
      <C.UiwMdEditor />
    )}
  </section>
);

// Route diagram header component
const RouteDiagramHeader: React.FC<{
  currentHeading: string;
  isMounted: boolean;
}> = ({ currentHeading, isMounted }) => (
  <div className="grid place-items-center">
    {!isMounted ? (
      <C.CommonSkeleton
        extendCss="absolute top-0 left-1/2 -translate-x-1/2"
        height="h-10"
        width="w-72 max-w-72"
      />
    ) : (
      <C.CustomTooltip
        className={clsx(
          "absolute top-0 left-1/2 -translate-x-1/2",
          "max-w-72 h-10 text-xl font-bold tracking-wider px-4 py-1.5 rounded-xl",
          "font-fredoka bg-overlay30 transition",
          "overflow-hidden text-ellipsis whitespace-nowrap",
          "text-highlight-hover",
        )}
        maxLength={20}
        title={currentHeading}
      />
    )}
  </div>
);

// React Flow diagram component
const ReactFlowDiagram: React.FC<{
  flowProps: any;
  isMounted: boolean;
}> = ({ flowProps, isMounted }) => (
  <div className="w-full h-full overflow-hidden">
    {!isMounted ? (
      <div className="w-full h-full relative grid place-items-center">
        <div className="w-40 h-40 rounded-lg">
          <C.CommonSkeleton colorTransparent imageRoute imageSize="w-40 h-40" />
        </div>
      </div>
    ) : (
      <XYFlow.ReactFlow className="!z-10" {...flowProps}>
        <XYFlow.Controls />
      </XYFlow.ReactFlow>
    )}
  </div>
);

// Route diagram section component
const RouteDiagramSection: React.FC<{
  currentHeading: string;
  flowProps: any;
  isMounted: boolean;
}> = ({ currentHeading, flowProps, isMounted }) => (
  <section
    className={clsx("route-svg-diagram", "flex-1 relative w-full")}
    data-testid="route-svg-diagram"
  >
    <RouteDiagramHeader currentHeading={currentHeading} isMounted={isMounted} />
    <ReactFlowDiagram flowProps={flowProps} isMounted={isMounted} />
  </section>
);

// Main component
export const RouteTemplateViewPageClient = () => {
  // Component types
  const nodeTypes = { custom: C.CHNode as any };
  const edgeTypes = { customListItem: C.CHChildEdge } as any;

  // Custom hooks
  const isMounted = H.useCheckMountedHook();
  const { md, isError, isFetching, isLoading } = _h.useRouteTemplateData();

  // Get the canReorder state to control React Flow panning and nodesDraggable to control node dragging
  const {
    canReorder,
    nodesDraggable,
    activeChildId,
    activeParentId,
    isUpdatingMdAfterReorder,
    setIsUpdatingMdAfterReorder,
  } = useMindMapStore();

  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    currentHeading,
  } = _h.useReactFlowData(md);

  const displayNodes = _h.useNodePositioning(nodes);

  const {
    onNodeDragStart,
    onNodeDragStop,
    onItemDelete,
    handleNodeItemClick,
    handlePaneClick,
    setMd,
  } = _h.useNodeHandlers(nodes, setNodes, setEdges, currentHeading);

  // Recreate child node after reordering if activeChildId exists but no child node is present
  const recreateChildRef = React.useRef(false);

  React.useEffect(() => {
    if (
      activeChildId &&
      activeParentId &&
      nodes.length > 0 &&
      !recreateChildRef.current &&
      !isUpdatingMdAfterReorder // Don't recreate child during MD update
    ) {
      const hasChildNode = nodes.some(
        (node) => checkIfParent(node.id) === false,
      );

      if (!hasChildNode) {
        // Child node is missing, recreate it
        recreateChildRef.current = true;
        setTimeout(() => {
          handleNodeItemClick(activeChildId, activeParentId);
          recreateChildRef.current = false;
        }, 100);
      }
    }
  }, [
    activeChildId,
    activeParentId,
    nodes.length,
    handleNodeItemClick,
    isUpdatingMdAfterReorder,
  ]);

  // Set default child on first load (safe, no infinite loop)
  const hasSetDefaultRef = React.useRef(false);

  React.useEffect(() => {
    if (nodes.length > 0 && !hasSetDefaultRef.current) {
      const firstParent = nodes.find((node) => checkIfParent(node.id));

      if (
        firstParent &&
        firstParent.data.items &&
        firstParent.data.items.length > 0
      ) {
        const firstItem = firstParent.data.items[0];

        if (firstItem && firstItem.items && firstItem.items.length > 0) {
          hasSetDefaultRef.current = true; // Prevent running again
          handleNodeItemClick(firstItem.id, firstParent.id);
        }
      }
    }
  }, [nodes.length, handleNodeItemClick]); // Safe dependencies

  const nodesWithHandlers = _h.useNodesWithHandlers(
    displayNodes,
    setNodes,
    onItemDelete,
    handleNodeItemClick,
    currentHeading,
    setMd,
    setIsUpdatingMdAfterReorder,
  );

  // Flow configuration
  const flowProps = React.useMemo(
    () => ({
      edgeTypes,
      edges,
      fitView: true,
      maxZoom: 1.1,
      minZoom: 0.1,
      nodeTypes,
      nodes: nodesWithHandlers,
      nodesConnectable: false,
      nodesDraggable: !canReorder, // Disable React Flow node dragging when items are being reordered
      panOnDrag: canReorder ? false : [0, 1, 2, 3, 4], // Disable panning when items are being reordered
      onEdgesChange,
      onNodeDragStart,
      onNodeDragStop,
      onNodesChange,
      onPaneClick: handlePaneClick,
    }),
    [
      edgeTypes,
      edges,
      nodeTypes,
      nodesWithHandlers,
      canReorder,
      nodesDraggable, // Add nodesDraggable to dependencies
      onEdgesChange,
      onNodeDragStart,
      onNodeDragStop,
      onNodesChange,
      handlePaneClick,
    ],
  );

  // Loading state
  if (isLoading || isFetching) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (isError) {
    throw new Error("Failed to load route template as it does not exist.");
  }

  console.log("flowProps", flowProps);

  return (
    <C.PageContainer
      isMaxWidth
      data-testid="route-templates-page"
      extendCss={clsx("route-templates-page", "flex w-full apply_height")}
    >
      <MarkdownEditorSection isMounted={isMounted} />

      <RouteDiagramSection
        currentHeading={currentHeading}
        flowProps={flowProps}
        isMounted={isMounted}
      />
    </C.PageContainer>
  );
};
