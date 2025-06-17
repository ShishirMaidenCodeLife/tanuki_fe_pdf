import { checkIfParent, checkIfChild } from "./utils";

/**
 * Calculate the position in markdown where a specific node/item starts
 */
export const calculateMarkdownPosition = (
  markdown: string,
  nodeId: string,
  itemId?: string,
): number => {
  const lines = markdown.split("\n");
  let position = 0;
  let currentLineIndex = 0;

  // If editing a parent node's main title
  if (checkIfParent(nodeId) && !itemId) {
    // Find the header line for this parent node
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("##") || line.startsWith("#")) {
        currentLineIndex = i;
        break;
      }
    }

    // Calculate position up to this line
    for (let i = 0; i < currentLineIndex; i++) {
      position += lines[i].length + 1; // +1 for newline
    }

    // Position at start of the title text (after "## ")
    const headerMatch = lines[currentLineIndex].match(/^#+\s*/);

    if (headerMatch) {
      position += headerMatch[0].length;
    }

    return position;
  }

  // If editing an item in a parent node
  if (checkIfParent(nodeId) && itemId) {
    let foundHeader = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // First find the parent header
      if (!foundHeader && (line.startsWith("##") || line.startsWith("#"))) {
        foundHeader = true;
        position += line.length + 1;
        continue;
      }

      if (foundHeader) {
        // Look for the specific item
        if (line.trim().startsWith("-")) {
          // This is a potential match - we need to find the right item
          // For now, position at the start of the item text (after "- ")
          const dashMatch = line.match(/^\s*-\s*/);

          if (dashMatch) {
            return position + dashMatch[0].length;
          }
        }
      }

      position += line.length + 1;
    }
  }

  // If editing a child node item
  if (checkIfChild(nodeId) && itemId) {
    let foundParentItem = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for the parent item first
      if (!foundParentItem && line.trim().startsWith("-")) {
        // Check if this is the parent item we're looking for
        foundParentItem = true;
        position += line.length + 1;
        continue;
      }

      if (foundParentItem) {
        // Look for nested items (indented with spaces)
        if (line.match(/^\s{2,}-/)) {
          // This is a nested item
          const dashMatch = line.match(/^\s*-\s*/);

          if (dashMatch) {
            return position + dashMatch[0].length;
          }
        } else if (line.trim().startsWith("-") || line.trim().startsWith("#")) {
          // We've moved to a new section, stop looking
          break;
        }
      }

      position += line.length + 1;
    }
  }

  // Default to beginning of document if not found
  return 0;
};

/**
 * Find the markdown position for a specific text content being edited
 */
export const findTextPositionInMarkdown = (
  markdown: string,
  textToFind: string,
  nodeId: string,
  itemId?: string,
): number => {
  if (!textToFind.trim()) {
    return calculateMarkdownPosition(markdown, nodeId, itemId);
  }

  // First try to find exact text match
  const exactMatch = markdown.indexOf(textToFind);

  if (exactMatch !== -1) {
    return exactMatch;
  }

  // If exact match not found, fall back to calculated position
  return calculateMarkdownPosition(markdown, nodeId, itemId);
};

/**
 * Get cursor position for when a specific node/item is being edited
 */
export const getCursorPositionForEdit = (
  markdown: string,
  nodeId: string,
  itemId?: string,
  currentText?: string,
): number => {
  if (currentText) {
    return findTextPositionInMarkdown(markdown, currentText, nodeId, itemId);
  }

  return calculateMarkdownPosition(markdown, nodeId, itemId);
};
