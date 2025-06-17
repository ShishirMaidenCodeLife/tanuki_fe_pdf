"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { Reorder } from "framer-motion";
import { FaBook, FaCheck, FaTrash } from "react-icons/fa";
import clsx from "clsx";

import { CommonModal, CommonPineappleImage } from "@/components";
import { useMindMapStore } from "@/stores/useMindMapStore";
import { ItemType, CustomNodeType } from "@/types/new-types";
import { checkIfChild } from "@/utils/pages/route-templates/view/utils";

export const CustomNode = (props: CustomNodeType) => {
  const { data } = props;
  const { selectedItemId, title } = data;

  const previousDataItemsRef = useRef<ItemType[]>([]);
  const previousItemsRef = useRef<ItemType[]>([]);
  const { setCanReorder, nodesDraggable, setNodesDraggable } =
    useMindMapStore();

  const [hoverId, setHoverId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);
  const [deleteModalItem, setDeleteModalItem] = useState<{
    id?: string | unknown;
    itemId: string;
  } | null>(null);

  // #region Variables

  // Hide node if it's a child of the item being dragged
  const isChildOfDragged = Boolean(
    draggingId &&
      data?.id !== draggingId &&
      typeof data?.id === "string" &&
      data?.id.startsWith(draggingId),
  );

  // #endregion Variables

  // #region Utils

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
  // #endregion Utils

  // #region Update Handlers

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

  // #endregion Update Handlers

  // #region Click handlers

  // Checkbox click handler with recursive state update
  const handleCheckboxClick = useCallback(
    (item: ItemType) => {
      setItems((currentItems) => {
        return updateChildState(currentItems, item.id, {
          checked: !item.checked,
        });
      });
    },
    [updateChildState],
  );

  // Click handler for item that handles nested items
  const handleClick = useCallback(
    (item: ItemType) => {
      if (checkIfChild(data?.id)) return;

      if (data.onItemClick) {
        data.onItemClick(item.id);
      }
    },
    [data],
  );
  // #endregion Click handlers

  // #region Drag handlers
  const handleDragStart = useCallback(
    (id: string) => {
      setDraggingId(id);
      // Disable node dragging during item drag and set reordering state
      setNodesDraggable(false);
      setCanReorder(true);
      // Set cursor style for drag start
      document.body.style.cursor = "grabbing";
    },
    [setNodesDraggable, setCanReorder],
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    // Re-enable node dragging after item drag
    setNodesDraggable(true);
    setCanReorder(false);
    // Reset cursor style
    document.body.style.cursor = "";
  }, [setNodesDraggable, setCanReorder]);
  // #endregion Drag handlers

  // #region Other handlers

  // Notify parent component of item reordering while preserving nested structure
  const handleReorder = useCallback(
    (newOrder: ItemType[]) => {
      setItems(newOrder);

      // Only update parent if we have a dragging item ID
      if (data.onItemClick && draggingId) {
        data.onItemClick(draggingId);
      }
    },
    [data, draggingId],
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

  // #endregion Other handlers

  // #region Delete node handlers

  // Recursive deletion handler
  const handleNodeDelete = useCallback(
    (id?: string | unknown) => {
      try {
        if (checkIfChild(id)) {
          // For child nodes, get all descendant IDs
          const descendants = getDescendantIds(items);
          // const sortedDescendants = descendants.sort(
          //   (a, b) => b.length - a.length,
          // );

          console.log("descendants", descendants);

          // Delete descendants first (from deepest to shallowest)
          // for (const descendantId of sortedDescendants) {
          //   // const targetNode = `child-${descendantId}`;
          //   // deleteParent(targetNode);
          // }

          // Finally delete the parent node
          // deleteParent(id);
        } else {
          // For parent nodes, delete all items and their descendants
          const descendants = getDescendantIds(items);

          // Debug consoles
          console.log("descendants", descendants);

          // for (const descendantId of descendants) {
          //   // const targetNode = `child-${descendantId}`;
          //   // deleteParent(targetNode);
          // }

          // deleteParent(id);
        }

        // Call parent callback if provided
        data.onNodeDelete?.(id);
      } catch (error) {
        // Debug consoles
        console.error("Error during node deletion:", error);
      }
    },
    [data, items, getDescendantIds],
  );

  // Recursive deletion handler
  const handleDeleteConfirm = useCallback(() => {
    if (!deleteModalItem) return;

    const { id, itemId } = deleteModalItem;

    try {
      if (checkIfChild(id)) {
        // For child nodes, get all descendant IDs
        const descendants = getDescendantIds(items);
        const sortedDescendants = descendants.sort(
          (a, b) => b.length - a.length,
        );

        // Delete descendants first (from deepest to shallowest)
        for (const descendantId of sortedDescendants) {
          const targetNode = `child-${descendantId}`;

          console.log("targetNode", targetNode);

          // deleteParent(targetNode);
        }

        // Finally delete the parent node
        // deleteParent(id);
      } else {
        // For parent nodes, delete the item and all its descendants
        const itemToDelete = items.find((item) => item.id === itemId);

        if (itemToDelete?.items) {
          const descendants = getDescendantIds(itemToDelete.items);

          console.log("descendants", descendants);

          // for (const descendantId of descendants) {
          //   // const targetNode = `child-${descendantId}`;
          //   // deleteParent(targetNode);
          // }
        }
        // deleteParent(`child-${itemId}`);
      }

      // Call parent callback if provided
      data.onNodeDelete?.(id);
    } catch (error) {
      // Debug consoles
      console.error("Error during node deletion:", error);
    } finally {
      setDeleteModalItem(null);
    }
  }, [deleteModalItem, items, data]);

  // Handle node deletion from header trash button
  // const handleNodeDeleteFromHeader = useCallback(
  //   (id: string) => {
  //     try {
  //       if (checkIfChild(id)) {
  //         // For child nodes, get all descendant IDs
  //         const descendants = getDescendantIds(items);
  //         const sortedDescendants = descendants.sort(
  //           (a, b) => b.length - a.length,
  //         );

  //         // Delete descendants first (from deepest to shallowest)
  //         for (const descendantId of sortedDescendants) {
  //           const targetNode = `child-${descendantId}`;

  //           deleteParent(targetNode);
  //         }
  //       }

  //       // Finally delete the node itself
  //       deleteParent(id);

  //       // Call parent callback
  //       data.onNodeDelete?.(id);
  //     } catch (error) {
  //       // Debug consoles
  //       console.error("Error during node deletion:", error);
  //     }
  //   },
  //   [data, items, deleteParent, getDescendantIds],
  // );
  // #endregion Delete node handlers

  // #region UseEffects

  // Initialize items state from props
  useEffect(() => {
    if (Array.isArray(data.items)) {
      setItems(processItems(data.items, []));
    }
  }, [data.items, processItems]);

  // Sync items with parent data and maintain checked state
  useEffect(() => {
    const prevDataItemsJson = JSON.stringify(previousDataItemsRef.current);
    const currentDataItemsJson = JSON.stringify(data.items);

    previousDataItemsRef.current = data.items;
    previousItemsRef.current = items;

    if (prevDataItemsJson === currentDataItemsJson) {
      return;
    }

    const checkedStates = createCheckedMap(items);

    if (Array.isArray(data.items)) {
      const updateChildsWithCheckedStates = (items: ItemType[]): ItemType[] => {
        return items.map((item) => ({
          ...item,
          checked: checkedStates.get(item.id) ?? item.checked ?? false,
          items: item.items ? updateChildsWithCheckedStates(item.items) : [],
        }));
      };

      setItems(updateChildsWithCheckedStates(data.items));
    }
  }, [data.items, items, createCheckedMap]);

  // #endregion UseEffects

  return (
    <>
      <div
        className={clsx(
          "min-w-[480px] w-[400px] border border-gray-300 rounded-lg shadow-sm transition-all duration-300 !bg-white/20 overflow-x-hidden",
          {
            "opacity-0 pointer-events-none": isChildOfDragged,
            "cursor-grab": nodesDraggable && !draggingId,
            "cursor-default": !nodesDraggable || draggingId,
          },
        )}
        draggable={nodesDraggable}
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: "600px",
          // Prevent text selection during drag
          userSelect: draggingId ? "none" : "text",
        }}
        onPointerDown={(e) => {
          if (checkIfChild(data?.id)) {
            e.stopPropagation();
          }
        }}
        onWheel={(e) => e.stopPropagation()}
      >
        <Handle position={Position.Top} type="target" />

        <div
          className={clsx(
            "flex items-center gap-2 px-3 py-2 h-28 max-h-28 rounded-t-lg group flex-shrink-0",
            checkIfChild(data?.id)
              ? "border-dashed border-b-dash-custom bg-blue-300/70 border-gray-400 border-b-[1.5px]"
              : "border-solid bg-blue-500 text-white border-blue-500 border-[1.5px]",
            {
              "cursor-grab": nodesDraggable && !draggingId,
              "cursor-default": !nodesDraggable || draggingId,
            },
          )}
        >
          <FaBook className="text-5xl" />
          <strong className="flex-1 text-2xl break-words text-left leading-10">
            {title}
          </strong>
          {data.onNodeDelete && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300 cursor-pointer"
              type="button"
              onClick={() => handleNodeDelete(data?.id)}
            >
              <FaTrash />
            </button>
          )}
        </div>

        <Reorder.Group
          axis="y"
          className="m-0 p-0 list-none overflow-y-auto overflow-x-hidden scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 bg-transparent"
          style={{
            minHeight: "50px",
            overscrollBehavior: "contain",
          }}
          values={items}
          onReorder={handleReorder}
          onWheel={(e) => e.stopPropagation()}
        >
          {items.map((item) => {
            const isActive = selectedItemId === item.id;
            const isHover = hoverId === item.id;
            const isDragging = draggingId === item.id;

            return (
              <Reorder.Item
                key={item.id}
                className={clsx(
                  "w-full h-[5.2rem] max-h-[5.2rem] border-[1.5px] relative flex gap-3 px-3 group",
                  "transition-all duration-200 ease-in-out",
                  item.checked
                    ? "border-green-400 bg-green-100"
                    : isActive || isHover
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-200 bg-transparent hover:border-blue-300 hover:bg-blue-50",
                  "last:rounded-b-lg text-lg",
                  {
                    "cursor-grab hover:cursor-grab active:cursor-grabbing":
                      !nodesDraggable && !isDragging,
                    "cursor-grabbing shadow-lg z-10": isDragging,
                    "cursor-default": nodesDraggable,
                    "transform scale-[1.02]": isDragging,
                  },
                )}
                dragControls={undefined}
                dragListener={!nodesDraggable}
                initial={{ scale: 1 }}
                style={{ touchAction: "none" }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: isDragging ? 0 : 0.2,
                }}
                value={item}
                whileDrag={{
                  backgroundColor: "#EBF5FF",
                  cursor: "grabbing",
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
                }}
                onDragEnd={handleDragEnd}
                onDragStart={() => handleDragStart(item.id)}
              >
                {/* Start controls */}
                <div className="flex items-center">
                  <div
                    aria-checked={item.checked}
                    className="relative flex items-center justify-center w-10 h-10 cursor-pointer group/checkbox"
                    role="checkbox"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckboxClick(item);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCheckboxClick(item);
                      }
                    }}
                  >
                    <div
                      className={clsx(
                        "absolute w-9 h-9 rounded-full transition-all duration-500 ease-in-out border-[1.5px]",
                        item.checked
                          ? "bg-green-500 border-green-500 scale-100"
                          : "bg-white border-gray-300 scale-95 group-hover/checkbox:border-green-400 group-hover/checkbox:scale-100",
                      )}
                    />
                    <FaCheck
                      className={clsx(
                        "absolute pointer-events-none transition-all duration-500",
                        item.checked
                          ? "opacity-100 scale-100 rotate-0 transform-gpu text-white"
                          : "opacity-0 scale-0 -rotate-180 transform-gpu",
                      )}
                      size={20}
                    />
                  </div>
                </div>

                {/* Text */}
                <div
                  className="w-full h-full py-1.5 flex justify-between items-center gap-4 duration-300"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(item)}
                  onKeyDown={(e) => e.key === "Enter" && handleClick(item)}
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <div className="w-[332px] text-left font-medium flex gap-1 items-center">
                    <div className="flex">{items.indexOf(item) + 1}.&nbsp;</div>
                    <div className="!line-clamp-2 leading-6">{item.title}</div>
                  </div>
                </div>

                {/* End controls */}
                <div className="flex-1 flex items-center gap-3">
                  <button
                    aria-label="Delete item"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 cursor-pointer"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModalItem({
                        id: data?.id,
                        itemId: item.id,
                      });
                    }}
                  >
                    <FaTrash size={24} />
                  </button>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        <Handle position={Position.Bottom} type="source" />
      </div>

      <CommonModal
        actionBtnName="Delete"
        actionBtnProps={{
          color: "danger",
          className: "bg-red-500 hover:bg-red-600",
        }}
        btnProps={{ className: "hidden" }}
        isOpen={deleteModalItem !== null}
        title={
          <div className="grid place-items-center gap-2">
            <CommonPineappleImage />
            <div className="font-medium">
              Are you sure you want to delete this item?
            </div>
            <div className="text-sm text-gray-500">
              This action cannot be undone.
            </div>
          </div>
        }
        onActionClick={handleDeleteConfirm}
        onOpenChange={() => setDeleteModalItem(null)}
      />
    </>
  );
};
