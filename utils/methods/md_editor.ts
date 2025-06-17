import { marked, Tokens } from "marked";

// Validation interfaces for markdown character limits
export interface MdValidationError {
  lineNumber: number;
  startPosition: number;
  endPosition: number;
  type:
    | "h1-heading"
    | "h2-heading"
    | "numbered-item"
    | "list-item"
    | "numbered-sub-item"
    | "sub-item";
  nodeTitle: string;
  itemTitle: string;
  length: number;
  maxLength: number;
}

export interface MdValidationResult {
  isValid: boolean;
  errors: string[];
  exceededItems: MdValidationError[];
}

// Validates markdown content against character limits
export const validateMdCharLimits = (
  content: string,
  maxCharacters: number = 80,
): MdValidationResult => {
  const result: MdValidationResult = {
    isValid: true,
    errors: [],
    exceededItems: [],
  };

  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Check H1 headings (# Main Title)
    if (trimmedLine.startsWith("# ")) {
      const title = trimmedLine.substring(2);

      if (title.length > maxCharacters) {
        result.exceededItems.push({
          lineNumber: index + 1,
          startPosition: 0,
          endPosition: line.length,
          type: "h1-heading",
          nodeTitle: title,
          itemTitle: title,
          length: title.length,
          maxLength: maxCharacters,
        });
      }
    }

    // Check H2 headings (## Node Title)
    if (trimmedLine.startsWith("## ")) {
      const nodeTitle = trimmedLine.substring(3);

      if (nodeTitle.length > maxCharacters) {
        result.exceededItems.push({
          lineNumber: index + 1,
          startPosition: 0,
          endPosition: line.length,
          type: "h2-heading",
          nodeTitle,
          itemTitle: nodeTitle,
          length: nodeTitle.length,
          maxLength: maxCharacters,
        });
      }
    }

    // Check numbered list items (1. Item text, 2. Item text, etc.)
    if (trimmedLine.match(/^\d+\.\s/)) {
      const itemText = trimmedLine.replace(/^\d+\.\s/, "");

      if (itemText.length > maxCharacters) {
        result.exceededItems.push({
          lineNumber: index + 1,
          startPosition: 0,
          endPosition: line.length,
          type: "numbered-item",
          nodeTitle: "",
          itemTitle: itemText,
          length: itemText.length,
          maxLength: maxCharacters,
        });
      }
    }

    // Check list items (- Item text)
    if (trimmedLine.startsWith("- ")) {
      const itemText = trimmedLine.substring(2);

      if (itemText.length > maxCharacters) {
        result.exceededItems.push({
          lineNumber: index + 1,
          startPosition: 0,
          endPosition: line.length,
          type: "list-item",
          nodeTitle: "",
          itemTitle: itemText,
          length: itemText.length,
          maxLength: maxCharacters,
        });
      }
    }

    // Check sub-items with numbered lists (  1. Sub item text)
    if (trimmedLine.match(/^\s{2,}\d+\.\s/)) {
      const itemText = trimmedLine.replace(/^\s*\d+\.\s/, "");

      if (itemText.length > maxCharacters) {
        result.exceededItems.push({
          lineNumber: index + 1,
          startPosition: 0,
          endPosition: line.length,
          type: "numbered-sub-item",
          nodeTitle: "",
          itemTitle: itemText,
          length: itemText.length,
          maxLength: maxCharacters,
        });
      }
    }

    // Check sub-items (  - Sub item text)
    if (trimmedLine.match(/^\s{2,}- /)) {
      const itemText = trimmedLine.replace(/^\s*- /, "");

      if (itemText.length > maxCharacters) {
        result.exceededItems.push({
          lineNumber: index + 1,
          startPosition: 0,
          endPosition: line.length,
          type: "sub-item",
          nodeTitle: "",
          itemTitle: itemText,
          length: itemText.length,
          maxLength: maxCharacters,
        });
      }
    }
  });

  result.isValid = result.exceededItems.length === 0;

  if (!result.isValid) {
    if (result.exceededItems.length === 1) {
      const item = result.exceededItems[0];

      result.errors.push(`Max 80 characters (currently ${item.length})`);
    } else {
      result.errors.push(
        `${result.exceededItems.length} items exceed max 80 characters`,
      );
    }
  }

  return result;
};

// Converts the Markdown string into an array of token objects
export const markdownToJSON = (md: string): Tokens.Generic[] => {
  return marked.lexer(md);
};

// Convert md file to a one-line string export
export const convertMdToString = (content: string): string => {
  const result = content.replace(/\r?\n|\r/g, " "); // Replace newlines with spaces

  // Error validation for mdToJson
  if (!result) {
    throw new Error("Invalid markdown format");
  }

  return result;
};

export const convertToMarkdown = (responseText: string) => {
  // Regular expression to match each section and its items
  const sectionRegex = /(\d+\.\s[^\n]+)\n((?:\s+- .+\n)+)/g;

  let markdownContent = "";

  // Match all sections and iterate over them
  let match;

  while ((match = sectionRegex.exec(responseText)) !== null) {
    const sectionTitle = match[1].trim(); // Section heading (e.g., "1. Python Basics")
    const subItems = match[2].trim(); // Sub-items list (e.g., "- Syntax and Semantics")

    // Format the section and its sub-items
    markdownContent += `\n${sectionTitle}\n`;

    // Format each sub-item under the section
    const formattedSubItems = subItems
      .split("\n")
      .map((item) => `    - ${item.trim().replace(/^- /, "")}`) // Ensure proper indentation and remove leading "- "
      .join("\n");

    markdownContent += formattedSubItems + "\n";
  }

  return markdownContent;

  // Wrap everything in a template string with "export const"
  // return `export const uiwMarkdownContent = \`\n${markdownContent}\`;`;
};
