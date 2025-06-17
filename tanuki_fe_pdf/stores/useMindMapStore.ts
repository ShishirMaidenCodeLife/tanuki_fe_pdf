import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CustomNodeDataType, UseMindMapStoreState } from "@/types/new-types";

export const useMindMapStore = create<UseMindMapStoreState>()(
  persist(
    (set) => ({
      // Required variables
      nodes: {} as Record<string, CustomNodeDataType>,
      nodesDraggable: true,
      setNodesDraggable: (draggable: boolean) =>
        set({ nodesDraggable: draggable }),
      selectedItemId: null,
      setSelectedItemId: (id: string | null) => set({ selectedItemId: id }),
      canReorder: true,
      setCanReorder: (canReorder: boolean) => set({ canReorder }),
    }),
    {
      name: "mind-map-storage",
    },
  ),
);
