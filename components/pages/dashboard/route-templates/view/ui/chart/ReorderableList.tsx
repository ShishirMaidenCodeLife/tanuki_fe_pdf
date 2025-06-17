"use client";

import React from "react";
import { Reorder } from "framer-motion";
import { FaPlus } from "react-icons/fa";

import { ReorderableListProps } from "../../others/types";

import { ReorderableItem } from "./ReorderableItem";

import { checkIfParent } from "@/utils/pages/route-templates/view/utils";
import { ENHANCED_DIMENSIONS } from "@/utils/pages/route-templates/view/constants";

export const ReorderableList: React.FC<ReorderableListProps> = ({
  items,
  nodesDraggable,
  handleReorder,
  globalSelectedItemId,
  nodeId,
  parentId,
  draggingId,
  hoverId,
  editingItemId,
  handleCheckboxClick,
  handleClick,
  setDeleteModalItem,
  handleDragEnd,
  handleDragStart,
  setHoverId,
  onMouseLeave,
  onTextChange,
  onEditStart,
  onEditEnd,
  onAddItem,
}) => {
  // Handle add item for empty nodes
  const handleAddItemForEmpty = () => {
    if (onAddItem) {
      // Create a temporary item ID for adding the first item
      const tempId = `${nodeId}-item-temp-${Date.now()}`;

      onAddItem(tempId);
    }
  };

  return (
    <Reorder.Group
      axis="y"
      className="m-0 p-0 list-none bg-transparent"
      data-reorder-group="true"
      style={{
        minHeight: "50px",
        overscrollBehavior: "contain",
        userSelect: "none", // Always prevent text selection for consistent behavior
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        touchAction: "none", // Improve touch dragging
        position: "relative", // For proper drag positioning
        paddingBottom: `${ENHANCED_DIMENSIONS.LIST_PADDING_BOTTOM}px`,
      }}
      values={items}
      onMouseDown={(e) => {
        // Prevent node drag when interacting with the reorder group
        if (nodesDraggable) {
          e.stopPropagation();
        }
      }}
      onPointerDown={(e) => {
        // Prevent node drag when interacting with the reorder group
        e.stopPropagation();
        e.preventDefault();
      }}
      onReorder={handleReorder}
      onWheel={(e) => e.stopPropagation()}
    >
      {items.length === 0 ? (
        // Show plus icon when no items
        <div
          className="flex items-center justify-center min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer group"
          role="button"
          tabIndex={0}
          onClick={handleAddItemForEmpty}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleAddItemForEmpty();
            }
          }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-blue-600">
            <FaPlus size={ENHANCED_DIMENSIONS.PLUS_ICON_SIZE} />
            <span className="text-lg font-medium">Add your first item</span>
          </div>
        </div>
      ) : (
        items.map((item, index) => (
          <ReorderableItem
            key={item.id}
            isActive={globalSelectedItemId === item.id}
            isChild={checkIfParent(parentId)}
            isDragging={draggingId === item.id}
            isEditing={editingItemId === item.id}
            isHover={hoverId === item.id}
            item={item}
            itemIndex={index}
            nodeId={nodeId || ""}
            nodesDraggable={nodesDraggable}
            onAddItem={onAddItem}
            onCheckboxClick={handleCheckboxClick}
            onClick={handleClick}
            onDelete={(itemId) => setDeleteModalItem({ id: nodeId, itemId })}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onEditEnd={onEditEnd}
            onEditStart={onEditStart}
            onMouseEnter={setHoverId}
            onMouseLeave={onMouseLeave}
            onTextChange={onTextChange}
          />
        ))
      )}
    </Reorder.Group>
  );
};
