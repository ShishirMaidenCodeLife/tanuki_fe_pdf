import {
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
  useCallback,
} from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";

import {
  CHILD_VERTICAL_SPACING,
  DEFAULT_ROADMAP_TITLE,
  PARENT_X_RIGHT,
  PARENT_X_LEFT,
  CHILD_X_OFFSET,
  NODE_HEADER_HEIGHT,
} from "./constants";
import { prependMdHeaderIfAbsent } from "./data";
import {
  handleNodeClick,
  handleItemDelete,
  convertNodesToMarkdown,
} from "./events";
import { handleNodeDragStart, handleNodeDragStop } from "./events-drag";
import {
  mdToNestedTree,
  extractMdContent,
  checkIfParent,
  checkIfChild,
  getChildIdxFromId,
  assignParentPositions,
} from "./utils";

import { useRoadmapStoreHook, useRouteTemplateApiService } from "@/hooks";
import { useMindMapStore } from "@/stores/useMindMapStore";
import { RouteTemplateApiType } from "@/types";
import {
  CHNodeType,
  CHParentEdgeType,
  InitialPositionsRefType,
  ItemType,
} from "@/types/new-types";

// Custom hook for managing React Flow data
export const useReactFlowData = (md: string) => {
  const { MD_NODES, MD_EDGES, currentHeading } = useMemo(() => {
    const { MD_NODES, MD_EDGES } = mdToNestedTree(md);
    const { currentHeading } = extractMdContent(md);

    return { MD_NODES, MD_EDGES, currentHeading };
  }, [md]);

  const [nodes, setNodes, onNodesChange] = useNodesState<CHNodeType>(MD_NODES);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<CHParentEdgeType>(MD_EDGES);

  // Update nodes and edges when MD data changes
  useEffect(() => {
    setNodes(MD_NODES);
    setEdges(MD_EDGES);
  }, [MD_NODES, MD_EDGES, setNodes, setEdges]);

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    currentHeading,
  };
};

// Custom hook for handling route template data
export const useRouteTemplateData = () => {
  const { md, setMd } = useRoadmapStoreHook();
  const { getByUuidResponse } = useRouteTemplateApiService(["useGetByUuid"]);
  const { data, isError, isFetching, isLoading } = getByUuidResponse;
  const content = (data as RouteTemplateApiType)?.content;

  useEffect(() => {
    if (content) {
      setMd(prependMdHeaderIfAbsent(content, DEFAULT_ROADMAP_TITLE));
    }
  }, [content, setMd]);

  return {
    md,
    content,
    isError,
    isFetching,
    isLoading,
  };
};

