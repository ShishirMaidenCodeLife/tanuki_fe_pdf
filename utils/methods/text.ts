import { D3SelectionAllType, WrapTextReturnType } from "@/types";

// Wrap text based on the number of lines
export const wrapText = (
  textElement: D3SelectionAllType,
  text: string | undefined,
  maxWidth = 160,
  maxLines = 5,
): WrapTextReturnType => {
  // Clear existing tspans to prevent duplication
  textElement.selectAll("tspan").remove();

  // Return early if text is invalid
  if (!text || typeof text !== "string") {
    console.warn("warn", "Invalid or undefined text passed to wrapText");

    return { lines: [], text: "", tspans: [] };
  }

  const words = text.split(/\s+/); // Split text into words
  let lines: string[] = [];
  let lineNumber = 0;
  const tspans: { lineText: string; dy: string }[] = []; // Cache tspans to minimize DOM updates

  // const fontSize = 16; // Use the font size in pixels for monospace (adjust as needed)
  const charWidth = 8; // Estimated width of one character in pixels (adjust for your font)

  // let currentLineWidth = 0; // Track the current line width

  words.forEach((word) => {
    lines.push(word);
    // Calculate the width of the line based on number of characters
    const lineWidth = lines.join(" ").length * charWidth;

    // Check if the current line exceeds maxWidth
    if (lineWidth > maxWidth) {
      // Remove the last word from the current line
      lines.pop();
      const lineText = lines.join(" ");

      // Cache the current line
      tspans.push({ lineText, dy: `${lineNumber === 0 ? "1em" : "1.2em"}` });

      // Start a new line with the current word
      lines = [word];
      lineNumber++;

      // Stop if maxLines is exceeded
      if (lineNumber >= maxLines) {
        const ellipsis = "...";
        let truncatedLine = lineText;

        // Truncate line to fit within maxWidth
        while (
          truncatedLine.length > 0 &&
          truncatedLine.length * charWidth > maxWidth
        ) {
          truncatedLine = truncatedLine.slice(0, -1);
        }

        tspans[tspans.length - 1].lineText = truncatedLine + ellipsis;
        lines = [];

        return;
      }
    }
  });

  // Handle the last line if it doesn't exceed maxWidth
  if (lines.length > 0 && lineNumber < maxLines) {
    tspans.push({
      lineText: lines.join(" "),
      dy: `${lineNumber === 0 ? "1em" : "1.2em"}`,
    });
  }

  // Append all tspans in a single operation to minimize reflows
  tspans.forEach(({ lineText, dy }) => {
    textElement.append("tspan").attr("x", 0).attr("dy", dy).text(lineText);
  });

  return { lines, text, tspans };
};
