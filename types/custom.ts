export type TspanType = {
  lineText: string;
};

export type WrapTextReturnType = {
  lines: string[];
  text: string;
  tspans: { lineText: string; dy: string }[];
};
