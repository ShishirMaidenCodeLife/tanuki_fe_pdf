"use client";

import MarkdownEditor, { ICommand } from "@uiw/react-markdown-editor";
import { Commands } from "@uiw/react-markdown-editor/cjs/components/ToolBar";

import { useRoadmapStoreHook } from "@/hooks";

// Editor UIW Markdown
export const UiwMdEditor = () => {
  const { md, setMd } = useRoadmapStoreHook();

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
      className="markdown-editor-container w-full h-full"
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
    </div>
  );
};
