import { marked, Tokens } from "marked";

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
