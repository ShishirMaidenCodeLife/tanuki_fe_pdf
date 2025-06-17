"use client";

import React from "react";
import clsx from "clsx";
import { FaCheck, FaSquare, FaExternalLinkAlt } from "react-icons/fa";

import { MarkdownTextRendererProps } from "../others/types";

import {
  parseMarkdownText,
  toggleTodoInText,
  normalizeUrl,
  isValidUrl,
} from "@/utils/pages/route-templates/view/utils-md";
import { ParsedText } from "@/utils/pages/route-templates/view/types";

export const MarkdownTextRenderer: React.FC<MarkdownTextRendererProps> = ({
  text,
  className = "",
  onTextChange,
  isEditable = false,
}) => {
  const parsedText: ParsedText = parseMarkdownText(text);

  const handleTodoToggle = (todoIndex: number) => {
    if (onTextChange && isEditable) {
      const newText = toggleTodoInText(text, todoIndex);

      onTextChange(newText);
    }
  };

  const handleLinkClick = (url: string) => {
    if (isValidUrl(url)) {
      const normalizedUrl = normalizeUrl(url);

      window.open(normalizedUrl, "_blank", "noopener,noreferrer");
    }
  };

  let todoCount = 0;

  return (
    <div className={clsx("flex flex-wrap items-center gap-1", className)}>
      {parsedText.elements.map((element, index) => {
        if (element.type === "todo") {
          const currentTodoIndex = todoCount++;

          return (
            <button
              key={`${element.startIndex}-${element.endIndex}-${index}`}
              className={clsx(
                "inline-flex items-center gap-1 px-1 py-0.5 rounded transition-all duration-200",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300",
                isEditable ? "cursor-pointer" : "cursor-default",
                element.checked ? "text-green-600" : "text-gray-500",
              )}
              disabled={!isEditable}
              type="button"
              onClick={() => handleTodoToggle(currentTodoIndex)}
            >
              {element.checked ? (
                <div className="relative">
                  <FaSquare className="text-green-500" size={12} />
                  <FaCheck className="absolute inset-0 text-white" size={8} />
                </div>
              ) : (
                <FaSquare className="text-gray-400" size={12} />
              )}
            </button>
          );
        }

        if (element.type === "link") {
          const isValid = isValidUrl(element.url || "");

          return (
            <button
              key={`${element.startIndex}-${element.endIndex}-${index}`}
              className={clsx(
                "inline-flex items-center gap-1 px-1 py-0.5 rounded underline transition-all duration-200",
                "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300",
                isValid
                  ? "text-blue-600 hover:text-blue-800 cursor-pointer"
                  : "text-red-500 cursor-not-allowed",
              )}
              disabled={!isValid}
              title={isValid ? element.url : "Invalid URL"}
              type="button"
              onClick={() => isValid && handleLinkClick(element.url || "")}
            >
              <span>{element.label}</span>
              {isValid && <FaExternalLinkAlt size={10} />}
            </button>
          );
        }

        // Regular text
        return (
          <span
            key={`${element.startIndex}-${element.endIndex}-${index}`}
            className="inline"
          >
            {element.content}
          </span>
        );
      })}
    </div>
  );
};
