export interface ParsedTextElement {
  type: "text" | "todo" | "link";
  content: string;
  checked?: boolean;
  url?: string;
  label?: string;
  startIndex: number;
  endIndex: number;
}

export interface ParsedText {
  elements: ParsedTextElement[];
  originalText: string;
}
