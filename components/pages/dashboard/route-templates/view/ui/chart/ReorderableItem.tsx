"use client";

import clsx from "clsx";
import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { FaCheck, FaTrash, FaGripVertical, FaPlus } from "react-icons/fa";

import { ReorderableItemProps } from "../../others/types";

import { InlineEditableText } from "./InlineEditableText";

import { ENHANCED_DIMENSIONS } from "@/utils/pages/route-templates/view/constants";

export const ReorderableItem: React.FC<ReorderableItemProps> = ({
  isActive,
  isChild,
  isDragging,
  isEditing = false,
  isHover,
  item,
  itemIndex,
  nodeId,
  nodesDraggable: _nodesDraggable,
  onAddItem,
  onCheckboxClick,
  onClick,
  onDelete,
  onDragEnd,
  onDragStart,
  onMouseEnter,
  onMouseLeave,
  onTextChange,
  onEditStart,
  onEditEnd,
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      key={item.id}
      className={clsx(
        "w-full border-[1.5px] relative flex gap-3 group",
        // Reduce transition duration during drag for smoother movement
        isDragging
          ? "transition-none"
          : "transition-all duration-200 ease-in-out",
        isDragging
          ? "border-blue-400 bg-blue-50 shadow-xl"
          : item.checked
            ? "border-green-400 bg-green-100"
            : isActive && !isChild // Only highlight in parent nodes
              ? "border-blue-500 bg-blue-100 shadow-md ring-2 ring-blue-200"
              : isHover && !isChild // Only hover highlight in parent nodes
                ? "border-blue-400 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-transparent hover:border-blue-300 hover:bg-blue-50",
        "last:rounded-b-lg",
        {
          "cursor-pointer": !isDragging, // Make the entire item clickable
          "cursor-grabbing shadow-lg z-50": isDragging,
          "select-none": true, // Always prevent text selection
        },
      )}
      data-reorder-item="true"
      dragControls={dragControls}
      dragListener={false}
      initial={{ scale: 1 }}
      role="button"
      style={{
        touchAction: "none",
        minHeight: `${ENHANCED_DIMENSIONS.ITEM_MIN_HEIGHT}px`,
        maxHeight: `${ENHANCED_DIMENSIONS.ITEM_MAX_HEIGHT}px`,
        paddingLeft: `${ENHANCED_DIMENSIONS.ITEM_PADDING_X}px`,
        paddingRight: `${ENHANCED_DIMENSIONS.ITEM_PADDING_X}px`,
        paddingTop: `${ENHANCED_DIMENSIONS.ITEM_PADDING_Y}px`,
        paddingBottom: `${ENHANCED_DIMENSIONS.ITEM_PADDING_Y}px`,
      }}
      tabIndex={0}
      transition={
        isDragging
          ? { type: "tween", duration: 0 } // No transition during drag for instant response
          : { type: "tween", duration: 0.15 }
      }
      value={item}
      whileDrag={{
        scale: 1.01,
        cursor: "grabbing",
        zIndex: 1000,
      }}
      onClick={() => onClick(item)}
      onDragEnd={onDragEnd}
      onDragStart={() => onDragStart(item.id)}
      onKeyDown={(e) => e.key === "Enter" && onClick(item)}
      onMouseDown={(e) => {
        // Always prevent React Flow from handling mouse events on items
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseEnter={() => onMouseEnter(item.id)}
      onMouseLeave={onMouseLeave}
      onPointerDown={(e) => {
        // Prevent React Flow from handling pointer events on items
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        // Prevent React Flow from handling touch events on items
        e.stopPropagation();
      }}
    >
      {/* Professional Add Item Button - positioned outside bottom-right with enhanced animations */}
      <div className="absolute -bottom-2 -right-5 z-20">
        <button
          aria-label="Add item below"
          className={clsx(
            "group/btn relative w-12 h-12 rounded-full",
            "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
            "text-white shadow-lg backdrop-blur-sm",
            "border-2 border-white/95",
            "opacity-0 group-hover:opacity-90 hover:opacity-100",
            "transition-all duration-500 ease-out",
            "hover:scale-[1.35] hover:shadow-2xl hover:shadow-blue-500/30",
            "hover:border-white hover:rotate-90",
            "active:scale-[1.15] active:transition-none",
            "flex items-center justify-center",
            "focus:outline-none focus:ring-3 focus:ring-blue-400/50 focus:ring-offset-2",
            "before:absolute before:inset-0 before:rounded-full",
            "before:bg-gradient-to-br before:from-white/25 before:to-transparent",
            "before:opacity-0 before:transition-all before:duration-400",
            "hover:before:opacity-100 hover:before:scale-110",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-gradient-to-br after:from-blue-400 after:via-blue-500 after:to-indigo-500",
            "after:opacity-0 after:transition-all after:duration-300",
            "hover:after:opacity-100 hover:after:scale-105",
            "overflow-hidden",
            "cursor-pointer", // Explicit cursor pointer to override parent styles
          )}
          style={{
            transform: "scale(1) rotate(0deg)",
            transformOrigin: "center",
          }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddItem(item.id);
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(1.15) rotate(90deg)";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.35) rotate(90deg)";
            e.currentTarget.style.boxShadow =
              "0 25px 50px -12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            e.currentTarget.style.boxShadow =
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1.35) rotate(90deg)";
          }}
        >
          <FaPlus
            className={clsx(
              "relative z-10 drop-shadow-sm transition-all duration-300 ease-out",
              "group-hover/btn:drop-shadow-md",
            )}
            size={16}
          />
        </button>
      </div>
      {/* Start controls - Fixed width for consistent layout */}
      <div className="flex items-center w-10 flex-shrink-0">
        {isChild && (
          <div
            aria-checked={item.checked}
            className="relative flex items-center justify-center w-10 h-10 cursor-pointer group/checkbox"
            role="checkbox"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onCheckboxClick(item);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onCheckboxClick(item);
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
        )}
      </div>

      {/* Text - Fixed width to prevent layout shift */}
      <div className="flex-1 h-full py-1.5 flex items-center gap-4 duration-300 min-w-0">
        <div className="flex-1 text-left font-medium flex gap-1 items-center min-w-0">
          <div
            className={clsx(
              "flex-shrink-0",
              ENHANCED_DIMENSIONS.ITEM_TEXT_SIZE,
            )}
          >
            {itemIndex + 1}.&nbsp;
          </div>
          <InlineEditableText
            className={clsx(
              "flex-1 min-w-0 text-left",
              ENHANCED_DIMENSIONS.ITEM_TEXT_SIZE,
            )}
            isChildNode={true}
            isEditing={isEditing}
            itemId={item.id}
            nodeId={nodeId}
            placeholder="Enter item title..."
            text={item.title || ""}
            onEditEnd={onEditEnd}
            onEditStart={onEditStart}
            onTextChange={(newText) => onTextChange(item.id, newText)}
          />
        </div>
      </div>

      {/* End controls - Fixed width to prevent icon displacement */}
      <div className="flex items-center gap-2 justify-end w-20 flex-shrink-0">
        <div
          aria-label="Drag handle"
          className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity cursor-pointer hover:cursor-pointer text-gray-600 hover:text-gray-800 p-1"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              // Keyboard users can't perform drag operations, so we skip this
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            dragControls.start(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <FaGripVertical size={ENHANCED_DIMENSIONS.DRAG_ICON_SIZE} />
        </div>
        <button
          aria-label="Delete item"
          className={clsx(
            "opacity-0 group-hover:opacity-100 transition-all duration-200",
            "hover:text-red-500 hover:bg-red-50 cursor-pointer text-gray-600",
            "p-2 rounded-md hover:scale-110 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1",
            "transform transition-transform ease-in-out",
          )}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <FaTrash size={ENHANCED_DIMENSIONS.DELETE_ICON_SIZE} />
        </button>
      </div>
    </Reorder.Item>
  );
};
