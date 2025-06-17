// Utility functions for parsing and handling markdown-style features in route template nodes

import { ParsedText, ParsedTextElement } from "./types";

/**
 * Parse text for markdown-style elements: todo checkboxes [ ] [x] and links [label](url)
 */
export function parseMarkdownText(text: string): ParsedText {
  const elements: ParsedTextElement[] = [];
  let currentIndex = 0;

  // Regex patterns
  const todoPattern = /\[([ x])\]/g;
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  // Find all matches and sort by position
  const allMatches: Array<{
    match: RegExpExecArray;
    type: "todo" | "link";
  }> = [];

  let match;

  // Find todo matches
  while ((match = todoPattern.exec(text)) !== null) {
    allMatches.push({ match, type: "todo" });
  }

  // Find link matches
  while ((match = linkPattern.exec(text)) !== null) {
    allMatches.push({ match, type: "link" });
  }

  // Sort matches by position
  allMatches.sort((a, b) => a.match.index - b.match.index);

  // Process text between matches
  allMatches.forEach(({ match, type }) => {
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;

    // Add text before this match
    if (currentIndex < matchStart) {
      const textContent = text.slice(currentIndex, matchStart);

      if (textContent.trim()) {
        elements.push({
          type: "text",
          content: textContent,
          startIndex: currentIndex,
          endIndex: matchStart,
        });
      }
    }

    // Add the special element
    if (type === "todo") {
      elements.push({
        type: "todo",
        content: match[0],
        checked: match[1] === "x",
        startIndex: matchStart,
        endIndex: matchEnd,
      });
    } else if (type === "link") {
      elements.push({
        type: "link",
        content: match[0],
        label: match[1],
        url: match[2],
        startIndex: matchStart,
        endIndex: matchEnd,
      });
    }

    currentIndex = matchEnd;
  });

  // Add remaining text
  if (currentIndex < text.length) {
    const textContent = text.slice(currentIndex);

    if (textContent.trim()) {
      elements.push({
        type: "text",
        content: textContent,
        startIndex: currentIndex,
        endIndex: text.length,
      });
    }
  }

  // If no special elements found, treat entire text as plain text
  if (elements.length === 0 && text.trim()) {
    elements.push({
      type: "text",
      content: text,
      startIndex: 0,
      endIndex: text.length,
    });
  }

  return {
    elements,
    originalText: text,
  };
}

/**
 * Toggle a todo checkbox in text and return the updated text
 */
export function toggleTodoInText(text: string, todoIndex: number): string {
  const todos = Array.from(text?.matchAll(/\[([ x])\]/g) || []);

  if (todoIndex >= 0 && todoIndex < todos.length) {
    const todo = todos[todoIndex];
    const isChecked = todo[1] === "x";
    const newCheckbox = isChecked ? "[ ]" : "[x]";

    return (
      text.slice(0, todo.index) +
      newCheckbox +
      text.slice(todo.index + todo[0].length)
    );
  }

  return text;
}

/**
 * Validate if a URL is properly formatted
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);

    return true;
  } catch {
    // Try with https:// prefix if it doesn't start with a protocol
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      try {
        new URL(`https://${url}`);

        return true;
      } catch {
        return false;
      }
    }

    return false;
  }
}

/**
 * Normalize URL by adding https:// if no protocol is specified
 */
export function normalizeUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

/**
 * Count the display characters (excluding markdown syntax URLs)
 * For validation purposes, only count text that will be visible to the user
 */
export function countDisplayCharacters(text: string): number {
  const parsed = parseMarkdownText(text);
  let count = 0;

  parsed.elements.forEach((element) => {
    if (element.type === "text") {
      count += element.content.length;
    } else if (element.type === "todo") {
      // Todo checkboxes don't count toward character limit
      count += 0;
    } else if (element.type === "link") {
      // Only count the label text, not the URL
      count += element.label?.length || 0;
    }
  });

  return count;
}