// Custom hook for node positioning
export const useNodePositioning = (nodes: CHNodeType[]) => {
  const displayNodes = useMemo(() => {
    const updatedChildNode = nodes.find(
      (n: CHNodeType) => !checkIfParent(n.id),
    );

    return nodes.map((n: CHNodeType) => {
      if (n.id === updatedChildNode?.id) {
        const childIndex = getChildIdxFromId(n.id);
        const verticalOffset = (childIndex - 1) * CHILD_VERTICAL_SPACING;

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
  }, [nodes]);

  return displayNodes;
};

// Custom hook for node event handlers
export const useNodeHandlers = (
  nodes: CHNodeType[],
  setNodes: Dispatch<SetStateAction<CHNodeType[]>>,
  setEdges: Dispatch<SetStateAction<CHParentEdgeType[]>>,
  currentHeading: string,
) => {
  const {
    setSelectedItemId,
    setDraggingNodeId,
    setActiveChildId,
    setActiveParentId,
  } = useMindMapStore();
  const { setMd } = useRoadmapStoreHook();
  const draggedNodeRef = useRef<CHNodeType | null>(null);
  const initialPositionsRef = useRef<InitialPositionsRefType>(new Map());

  const onNodeDragStart = useCallback(
    (_: MouseEvent, eventNode: CHNodeType) => {
      handleNodeDragStart({
        eventNode,
        draggedNodeRef,
        initialPositionsRef,
        setDraggingNodeId,
      });
    },
    [setDraggingNodeId],
  );

  const onNodeDragStop = useCallback(
    (_: MouseEvent, eventNode: CHNodeType): void => {
      handleNodeDragStop({
        eventNode,
        draggedNodeRef,
        initialPositionsRef,
        nodes,
        setNodes,
        setEdges,
        _setSelectedItemId: setSelectedItemId, // Renamed to indicate it's intentionally unused during drag
        setDraggingNodeId,
        setMd,
        currentHeading,
      });
    },
    [
      nodes,
      setNodes,
      setEdges,
      setSelectedItemId,
      setDraggingNodeId,
      setMd,
      currentHeading,
    ],
  );

  const onItemDelete = useCallback(
    (id?: string | unknown, itemId?: string | unknown) => {
      handleItemDelete({
        id,
        itemId,
        nodes,
        setNodes,
        setEdges,
        currentHeading,
        setMd,
      });
    },
    [nodes, setNodes, setEdges, currentHeading, setMd],
  );

  const handleNodeItemClick = useCallback(
    (itemId?: string | unknown, parentId?: string) => {
      // Create a function to update markdown from current nodes
      const updateMarkdownFromNodes = (currentNodes: CHNodeType[]) => {
        const parentNodes = currentNodes.filter((n) => checkIfParent(n.id));
        const newMd = convertNodesToMarkdown(parentNodes, currentHeading);

        setMd(newMd);
      };

      handleNodeClick({
        itemId,
        parentId,
        nodes,
        setNodes,
        setEdges,
        onItemDelete,
        setActiveChildId,
        setActiveParentId,
        updateMarkdownFromNodes,
      });
    },
    [
      nodes,
      setNodes,
      setEdges,
      onItemDelete,
      setActiveChildId,
      setActiveParentId,
      currentHeading,
      setMd,
    ],
  );

  const handlePaneClick = useCallback(() => {
    // Close child nodes and update markdown with any pending changes
    setNodes((currentNodes) => {
      const hasChildNodes = currentNodes.some((n) => checkIfChild(n.id));

      if (hasChildNodes) {
        // Update markdown with current state before removing child nodes
        const parentNodes = currentNodes.filter((n) => checkIfParent(n.id));
        const newMd = convertNodesToMarkdown(parentNodes, currentHeading);

        setMd(newMd);

        // Clear active child state
        setActiveChildId(null);
        setActiveParentId(null);

        // Return only parent nodes (remove child nodes)
        return parentNodes;
      }

      return currentNodes;
    });
  }, [setNodes, setActiveChildId, setActiveParentId, currentHeading, setMd]);

  return {
    onNodeDragStart,
    onNodeDragStop,
    onItemDelete,
    handleNodeItemClick,
    handlePaneClick,
    setMd, // Export setMd for item reordering
  };
};

// Custom hook for preparing nodes with handlers
export const useNodesWithHandlers = (
  displayNodes: CHNodeType[],
  setNodes: Dispatch<SetStateAction<CHNodeType[]>>,
  onItemDelete: (id?: string | unknown, itemId?: string | unknown) => void,
  handleNodeItemClick: (itemId?: string | unknown, parentId?: string) => void,
  currentHeading: string,
  setMd: (md: string) => void,
  setIsUpdatingMdAfterReorder: (updating: boolean) => void,
) => {
  const handleItemReorder = useCallback(
    (nodeId: string, newItems: ItemType[]) => {
      // Check if this is a child node (format: "child-{parentItemId}")
      const isChildNode = checkIfChild(nodeId);

      console.log("handleItemReorder called:", {
        nodeId,
        isChildNode,
        itemCount: newItems.length,
      });

      if (isChildNode) {
        // For child nodes, we need to update the nested items within the parent
        const parentItemId = nodeId.replace("child-", "");

        setNodes((currentNodes) => {
          console.log(
            "Before update - nodes count:",
            currentNodes.length,
            "child nodes:",
            currentNodes.filter((n) => checkIfChild(n.id)).length,
          );

          const updatedNodes = currentNodes.map((node) => {
            // Find the parent node that contains the item being reordered
            if (checkIfParent(node.id) && node.data.items) {
              const updatedItems = node.data.items.map((item) => {
                if (item.id === parentItemId) {
                  // Update the nested items for this specific parent item
                  return {
                    ...item,
                    items: newItems,
                  };
                }

                return item;
              });

              return {
                ...node,
                data: {
                  ...node.data,
                  items: updatedItems,
                },
              };
            }

            // Also update the child node itself if it exists
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  items: newItems,
                },
              };
            }

            return node;
          });

          console.log(
            "After update - nodes count:",
            updatedNodes.length,
            "child nodes:",
            updatedNodes.filter((n) => checkIfChild(n.id)).length,
          );

          // For child node reordering, update markdown after a brief delay
          // Set flag to indicate we're updating MD after reorder to preserve child node
          setTimeout(() => {
            setIsUpdatingMdAfterReorder(true);

            const parentNodes = updatedNodes.filter((n) => checkIfParent(n.id));
            const newMd = convertNodesToMarkdown(parentNodes, currentHeading);

            console.log("Updating markdown after child node reorder");
            setMd(newMd);

            // Reset flag after a short delay to allow useEffect to run
            setTimeout(() => setIsUpdatingMdAfterReorder(false), 100);
          }, 50);

          return updatedNodes;
        });
      } else {
        // For parent nodes, update the node's items directly (original behavior)
        setNodes((currentNodes) => {
          const updatedNodes = currentNodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  items: newItems,
                },
              };
            }

            return node;
          });

          // Recalculate positions for all nodes when content changes
          const nodesWithRecalculatedPositions =
            recalculateNodePositions(updatedNodes);

          // Schedule markdown update for next render cycle
          setTimeout(() => {
            const newMd = convertNodesToMarkdown(
              nodesWithRecalculatedPositions,
              currentHeading,
            );

            setMd(newMd);
          }, 0);

          return nodesWithRecalculatedPositions;
        });
      }
    },
    [setNodes, currentHeading, setMd, setIsUpdatingMdAfterReorder],
  );

  const handleTitleChange = useCallback(
    (nodeId: string, newTitle: string) => {
      setNodes((currentNodes) => {
        const updatedNodes = currentNodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                title: newTitle,
              },
            };
          }

          return node;
        });

        // Recalculate positions for all nodes when content changes
        const nodesWithRecalculatedPositions =
          recalculateNodePositions(updatedNodes);

        // Schedule markdown update for next render cycle
        setTimeout(() => {
          const newMd = convertNodesToMarkdown(
            nodesWithRecalculatedPositions,
            currentHeading,
          );

          setMd(newMd);
        }, 0);

        return nodesWithRecalculatedPositions;
      });
    },
    [setNodes, currentHeading, setMd],
  );

  const handleAddItem = useCallback(
    (nodeId: string, afterItemId: string) => {
      // Check if this is a child node (format: "child-{parentItemId}")
      const isChildNode = checkIfChild(nodeId);

      if (isChildNode) {
        // For child nodes, we need to update the nested items within the parent
        const parentItemId = nodeId.replace("child-", "");

        setNodes((currentNodes) => {
          const updatedNodes = currentNodes.map((node) => {
            // Find the parent node that contains the item being reordered
            if (checkIfParent(node.id) && node.data.items) {
              const updatedItems = node.data.items.map((item) => {
                if (item.id === parentItemId) {
                  // Find the index to insert after
                  const afterIndex = item.items?.findIndex(
                    (subItem) => subItem.id === afterItemId,
                  );

                  if (afterIndex !== undefined && afterIndex !== -1) {
                    const newItem: ItemType = {
                      id: `${nodeId}-item-${Date.now()}-${Math.random()
                        .toString(36)
                        .substr(2, 9)}`,
                      title: "",
                      checked: false,
                    };

                    const newItems = [...(item.items || [])];

                    newItems.splice(afterIndex + 1, 0, newItem);

                    return {
                      ...item,
                      items: newItems,
                    };
                  }
                }

                return item;
              });

              return {
                ...node,
                data: {
                  ...node.data,
                  items: updatedItems,
                },
              };
            }

            // Also update the child node itself
            if (node.id === nodeId) {
              const afterIndex = node.data.items?.findIndex(
                (item) => item.id === afterItemId,
              );

              if (afterIndex !== undefined && afterIndex !== -1) {
                const newItem: ItemType = {
                  id: `${nodeId}-item-${Date.now()}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                  title: "",
                  checked: false,
                };

                const newItems = [...(node.data.items || [])];

                newItems.splice(afterIndex + 1, 0, newItem);

                return {
                  ...node,
                  data: {
                    ...node.data,
                    items: newItems,
                  },
                };
              }
            }

            return node;
          });

          // Recalculate positions for all nodes when content changes
          const nodesWithRecalculatedPositions =
            recalculateNodePositions(updatedNodes);

          // Schedule markdown update for next render cycle
          setTimeout(() => {
            const newMd = convertNodesToMarkdown(
              nodesWithRecalculatedPositions,
              currentHeading,
            );

            setMd(newMd);
          }, 0);

          return nodesWithRecalculatedPositions;
        });
      } else {
        // For parent nodes, update the node's items directly
        setNodes((currentNodes) => {
          const updatedNodes = currentNodes.map((node) => {
            if (node.id === nodeId) {
              const afterIndex = node.data.items?.findIndex(
                (item) => item.id === afterItemId,
              );

              if (afterIndex !== undefined && afterIndex !== -1) {
                const newItem: ItemType = {
                  id: `${nodeId}-item-${Date.now()}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                  title: "",
                  checked: false,
                };

                const newItems = [...(node.data.items || [])];

                newItems.splice(afterIndex + 1, 0, newItem);

                return {
                  ...node,
                  data: {
                    ...node.data,
                    items: newItems,
                  },
                };
              }
            }

            return node;
          });

          // Recalculate positions for all nodes when content changes
          const nodesWithRecalculatedPositions =
            recalculateNodePositions(updatedNodes);

          // Schedule markdown update for next render cycle
          setTimeout(() => {
            const newMd = convertNodesToMarkdown(
              nodesWithRecalculatedPositions,
              currentHeading,
            );

            setMd(newMd);
          }, 0);

          return nodesWithRecalculatedPositions;
        });
      }
    },
    [setNodes, currentHeading, setMd],
  );

  return useMemo(() => {
    return displayNodes.map((node: CHNodeType) => {
      const nodeData = node.data;

      return {
        ...node,
        data: {
          ...nodeData,
          selectedItemId: nodeData.selectedItemId ?? null,
          onItemDelete,
          onItemClick: (itemId?: string | unknown) =>
            handleNodeItemClick(itemId, node.id),
          onItemReorder: handleItemReorder, // Add the item reorder callback
          onAddItem: (afterItemId: string) =>
            handleAddItem(node.id, afterItemId), // Add the add item callback
          onTitleChange: (nodeId: string, newTitle: string) =>
            handleTitleChange(nodeId, newTitle), // Add the title change callback
        },
      } satisfies CHNodeType;
    });
  }, [
    displayNodes,
    onItemDelete,
    handleNodeItemClick,
    handleItemReorder,
    handleAddItem,
    handleTitleChange,
  ]);
};

