// Get modified label for display
export const getModifiedLabel = (
  label?: string,
): {
  modifiedText: string;
  modifiedFullText: string;
} => {
  // Initialize variables
  let modifiedText = "";
  let modifiedFullText = "";

  // Validation
  if (!label || typeof label !== "string" || !label.trim()) {
    return { modifiedText, modifiedFullText };
  }

  // Helper function to process text
  const processText = (text: string): string => {
    // const includeIndex = index !== undefined;
    const trimmedText = text.trim();
    const firstLine = trimmedText.split("\n")[0]; // Extract the first line
    // const indexPrefix = includeIndex ? `${(index ?? 0) + 1}. ` : ""; // Add prefix if index is valid
    // return `${indexPrefix}${firstLine}`;

    return `${firstLine}`;
  };

  // Generate modified texts
  modifiedText = processText(label).slice(0, 10); // Limit to 10 characters
  modifiedFullText = processText(label); // Full first line with prefix

  return { modifiedText, modifiedFullText };
};
