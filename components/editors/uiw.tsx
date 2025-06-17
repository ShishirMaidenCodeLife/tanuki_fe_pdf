"use client";

import MarkdownEditor, { ICommand } from "@uiw/react-markdown-editor";
import { Commands } from "@uiw/react-markdown-editor/cjs/components/ToolBar";
import { useCallback, useEffect, useRef, useState } from "react";

import { useRoadmapStoreHook } from "@/hooks";
import { MaxCharacterError } from "@/components/pages/dashboard/route-templates/view/others/errors";
import { MAX_CHARACTERS } from "@/utils/pages/route-templates/view/constants";
import {
  MdValidationResult,
  validateMdCharLimits,
} from "@/utils/methods/md_editor";

// Editor UIW Markdown
export const UiwMdEditor = () => {
  const { md, setMd } = useRoadmapStoreHook();
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [errorPositions, setErrorPositions] = useState<{
    [key: string]: number;
  }>({});

  const [validationResult, setValidationResult] = useState<MdValidationResult>({
    isValid: true,
    errors: [],
    exceededItems: [],
  });

  // Helper function to get line height and calculate error position with scroll offset
  const getErrorPosition = useCallback(
    (lineNumber: number, offset = 80) => {
      const container = editorContainerRef.current;

      if (!container) {
        // Fallback calculation
        return lineNumber * 24 + offset - scrollTop;
      }

      // Try to get the exact position from CodeMirror
      const cmContent = container.querySelector(".cm-content");
      const cmLines = container.querySelectorAll(".cm-line");

      // Account for 0-based vs 1-based indexing (lineNumber is 1-based)
      const lineIndex = Math.max(0, lineNumber - 1);

      if (cmLines.length > lineIndex && cmContent) {
        const targetLine = cmLines[lineIndex] as HTMLElement;
        const editorRect = container.getBoundingClientRect();
        const lineRect = targetLine.getBoundingClientRect();

        // Calculate position relative to the editor container
        const relativeTop = lineRect.top - editorRect.top;

        return relativeTop + offset;
      }

      // Fallback: calculate based on estimated line height
      let lineHeight = 24;

      if (cmLines.length > 0) {
        const firstLine = cmLines[0] as HTMLElement;

        const computedStyle = window.getComputedStyle(firstLine);

        lineHeight = parseFloat(computedStyle.lineHeight) || 24;
      }

      // Adjust for 1-based line numbers and improve accuracy
      return (lineNumber - 1) * lineHeight + offset;
    },
    [scrollTop],
  );

  // Function to update error positions
  const updateErrorPositions = useCallback(() => {
    if (!validationResult.exceededItems.length) return;

    const newPositions: { [key: string]: number } = {};

    validationResult.exceededItems.forEach((error, index) => {
      const key = `error-${error.lineNumber}-${index}`;

      newPositions[key] = getErrorPosition(error.lineNumber);
    });

    setErrorPositions(newPositions);
  }, [validationResult.exceededItems, scrollTop, getErrorPosition]);

  // Update positions when validation results or scroll changes
  useEffect(() => {
    updateErrorPositions();
  }, [updateErrorPositions]);

  // Debounced validation to prevent too frequent updates
  const validateContent = useCallback((content: string) => {
    const result = validateMdCharLimits(content, MAX_CHARACTERS);

    setValidationResult(result);
  }, []);

  // Debounce validation calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateContent(md);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [md, validateContent]);

  // Minimal word wrap enforcement - CSS does most of the work
  useEffect(() => {
    if (!editorContainerRef.current) return;

    // Single application on mount with delay to ensure CodeMirror is ready
    const timer = setTimeout(() => {
      const container = editorContainerRef.current;

      if (!container) return;

      // Apply to container only, CSS handles the rest
      const editor = container.querySelector(".cm-editor");

      if (editor) {
        (editor as HTMLElement).style.overflowX = "hidden";

        // Try to access the CodeMirror instance for scroll handling
        const codeMirrorElement = container.querySelector(".cm-scroller");

        if (codeMirrorElement) {
          // Add scroll event listener to track scroll position
          const handleScroll = () => {
            setScrollTop(codeMirrorElement.scrollTop);
          };

          codeMirrorElement.addEventListener("scroll", handleScroll);

          // Store reference for cleanup
          editorInstanceRef.current = {
            scrollElement: codeMirrorElement,
            handleScroll,
          };
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      // Cleanup scroll listener
      if (editorInstanceRef.current) {
        const { scrollElement, handleScroll } = editorInstanceRef.current;

        if (scrollElement && handleScroll) {
          scrollElement.removeEventListener("scroll", handleScroll);
        }
      }
    };
  }, []);

  // On editor change
  const handleEditorChange = (value?: string) => {
    if (typeof value === "string") {
      // Normalize the value to update only children starting with `-`
      const normalizedValue = value
        .split("\n")
        .map((line) => {
          if (line.trim().startsWith("-")) {
            // Calculate the number of spaces before the `-`
            const spaceCount = line.match(/^\s*/)?.[0].length || 0;

            // Replace the leading spaces with the same number of spaces before the `-`
            return `${" ".repeat(spaceCount)}${line.trim()}`;
          } else {
            return line;
          }
        })
        .join("\n");

      // Debugs
      // console.log("Debug: normalizedValue", normalizedValue);

      setMd(normalizedValue);
    }
  };

  return (
    <div
      ref={editorContainerRef}
      className="markdown-editor-container w-full h-full relative"
      data-color-mode="light"
    >
      <MarkdownEditor
        className="absolute overflow-y-auto shadow-none main-markdown-editor transition-all ease-in-out bg-transparent"
        enablePreview={false}
        // style={{ width: mdWidth }}
        toolbarsFilter={(tool: Commands) => {
          return ["undo", "redo"]?.includes((tool as ICommand)?.name || "");
        }}
        value={md}
        onChange={handleEditorChange}
      />

      {/* Character limit validation errors */}
      {!validationResult.isValid &&
        validationResult.exceededItems.length > 0 && (
          <>
            {validationResult.exceededItems.map((error, index) => {
              const errorKey = `error-${error.lineNumber}-${index}`;
              const topPosition =
                errorPositions[errorKey] || getErrorPosition(error.lineNumber);

              return (
                <div
                  key={errorKey}
                  className="absolute bg-blue-400 w-full left-[32px] z-[9998]"
                  style={{
                    top: `${topPosition}px`,
                    transform: "translateY(-50%)",
                  }}
                >
                  <MaxCharacterError isCursor showError extendCss="text-sm" />
                </div>
              );
            })}

            {/* Top-level error banner for multiple errors */}
            {/* {validationResult.exceededItems.length > 1 && (
              <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-sm px-3 py-2 z-[9999] flex items-center gap-2">
                <span className="text-sm">⚠️</span>
                <span className="font-medium">
                  {validationResult.exceededItems.length} items exceed max 80
                  characters
                </span>
              </div>
            )} */}
          </>
        )}
    </div>
  );
};
