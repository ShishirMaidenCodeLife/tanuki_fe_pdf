"use client";

import { siteImages } from "../../data/custom/site";

import { CommonImage } from "@/components";

export const CommonPineappleImage = () => {
  return (
    <CommonImage
      alt="Square Pineapple"
      className="w-14 h-14 max-w-14 max-h-14"
      src={siteImages.svg.pineapple.squareFilled}
    />
  );
};

export const CoolPineappleImage = () => {
  return (
    <div className="relative w-32 h-32">
      <CommonImage
        alt="pineapple_filtered_hexa"
        className="w-full h-full"
        src={siteImages.webp.pineapple.referee}
      />
    </div>
  );
};
