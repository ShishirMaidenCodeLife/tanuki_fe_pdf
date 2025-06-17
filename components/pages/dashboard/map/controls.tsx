"use client";

import {
  ClearSkillsButton,
  GenerateRouteButton,
  ZoomFocusButton,
} from "@/components";
import { useRoadmapStoreHook } from "@/hooks";

// Used in map page to show the different available control options
export const Controls = () => {
  // Get the theme colors and checked nodes from store hooks
  const { checkedNodes } = useRoadmapStoreHook();

  return (
    <div className="relative _apply_container_width font-fredoka">
      {/* Bottom section */}
      <div className="z-mobile_stepper fixed bottom-[16px] left-8 grid place-items-center gap-2">
        <div className="gap-5 tracking-wider font-semibold text-lg">
          Selected Skills : {checkedNodes?.length}
        </div>
        <div className="flex gap-5 tracking-wider">
          <ClearSkillsButton />
          <GenerateRouteButton />
        </div>
      </div>

      <div className="z-mobile_stepper fixed bottom-[16px] right-8 grid place-items-center gap-2">
        <div className="flex gap-5 tracking-wider">
          <ZoomFocusButton action="center" />
          <ZoomFocusButton action="reset" />
        </div>
      </div>
    </div>
  );
};
