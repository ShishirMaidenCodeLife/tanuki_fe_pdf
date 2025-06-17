"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

import { InlineEditableTextProps } from "../../others/types";
import { MaxCharacterError } from "../../others/errors";
import { CharacterCountInfo, ClickToEditInfo } from "../../others/infos";

import { MarkdownTextRenderer } from "../MarkdownTextRenderer";

import { MAX_CHARACTERS } from "@/utils/pages/route-templates/view/constants";

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  text,
  className = "",
  onTextChange,
  placeholder = "Enter text...",
  isDisabled = false,
  isEditing: externalIsEditing,
  isChildNode = false,
  nodeId,
  itemId,
  onEditStart,
  onEditEnd,
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEditHint, setShowEditHint] = useState(false);
  const [showError, setShowError] = useState(false);

  // Use external editing state if provided, otherwise use internal state
  const isEditing =
    externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  useEffect(() => {
    setEditingText(text);
  }, [text]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;

      textarea.focus();
      // Position cursor at the end of the text instead of selecting all
      requestAnimationFrame(() => {
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length,
        );
        // Auto-resize textarea height based on content
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      });
    }
  }, [isEditing]);
  const handleStartEdit = () => {
    if (isDisabled) return;

    // If we're using external state control, notify parent instead of changing local state
    if (externalIsEditing !== undefined) {
      if (onEditStart) {
        onEditStart(nodeId, itemId, text);
      }
    } else {
      setInternalIsEditing(true);
      if (onEditStart) {
        onEditStart(nodeId, itemId, text);
      }
    }

    setEditingText(text);
  };

  const handleSaveEdit = () => {
    const trimmedText = editingText.trim();

    if (trimmedText !== text) {
      onTextChange(trimmedText);
    }

    // If using external state control, notify parent to end editing
    if (externalIsEditing !== undefined) {
      if (onEditEnd) {
        onEditEnd();
      }
    } else {
      setInternalIsEditing(false);
    }

    setShowEditHint(false);
  };

  const handleCancelEdit = () => {
    setEditingText(text);

    // If using external state control, notify parent to end editing
    if (externalIsEditing !== undefined) {
      if (onEditEnd) {
        onEditEnd();
      }
    } else {
      setInternalIsEditing(false);
    }

    setShowEditHint(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      handleCancelEdit();
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't interfere with natural cursor positioning
  };

  const handleTextareaDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Allow double-click to select all text
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    // Prevent typing beyond 80 characters
    if (newText.length > MAX_CHARACTERS) {
      setShowError(true);

      // Don't update the editing text or parent component if over limit
      return;
    }

    setShowError(false);
    // Always update the editing text for visual feedback
    setEditingText(newText);

    // Live editing: Update immediately as user types for better UX
    onTextChange(newText.trim());
  };

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Single click to start editing for better UX
    handleStartEdit();
  };

  const handleTextDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Double-click should also start editing if not already editing
    if (!isEditing) {
      handleStartEdit();
    }
  };

  const handleTextareaBlur = () => {
    // Save immediately on blur
    handleSaveEdit();
  };

  if (isEditing) {
    return (
      <div className="relative w-full flex items-center justify-center">
        <textarea
          ref={textareaRef}
          className={clsx(
            "w-full resize-none text-left",
            "focus:outline-none focus:ring-2",
            "overflow-y-auto leading-relaxed",
            "flex items-center",
            "focus:ring-opacity-50",
            "px-4 py-3 rounded-lg shadow-sm",
            showError && "focus:border-red-500 focus:ring-red-500/30",
            // Different styling based on whether it's a child node or header
            isChildNode
              ? [
                  "text-xl font-semibold",
                  "bg-white border-2 border-blue-400",
                  !showError && "focus:border-blue-600 focus:ring-blue-200",
                  "text-gray-800 placeholder-gray-500",
                  "shadow-md", // Add subtle shadow
                ]
              : [
                  "text-3xl font-bold",
                  // Header (blue background) - enhanced styling
                  "bg-white/10 backdrop-blur-sm", // Subtle background with blur
                  "border-2 border-white/50",
                  !showError && "focus:border-white focus:ring-white/30",
                  "text-white placeholder-white/80",
                  "shadow-lg", // Stronger shadow for headers
                ],

            className,
          )}
          placeholder={placeholder}
          style={{
            minHeight: isChildNode ? "120px" : "160px", // Set minimum heights for visual consistency
            height: "auto",
            resize: "none",
            overflow: "hidden",
            lineHeight: "1.4", // Better line height for readability
            paddingBottom: "32px", // Add bottom padding to prevent overlap with counters
          }}
          value={editingText}
          onBlur={handleTextareaBlur}
          onChange={(e) => {
            handleTextChange(e);
            // Auto-resize textarea height based on content
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight + 32, isChildNode ? 152 : 192)}px`; // Account for bottom padding
            }
          }}
          onClick={handleInputClick}
          onDoubleClick={handleTextareaDoubleClick}
          onKeyDown={handleKeyDown}
        />
        <MaxCharacterError showError={showError} />
        <CharacterCountInfo
          length={editingText.length}
          maxLength={MAX_CHARACTERS}
        />
      </div>
    );
  }

  const truncatedText = text || placeholder;
  const isTextTruncated = truncatedText.length > 40; // Estimate for 2 lines at typical width

  return (
    <div
      className={clsx(
        "relative cursor-text group/editable w-full h-full flex items-center justify-start", // Ensure full height and center vertically
        !isDisabled &&
          (isChildNode
            ? "hover:bg-gray-100/50 hover:rounded-lg transition-colors duration-200"
            : "hover:bg-white/10 hover:rounded-lg transition-colors duration-200"),
        className,
      )}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      title={isTextTruncated ? text : undefined}
      onClick={handleTextClick}
      onDoubleClick={handleTextDoubleClick}
      onKeyDown={(e) => {
        if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          e.stopPropagation();
          handleStartEdit();
        }
      }}
      onMouseEnter={() => !isDisabled && setShowEditHint(true)}
      onMouseLeave={() => setShowEditHint(false)}
    >
      <div
        className={clsx(
          "line-clamp-2 leading-relaxed px-4 py-2 text-left overflow-hidden break-words w-full",
          "flex items-center min-h-full",
          isChildNode
            ? "text-xl font-semibold text-gray-800"
            : "text-3xl font-bold",
        )}
        style={{
          minHeight: isChildNode ? "120px" : "160px",
          lineHeight: "1.4",
        }}
      >
        <MarkdownTextRenderer
          className="w-full"
          isEditable={!isDisabled}
          text={truncatedText}
          onTextChange={onTextChange}
        />
      </div>

      <ClickToEditInfo isOpen={showEditHint && !isDisabled} />

      {!isDisabled && (
        <div
          className={clsx(
            "absolute inset-0 opacity-0 group-hover/editable:opacity-10 rounded transition-opacity pointer-events-none",
            isChildNode ? "bg-gray-800" : "bg-white",
          )}
        />
      )}
    </div>
  );
};