// Utility function to recalculate node positions dynamically
export const recalculateNodePositions = (nodes: CHNodeType[]): CHNodeType[] => {
  const parentNodes = nodes.filter((node) => checkIfParent(node.id));
  const childNodes = nodes.filter((node) => checkIfChild(node.id));

  // Recalculate parent positions with current content
  const nodesWithoutPosition = parentNodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: node.data,
  }));

  // Use assignParentPositions to recalculate positions
  const updatedParentNodes = assignParentPositions(nodesWithoutPosition).map(
    (positionedNode) => {
      const originalNode = parentNodes.find((n) => n.id === positionedNode.id);

      return {
        ...originalNode!,
        position: positionedNode.position,
      };
    },
  );

  // Update child nodes to maintain proper positioning relative to their updated parents
  const updatedChildNodes = childNodes.map((childNode) => {
    const parentId = childNode.data.parentId;
    const updatedParent = updatedParentNodes.find((p) => p.id === parentId);

    if (updatedParent) {
      // Recalculate child position relative to updated parent
      const parentNodes = updatedParentNodes;
      const parentIdx = parentNodes.findIndex((n) => n.id === parentId);
      const isEven = parentIdx % 2 === 0;

      const childX = isEven
        ? PARENT_X_RIGHT + CHILD_X_OFFSET
        : PARENT_X_LEFT - CHILD_X_OFFSET;
      const childY = updatedParent.position.y - NODE_HEADER_HEIGHT;

      return {
        ...childNode,
        position: { x: childX, y: childY },
      };
    }

    return childNode;
  });

  // Return all nodes with updated positions
  return [...updatedParentNodes, ...updatedChildNodes];
};
