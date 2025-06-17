"use client";

import React from "react";
import { FaBook } from "react-icons/fa";
import clsx from "clsx";

import { NodeHeaderProps } from "../../others/types";

import { InlineEditableText } from "./InlineEditableText";

import { checkIfChild } from "@/utils/pages/route-templates/view/utils";
import { ENHANCED_DIMENSIONS } from "@/utils/pages/route-templates/view/constants";

export const NodeHeader: React.FC<NodeHeaderProps> = ({
  title,
  nodeId,
  nodesDraggable,
  draggingId,
  isItemBeingDragged,
  onTitleChange,
}) => {
  const handleTitleChange = (newTitle: string) => {
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-t-lg group flex-shrink-0",
        checkIfChild(nodeId)
          ? "border-dashed border-b-dash-custom bg-blue-300/70 border-gray-400 border-b-[1.5px]"
          : "border-solid bg-blue-500 text-white border-blue-500 border-[1.5px]",
        {
          "cursor-grab": nodesDraggable && !draggingId,
          "cursor-default": !nodesDraggable || draggingId,
        },
      )}
      data-node-header="true"
      draggable={nodesDraggable && !isItemBeingDragged}
      style={{
        minHeight: `${ENHANCED_DIMENSIONS.HEADER_MIN_HEIGHT}px`,
        maxHeight: `${ENHANCED_DIMENSIONS.HEADER_MAX_HEIGHT}px`,
        paddingLeft: `${ENHANCED_DIMENSIONS.HEADER_PADDING_X}px`,
        paddingRight: `${ENHANCED_DIMENSIONS.HEADER_PADDING_X}px`,
        paddingTop: `${ENHANCED_DIMENSIONS.HEADER_PADDING_Y}px`,
        paddingBottom: `${ENHANCED_DIMENSIONS.HEADER_PADDING_Y}px`,
      }}
    >
      <FaBook
        className="flex-shrink-0"
        size={ENHANCED_DIMENSIONS.HEADER_ICON_SIZE}
      />
      <div className="flex-1 h-full text-left break-words overflow-hidden flex items-center">
        <InlineEditableText
          className={clsx(
            ENHANCED_DIMENSIONS.HEADER_TEXT_SIZE,
            "font-bold leading-tight line-clamp-2 text-left w-full",
            checkIfChild(nodeId) ? "text-gray-800" : "text-white",
          )}
          isChildNode={checkIfChild(nodeId)}
          placeholder="Enter node title..."
          text={title}
          onTextChange={handleTitleChange}
        />
      </div>
    </div>
  );
};
