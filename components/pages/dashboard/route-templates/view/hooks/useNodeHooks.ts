"use client";

import { useState, useCallback, useRef } from "react";

import { ItemType } from "@/types/new-types";
import { checkIfChild } from "@/utils/pages/route-templates/view/utils";

export const useNodeState = () => {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);
  const [deleteModalItem, setDeleteModalItem] = useState<{
    id?: string | unknown;
    itemId: string;
  } | null>(null);
  const [isItemBeingDragged, setIsItemBeingDragged] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const dragStartTimeRef = useRef<number>(0);

  return {
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
  };
};

export const useNodeHandlers = (
  setNodesDraggable: (value: boolean) => void,
  setCanReorder: (value: boolean) => void,
  setDraggingId: (id: string | null) => void,
  setIsItemBeingDragged: (value: boolean) => void,
  setSelectedItemId: (id: string | null) => void,
  setEditingItemId: (id: string | null) => void,
  dragStartTimeRef: React.MutableRefObject<number>,
  data: any,
  id: string,
  items: ItemType[],
  draggingId: string | null,
  isItemBeingDragged: boolean,
) => {
  // Drag handlers
  const handleDragStart = useCallback(
    (id: string) => {
      if (dragStartTimeRef.current) {
        dragStartTimeRef.current = Date.now();
      }
      setDraggingId(id);
      setIsItemBeingDragged(true);
      setNodesDraggable(false);
      setCanReorder(true);
      // Clear editing state when dragging starts
      setEditingItemId(null);
    },
    [
      setNodesDraggable,
      setCanReorder,
      setDraggingId,
      setIsItemBeingDragged,
      setEditingItemId,
      dragStartTimeRef,
    ],
  );

  const handleDragEnd = useCallback(() => {
    // Call parent handler with final item order only when drag ends
    if (data.onItemReorder) {
      data.onItemReorder(id, items);
    }

    setDraggingId(null);
    setIsItemBeingDragged(false);
    setNodesDraggable(true);
    setCanReorder(false);
  }, [
    setNodesDraggable,
    setCanReorder,
    data,
    id,
    items,
    setDraggingId,
    setIsItemBeingDragged,
  ]);

  // Click handler for item that handles nested items
  const handleClick = useCallback(
    (item: ItemType) => {
      // Only allow selection in parent nodes, not child nodes
      if (checkIfChild(data?.id)) return;

      // Don't highlight if currently dragging
      if (draggingId || isItemBeingDragged) return;

      // Set the selected item for visual feedback and edge positioning
      setSelectedItemId(item.id);

      if (data.onItemClick) {
        data.onItemClick(item.id);
      }
    },
    [data, setSelectedItemId, draggingId, isItemBeingDragged],
  );

  // Edit handlers
  const handleEditStart = useCallback(
    (nodeId?: string, itemId?: string, currentText?: string) => {
      setEditingItemId(itemId || null);
      if (data.onEditStart) {
        data.onEditStart(nodeId, itemId, currentText);
      }
    },
    [data, setEditingItemId],
  );

  const handleEditEnd = useCallback(() => {
    setEditingItemId(null);
  }, [setEditingItemId]);

  return {
    handleDragStart,
    handleDragEnd,
    handleClick,
    handleEditStart,
    handleEditEnd,
  };
};

export const useNodeUtils = () => {
  // Recursively process items to ensure checked states are preserved
  const processItems = useCallback(
    (newItems: ItemType[], currentItems: ItemType[]): ItemType[] => {
      return newItems.map((newItem) => {
        const existingItem = currentItems.find(
          (item) => item.id === newItem.id,
        );

        return {
          ...newItem,
          checked: existingItem?.checked ?? false,
          items:
            existingItem && newItem.items
              ? processItems(newItem.items, existingItem.items || [])
              : newItem.items || [],
        };
      });
    },
    [],
  );

  // Recursive function to get all descendant IDs
  const getDescendantIds = useCallback((items: ItemType[]): string[] => {
    return items.reduce((acc: string[], item) => {
      acc.push(item.id);
      if (item.items) {
        acc.push(...getDescendantIds(item.items));
      }

      return acc;
    }, []);
  }, []);

  // Handle item state updates recursively
  const updateChildState = useCallback(
    (
      items: ItemType[],
      targetId: string,
      updates: Partial<ItemType>,
    ): ItemType[] => {
      return items.map((item) => {
        if (item.id === targetId) {
          return { ...item, ...updates };
        }
        if (item.items) {
          return {
            ...item,
            items: updateChildState(item.items, targetId, updates),
          };
        }

        return item;
      });
    },
    [],
  );

  // Create map of checked states
  const createCheckedMap = useCallback(
    (items: ItemType[]): Map<string, boolean> => {
      const map = new Map<string, boolean>();

      items.forEach((item) => {
        map.set(item.id, !!item.checked);
        if (item.items) {
          const childMap = createCheckedMap(item.items);

          childMap.forEach((value, key) => map.set(key, value));
        }
      });

      return map;
    },
    [],
  );

  return {
    processItems,
    getDescendantIds,
    updateChildState,
    createCheckedMap,
  };
};
