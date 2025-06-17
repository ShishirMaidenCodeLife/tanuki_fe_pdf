import clsx from "clsx";
import React from "react";

export const CharacterCountInfo = ({
  length,
  maxLength = 80,
  className = "",
}: {
  className?: string;
  length: number;
  maxLength?: number;
}) => {
  return (
    <div
      className={
        className ||
        clsx(
          "absolute bottom-2 right-2 text-xs px-2 py-1 rounded-md shadow-md font-medium",
          length > maxLength
            ? "bg-red-500 text-white"
            : "bg-blue-100 text-blue-700",
          // : isChildNode
          //   ? "bg-blue-100 text-blue-700"
          //   : "bg-white/20 text-white",
        )
      }
    >
      {length}/{maxLength}
    </div>
  );
};

export const ClickToEditInfo = ({
  isOpen,
  className,
}: {
  isOpen?: boolean;
  className?: string;
}) => {
  return (
    <>
      {isOpen && (
        <div
          className={
            className ||
            "absolute -top-9 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-90 z-50 whitespace-nowrap"
          }
        >
          Click to edit
        </div>
      )}
    </>
  );
};
