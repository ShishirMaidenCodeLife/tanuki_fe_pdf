"use client";

import clsx from "clsx";

export type HappyPineappleType = {
  extendCss?: string;
  isCenterAbsolute?: boolean;
  zIndex?: string;
};

export const HappyPineapple: React.FC<HappyPineappleType> = (props) => {
  const { extendCss = "", isCenterAbsolute, zIndex } = props;

  const parentDivCss = clsx([
    "happy-pineapple",
    extendCss,
    isCenterAbsolute &&
      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    zIndex && zIndex,
  ]);

  return (
    <div className={parentDivCss}>
      <div className="happy-pineapple-container">
        <div className="pineapple">
          <div className="leaf" />
          <div className="leg-left" />
          <div className="leg-right" />
          <div className="eye-left" />
          <div className="eye-right" />
          <div className="mouth" />
        </div>
        <div className="shadow" />
      </div>
    </div>
  );
};
