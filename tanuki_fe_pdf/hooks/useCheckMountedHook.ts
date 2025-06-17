import { useEffect } from "react";

import { useRoadmapStoreHook } from "@/hooks";

export const useCheckMountedHook = (seconds?: number) => {
  const { isMounted, setIsMounted } = useRoadmapStoreHook();

  useEffect(() => {
    if (!isMounted) {
      const timeout = setTimeout(() => {
        setIsMounted(true);
      }, seconds || 1250); // Delay for 1250 milliseconds

      return () => clearTimeout(timeout); // Cleanup on unmount
    }
  }, [isMounted, setIsMounted]);

  return isMounted;
};
