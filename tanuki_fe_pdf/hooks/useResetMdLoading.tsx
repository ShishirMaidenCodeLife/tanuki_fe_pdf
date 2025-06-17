import { useEffect } from "react";

import { useRoadmapStoreHook } from "@/hooks";

export const useResetMdLoading = () => {
  const { setIsMdLoading } = useRoadmapStoreHook();

  useEffect(() => {
    setIsMdLoading(false);

    return () => {
      setIsMdLoading(false);
    };
  }, []);
};
