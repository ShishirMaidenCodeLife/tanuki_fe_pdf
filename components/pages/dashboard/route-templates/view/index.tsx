"use client";

import "@xyflow/react/dist/style.css";

import * as XYFlow from "@xyflow/react";
import clsx from "clsx";
import * as React from "react";

import * as C from "@/components";
import * as H from "@/hooks";
import { useMindMapStore } from "@/stores/useMindMapStore";
import * as _t from "@/types/new-types";
import { TOAST_MESSAGES } from "@/utils/constants/messages";
import { handleCustomToast, handleErrorToast } from "@/utils/methods/style";
import * as _constants from "@/utils/pages/route-templates/view/constants";
import * as _c from "@/utils/pages/route-templates/view/constants";
import * as _h from "@/utils/pages/route-templates/view/events";
import * as _utils from "@/utils/pages/route-templates/view/utils";
import { RouteTemplateApiType } from "@/types";
import { prependMdHeaderIfAbsent } from "@/utils/pages/route-templates/view/data";

// Define custom node and edge types
// const nodeTypes: Record<
//   string,
//   React.ComponentType<XYFlow.NodeProps<CustomNodeType>>
// > = { custom: CustomNode };

export const RouteTemplateViewPageClient = () => {
  // Custom components
  const nodeTypes = { custom: C.CustomNode as any };
  const edgeTypes = { customListItem: C.CustomListItemEdge } as any;

  // Types and refs
  const draggedNode = React.useRef<_t.CustomNodeType | null>(null);
  const initialPositions = React.useRef<Map<string, _t.CustomPositionType>>(
    new Map(),
  );

  // Custom hooks
  const isMounted = H.useCheckMountedHook();
  const { setSelectedItemId } = useMindMapStore();

  // Custom hook with working of md data
  const { md, setMd } = H.useRoadmapStoreHook();
  const { getByUuidResponse } = H.useRouteTemplateApiService(["useGetByUuid"]);
  const { data, isError, isFetching, isLoading } = getByUuidResponse;
  const content = (data as RouteTemplateApiType)?.content;

  const { MD_NODES, MD_EDGES, currentHeading } = React.useMemo(() => {
    const { MD_NODES, MD_EDGES } = _utils.mdToNestedTree(md);

    const { currentHeading } = _utils.extractMdContent(md);

    return { MD_NODES, MD_EDGES, currentHeading };
  }, [md]);

  // Set initial nodes and edges from the MD data
  React.useEffect(() => {
    setNodes(MD_NODES);
    setEdges(MD_EDGES);
  }, [MD_NODES, MD_EDGES]);

  // Default hooks for XYFlow react-flow
  const [nodes, setNodes, onNodesChange] =
    XYFlow.useNodesState<_t.CustomNodeType>(MD_NODES);
  const [edges, setEdges, onEdgesChange] =
    XYFlow.useEdgesState<_t.CustomEdgeType>(MD_EDGES);

  // Get the initial data from the store
  // console.log("MD_NODES", MD_NODES);
  // console.log("MD_EDGES", MD_EDGES);
  // console.log("rf", rf);

  // const selectedParent = React.useRef<string | null>(null);
  // const selectedItem = React.useRef<string | null>(null);
  // const didSetInitialZoom = React.useRef(false);
  // const previousNodesRef = React.useRef<CustomNodeType[]>(nodes);

  // Debugging logs
  // console.log("Udip nodes", nodes);

  const updatedChildNode = nodes.find(
    (n: _t.CustomNodeType) => !_utils.checkIfParent(n.id),
  );

  const displayNodes = nodes.map((n: _t.CustomNodeType) => {
    if (n.id === updatedChildNode?.id) {
      const childIndex = _utils.getChildIdxFromId(n.id);
      const verticalOffset = (childIndex - 1) * _c.CHILD_VERTICAL_SPACING;

      return {
        ...n,
        position: {
          ...n.position,
          y: n.position.y + verticalOffset,
        },
      };
    }

    return n;
  });

  // Handle drag start
  const onNodeDragStart = React.useCallback(
    (event: React.MouseEvent, node: _t.CustomNodeType) => {
      // Store current node in ref for drag tracking
      draggedNode.current = node;
      initialPositions.current.set(node.id, node.position);
    },
    [],
  );

  // Main onNodeDragStop callback
  const onNodeDragStop = React.useCallback(
    (_: React.MouseEvent, node: _t.CustomNodeType): void => {
      try {
        // Early return if no drag occurred
        if (!draggedNode.current) return;

        // Variables
        const otherNodes = nodes.filter((n) => n.id !== node.id);
        const overlappingNode = otherNodes.find((otherNode) =>
          _utils.areNodesOverlapping(node, otherNode),
        );
        const draggedId = node.id;
        const draggedInitialPos = initialPositions.current.get(draggedId);

        // If there's no overlapping node or no initial position, reset position
        if (!overlappingNode || !draggedInitialPos) {
          _h.resetDragBehavior(
            TOAST_MESSAGES.pages.displayRoute.drag.notCloseEnough,
            draggedNode,
            initialPositions,
            setNodes,
          );

          return;
        }

        // Variables
        const targetId = overlappingNode.id;
        const areDifferentGroups =
          _utils.checkIfParent(targetId) !== _utils.checkIfParent(draggedId);

        // Check if nodes are from the same group
        if (areDifferentGroups) {
          _h.resetDragBehavior(
            TOAST_MESSAGES.pages.displayRoute.drag.differentGroup,
            draggedNode,
            initialPositions,
            setNodes,
          );

          return;
        }

        // Clear selection
        setSelectedItemId(null);

        // Update node positions using helper function
        setNodes(
          _h.updateNodePositions(
            draggedId,
            targetId,
            draggedInitialPos,
            overlappingNode.position,
          ),
        );

        // Update edge connections using helper function
        setEdges(_h.updateEdgeConnections(node, overlappingNode, nodes));

        // Update initial positions for next drag
        initialPositions.current.set(node.id, overlappingNode.position);
        const overlappingInitialPos = initialPositions.current.get(targetId);

        if (overlappingInitialPos)
          initialPositions.current.set(overlappingNode.id, draggedInitialPos);

        handleCustomToast(TOAST_MESSAGES.pages.displayRoute.drag.success);
      } catch (error) {
        console.error("Error in onNodeDragStop:", error);
        handleErrorToast({ message: "Failed to update node positions" });
      } finally {
        draggedNode.current = null; // Always clean up the dragged node reference
      }
    },
    [nodes, setNodes, setEdges, setSelectedItemId],
  );

  // Handler for deleting items and their associated nodes
  const handleItemDelete = React.useCallback(
    (id?: string | unknown, itemId?: string | unknown) => {
      const childId = `child-${itemId}`;
      const isChildNode = _utils.checkIfChild(id);

      try {
        // First get the parent node ID
        const parentNodeId =
          isChildNode && typeof id === "string" ? id?.split("-")[1] : id;
        const originalParentNode = nodes.find((n) => n.id === parentNodeId);

        if (!originalParentNode) {
          console.warn("Parent node not found:", parentNodeId);

          return;
        }

        // Keep track of all nodes that need to be removed
        const nodesToRemove = new Array<string>();

        nodesToRemove.push(childId);

        // Helper function to collect all descendant nodes
        const collectDescendants = (itemId?: string | unknown) => {
          const childNodeId = `child-${itemId}`;
          const childNode = nodes.find((n) => n.id === childNodeId);

          if (childNode?.data?.items) {
            childNode.data.items.forEach((item: _t.ItemType) => {
              const descendantNodeId = `child-${item.id}`;

              nodesToRemove.push(descendantNodeId);
              collectDescendants(item.id);
            });
          }
        };

        // Start collecting from the target item
        collectDescendants(itemId);

        // First update - Remove item from parent's items array
        setNodes((prevNodes) => {
          const updateChilds = (items: _t.ItemType[]): _t.ItemType[] => {
            return items
              .filter((item) => item.id !== itemId)
              .map((item) => ({
                ...item,
                items: item.items ? updateChilds(item.items) : [],
              }));
          };

          return prevNodes
            .filter((node) => !nodesToRemove.includes(node.id))
            .map((node) => {
              if (node.id === parentNodeId) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    items: updateChilds(node.data.items),
                    // selectedItemId:
                    //   selectedItem.current === itemId
                    //     ? null
                    //     : node.data.selectedItemId,
                  },
                };
              }

              return node;
            });
        });

        // Second update - Clean up edges
        setEdges((prevEdges) =>
          prevEdges.filter(
            (edge) =>
              !nodesToRemove.some(
                (id) => edge.source === id || edge.target === id,
              ),
          ),
        );

        // Reset selection state if needed
        // if (selectedItem.current === itemId) {
        //   selectedItem.current = null;
        //   selectedParent.current = null;
        // }
      } catch (error) {
        console.error("Error while deleting item:", error);
      }
    },
    [md, nodes, setNodes, setEdges],
  );

  // Handler for showing the second node (child node)
  const handleShowSecondNode = React.useCallback(
    (itemId?: string | unknown, parentId?: string) => {
      // Return if no parentId is provided
      if (!parentId) return;

      const parentNode = nodes.find((n) => n.id === parentId);

      // Return if no parent node is found
      if (!parentNode) return;

      const parentItems = Array.isArray(parentNode?.data?.items)
        ? parentNode.data.items
        : [];
      const sourceIndex = parentItems.findIndex(
        (item: _t.ItemType) => item.id === itemId,
      );

      if (sourceIndex === -1) return;

      const selectedParentItem = parentItems[sourceIndex];

      // Return if no selected parent item is found
      if (!selectedParentItem) return;

      // Calculate positions
      const parentNodeY = parentNode.position.y;
      const parentNodes = nodes.filter((n) => _utils.checkIfParent(n.id));
      const parentIdx = parentNodes.findIndex((n) => n.id === parentId);
      const isEven = parentIdx % 2 === 0;
      const childX = isEven
        ? _c.PARENT_X_RIGHT + _c.CHILD_X_OFFSET
        : _c.PARENT_X_LEFT - _c.CHILD_X_OFFSET;
      const childY = parentNodeY + _c.NODE_HEADER_HEIGHT;

      const childNodeId = `child-${itemId}`;

      // Debugging logs
      // console.log("parentItems", parentItems);
      // console.log("prevParents", prevParents);
      // console.log("heightUpToPreviousParents", heightUpToPreviousParents);
      // console.log("allParents", allParents);
      // console.log("parentNodes", parentNodes);
      // console.log("nodes", nodes);
      // console.log("parentNode", parentNode);
      // console.log("parentNodeY", parentNodeY);
      // console.log("prevParentHeight", prevParentHeight);
      // console.log("prevParentPositionY", prevParentPositionY);

      // Process nested items recursively to ensure state is preserved
      const processNestedItems = (item: _t.ItemType | any): _t.ItemType => ({
        ...item,
        parentId: itemId,
        isSelected: false,
        checked: item.checked ?? false,
        items: item.items
          ? item.items.map((child: any) => processNestedItems(child))
          : [],
      });

      // Remove existing child nodes and prepare node updates
      const updatedNodes = nodes
        .filter((n) => !_utils.checkIfChild(n.id))
        .map((n) => ({
          ...n,
          data: {
            ...n.data,
            // selectedItemId: n.id === parentId ? itemId : null,
          },
        }));

      // Add new child node with properly processed nested items
      updatedNodes.push({
        id: childNodeId,
        type: "custom",
        position: { x: childX, y: childY },
        data: {
          title: selectedParentItem.title || "",
          items: selectedParentItem.items
            ? selectedParentItem.items.map((item: any) =>
                processNestedItems(item),
              )
            : [],
          // selectedItemId: null,
          group: "secondary",
          parentId,
          onItemDelete: handleItemDelete,
          isCheckable: false,
        },
      });

      // Batch update nodes and edges
      setNodes(updatedNodes);
      setEdges((eds) => [
        ...eds.filter((e) => !_utils.checkIfEdge(e.id)),
        {
          id: `edge-${itemId}`,
          source: parentId,
          target: childNodeId,
          type: "customListItem",
          data: {
            sourceIndex,
            targetIndex: 0,
            itemHeight: _constants.ROUTE_NODE_ITEM_HEIGHT,
            color: "#3B82F6",
            parentIdx,
          },
        },
      ]);

      // selectedParent.current = parentId;
      // selectedItem.current = itemId;
    },
    [nodes, handleItemDelete],
  );

  // Create nodes with handlers attached
  const nodesWithHandlers = React.useMemo(() => {
    return displayNodes.map((node: _t.CustomNodeType) => {
      const nodeData = node.data;

      return {
        ...node,
        data: {
          ...nodeData,
          selectedItemId: nodeData.selectedItemId ?? null,
          onItemDelete: handleItemDelete,
          onItemClick: (itemId?: string | unknown) =>
            handleShowSecondNode(itemId, node.id),
        },
      } satisfies _t.CustomNodeType;
    });
  }, [displayNodes, handleItemDelete, handleShowSecondNode]);

  // Always call hooks unconditionally
  React.useEffect(() => {
    if (content) {
      setMd(prependMdHeaderIfAbsent(content, _constants.DEFAULT_ROADMAP_TITLE));
    }
  }, [content, setMd]);

  // Return null if it is loading or fetching
  if (isLoading || isFetching) {
    return <C.HappyPineappleSpinner data-testid="happy-pineapple-spinner" />;
  }

  // if (isError || !content) notFound();

  // Return 404 if there's an error
  if (isError)
    throw new Error("Failed to load route template as it does not exist.");

  return (
    <C.PageContainer
      data-testid="route-templates-page"
      extendCss={clsx("route-templates-page", "flex w-full apply_height")}
    >
      {/* Custom Md Editor */}
      <section
        className={clsx(
          "custom-md-editor",
          "_apply_uiw_md_editor_width grid place-items-center relative bg-transparent",
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

      {/* Route SVG diagram */}
      <section
        className={clsx("route-svg-diagram", "flex-1 relative w-full")}
        data-testid="route-svg-diagram"
      >
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

        <div className="w-full h-full overflow-hidden">
          {!isMounted ? (
            <div className="w-full h-full relative grid place-items-center">
              <div className="w-40 h-40 rounded-lg">
                <C.CommonSkeleton
                  colorTransparent
                  imageRoute
                  imageSize="w-40 h-40"
                />
              </div>
            </div>
          ) : (
            <XYFlow.ReactFlow
              className="!z-10"
              edgeTypes={edgeTypes}
              edges={edges}
              fitView={true}
              maxZoom={2}
              minZoom={0.1}
              nodeTypes={nodeTypes}
              nodes={nodesWithHandlers}
              nodesConnectable={false}
              panOnDrag={[0, 1, 2, 3, 4]}
              onEdgesChange={onEdgesChange}
              onNodeDragStart={onNodeDragStart}
              onNodeDragStop={onNodeDragStop}
              onNodesChange={onNodesChange}
            >
              <XYFlow.Controls />
            </XYFlow.ReactFlow>
          )}
        </div>
      </section>
    </C.PageContainer>
  );
};
