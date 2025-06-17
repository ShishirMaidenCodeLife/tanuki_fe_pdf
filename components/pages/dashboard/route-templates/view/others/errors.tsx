import clsx from "clsx";

export const MaxCharacterError = ({
  extendCss = "text-lg",
  className = clsx(
    "absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md shadow-lg z-50 flex items-center gap-1 animate-pulse",
    extendCss,
  ),
  cursorClassName = "w-4 h-4 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-red-500",
  cursorPositionCss = "absolute -top-4 left-1/2 transform -translate-x-1/2",
  maxLength = 80,
  showError = false,
  isCursor = false,
}: {
  className?: string;
  extendCss?: string;
  cursorPositionCss?: string;
  cursorClassName?: string;
  maxLength?: number;
  showError?: boolean;
  isCursor?: boolean;
}) => {
  return (
    <>
      {showError && (
        <div className={className}>
          <>
            {/* Arrow/cursor pointing up */}
            {isCursor && (
              <div className={cursorPositionCss}>
                <div className={cursorClassName} />
              </div>
            )}
          </>
          <span className="text-sm">⚠️</span>
          <span className="font-medium">Max {maxLength} chars</span>
        </div>
      )}
    </>
  );
};

// export const MaxCharacterError = ({
//   className = "",
//   maxLength = 80,
//   showError,
//   isCursor = false,
//   cursorClassName = "absolute -top-2 left-1/2 transform -translate-x-1/2",
// }: {
//   className?: string;
//   maxLength?: number;
//   showError?: boolean;
//   isCursor?: boolean;
// }) => {
//   return (
//     <>
//       {showError && (
//         <>
//           {/* Arrow/cursor pointing up */}
//           {isCursor && (
//             <div className={cursorClassName}>
//               <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-red-500" />
//             </div>
//           )}

//           <div
//             className={
//               className ||
//               "absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-lg z-50 flex items-center gap-1 animate-pulse"
//             }
//           >
//             <span className="text-sm">⚠️</span>
//             <span className="font-medium">Max {maxLength} characters</span>
//           </div>
//         </>
//       )}
//     </>
//   );
// };
