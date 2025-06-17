import { useEffect } from "react";

import { useRoadmapStoreHook } from "@/hooks";

export const useResetGlobalLoadingHook = () => {
  const { setIsGlobalLoading } = useRoadmapStoreHook();

  useEffect(() => {
    setIsGlobalLoading(false);

    return () => {
      setIsGlobalLoading(false);
    };
  }, []);
};
