"use client";

import clsx from "clsx";
import { Tooltip } from "@heroui/react";

import { CommonTooltipType, CustomTooltipType } from "@/types";

export const CommonTooltip = (props: CommonTooltipType) => {
  // const { children, ...rest } = props;

  return <Tooltip {...props} />;
};

export const CustomTooltip: React.FC<CustomTooltipType> = ({
  maxLength = 30,
  title = "",
  tooltipProps,
  className = "",
}) => {
  const trimmedTitle = title.toString().trim();
  const shouldShowTooltip = trimmedTitle.length > maxLength;

  return shouldShowTooltip ? (
    <CommonTooltip content={trimmedTitle} {...tooltipProps}>
      <div className={clsx([className, "cursor-pointer z-plus_10"])}>
        {trimmedTitle}
      </div>
    </CommonTooltip>
  ) : (
    <div className={clsx(className)}>{trimmedTitle}</div>
  );
};
