"use client";

import React, { useEffect, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import clsx from "clsx";

import { NodeHeader, ReorderableList, DeleteModal } from "..";
import { useNodeHandlers, useNodeState } from "../../hooks";

import { useMindMapStore } from "@/stores/useMindMapStore";
import { ItemType, CHNodeType } from "@/types/new-types";
import { ENHANCED_DIMENSIONS } from "@/utils/pages/route-templates/view/constants";

export const CHNode = (props: CHNodeType) => {
  const { data, id } = props;
  const { title } = data;

  const previousDataItemsRef = useRef<ItemType[]>([]);
  const mindmampStore = useMindMapStore();
  const {
    setCanReorder,
    nodesDraggable,
    setNodesDraggable,
    draggingNodeId,
    selectedItemId: globalSelectedItemId,
    setSelectedItemId,
  } = mindmampStore;

  console.log("mindmampStore", mindmampStore);

  // Use the custom hooks for state management
  const {
    hoverId,
    setHoverId,
    draggingId,
    setDraggingId,
    items,
    setItems,
    deleteModalItem,
    setDeleteModalItem,
    isItemBeingDragged,
    setIsItemBeingDragged,
    editingItemId,
    setEditingItemId,
    dragStartTimeRef,
  } = useNodeState();

  // Use the custom hooks for handlers
  const {
    handleDragStart,
    handleDragEnd,
    handleClick,
    handleEditStart,
    handleEditEnd,
  } = useNodeHandlers(
    setNodesDraggable,
    setCanReorder,
    setDraggingId,
    setIsItemBeingDragged,
    setSelectedItemId,
    setEditingItemId,
    dragStartTimeRef,
    data,
    id,
    items,
    draggingId,
    isItemBeingDragged,
  );
  // Use the utility functions (commented out unused for now)
  // const { getDescendantIds } = useNodeUtils();

  // Variables
  const isNodeDragging = draggingNodeId === data?.id;
  const isChildOfDragged = Boolean(
    draggingId &&
      data?.id !== draggingId &&
      typeof data?.id === "string" &&
      data?.id.startsWith(draggingId),
  );

  // Local handlers that weren't moved to hooks yet
  const handleReorder = (newOrder: ItemType[]) => {
    if (!draggingId) return;

    setItems(newOrder);
  };

  const handleCheckboxClick = (item: ItemType) => {
    setItems((currentItems) => {
      const updatedItems = currentItems.map((currentItem) => {
        if (currentItem.id === item.id) {
          return { ...currentItem, checked: !currentItem.checked };
        }

        return currentItem;
      });

      // Trigger markdown sync after checkbox change
      if (data.onItemReorder) {
        setTimeout(() => {
          data.onItemReorder!(id, updatedItems);
        }, 0);
      }

      return updatedItems;
    });
  };

  const handleItemDelete = (itemId?: string | unknown) => {
    if (data.onItemDelete && typeof itemId === "string") {
      // For child nodes, pass the node ID and item ID
      // For parent nodes, pass the node ID and item ID
      data.onItemDelete(data?.id, itemId);

      // Also update local state to remove the item immediately for better UX
      setItems((currentItems) => {
        const removeItemRecursively = (items: ItemType[]): ItemType[] => {
          return items
            .filter((item) => item.id !== itemId)
            .map((item) => ({
              ...item,
              items: item.items ? removeItemRecursively(item.items) : [],
            }));
        };

        const updatedItems = removeItemRecursively(currentItems);

        // Trigger markdown sync after deletion by calling onItemReorder
        // This ensures the markdown is updated to reflect the deletion
        if (data.onItemReorder) {
          // Use setTimeout to ensure the state update completes first
          setTimeout(() => {
            data.onItemReorder!(id, updatedItems);
          }, 0);
        }

        return updatedItems;
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteModalItem) {
      handleItemDelete(deleteModalItem.itemId);
    }

    setDeleteModalItem(null);
  };

  const handleTextChange = (itemId: string, newText: string) => {
    setItems((currentItems) => {
      const updatedItems = currentItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, title: newText };
        }

        return item;
      });

      // Trigger markdown sync after text change
      if (data.onItemReorder) {
        setTimeout(() => {
          data.onItemReorder!(id, updatedItems);
        }, 0);
      }

      return updatedItems;
    });
  };

  const handleAddItem = (afterItemId: string) => {
    if (data.onAddItem) {
      data.onAddItem(afterItemId);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    // Update the title through the data callback if available
    if (data.onTitleChange) {
      data.onTitleChange(id, newTitle);
    }
  };

  // Effects
  useEffect(() => {
    if (
      data.items &&
      JSON.stringify(data.items) !==
        JSON.stringify(previousDataItemsRef.current)
    ) {
      setItems(data.items);
      previousDataItemsRef.current = data.items;
    }
  }, [data.items, setItems]);

  // Early return for hidden nodes
  if (isChildOfDragged) {
    return null;
  }

  return (
    <>
      <div
        className={clsx("bg-transparent rounded-lg shadow-lg w-full", {
          "opacity-50": isNodeDragging,
          "pointer-events-none": isItemBeingDragged,
        })}
        data-node-id={data?.id}
        style={{
          minWidth: `${ENHANCED_DIMENSIONS.NODE_MIN_WIDTH}px`,
          maxWidth: `${ENHANCED_DIMENSIONS.NODE_MAX_WIDTH}px`,
          minHeight: `${ENHANCED_DIMENSIONS.NODE_MIN_HEIGHT}px`,
        }}
      >
        <NodeHeader
          draggingId={draggingId}
          isItemBeingDragged={isItemBeingDragged}
          nodeId={data?.id as string}
          nodesDraggable={nodesDraggable}
          title={title || ""}
          onTitleChange={handleTitleChange}
        />

        <ReorderableList
          draggingId={draggingId}
          editingItemId={editingItemId}
          globalSelectedItemId={globalSelectedItemId}
          handleCheckboxClick={handleCheckboxClick}
          handleClick={handleClick}
          handleDragEnd={handleDragEnd}
          handleDragStart={handleDragStart}
          handleReorder={handleReorder}
          hoverId={hoverId}
          items={items}
          nodeId={id}
          nodesDraggable={nodesDraggable}
          parentId={data?.parentId}
          setDeleteModalItem={setDeleteModalItem}
          setHoverId={setHoverId}
          onAddItem={handleAddItem}
          onEditEnd={handleEditEnd}
          onEditStart={handleEditStart}
          onMouseLeave={() => setHoverId(null)}
          onTextChange={handleTextChange}
        />

        <Handle position={Position.Top} type="target" />
        <Handle position={Position.Bottom} type="source" />
      </div>

      <DeleteModal
        isOpen={deleteModalItem !== null}
        itemTitle={
          deleteModalItem
            ? (() => {
                // Find item recursively in nested structure
                const findItemById = (
                  items: ItemType[],
                  targetId: string,
                ): ItemType | undefined => {
                  for (const item of items) {
                    if (item.id === targetId) {
                      return item;
                    }
                    if (item.items) {
                      const found = findItemById(item.items, targetId);

                      if (found) return found;
                    }
                  }

                  return undefined;
                };

                return findItemById(items, deleteModalItem.itemId)?.title;
              })()
            : undefined
        }
        onClose={() => setDeleteModalItem(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
