import { create } from "zustand";
import { persist } from "zustand/middleware";

import { CHNodeDataType, UseMindMapStoreState } from "@/types/new-types";

export const useMindMapStore = create<UseMindMapStoreState>()(
  persist(
    (set) => ({
      // Required variables
      nodes: {} as Record<string, CHNodeDataType>,
      nodesDraggable: true,
      setNodesDraggable: (draggable: boolean) =>
        set({ nodesDraggable: draggable }),
      selectedItemId: null,
      setSelectedItemId: (id: string | null) => set({ selectedItemId: id }),
      activeChildId: null, // Track which child node should be displayed
      setActiveChildId: (id: string | null) => set({ activeChildId: id }),
      activeParentId: null, // Track which parent has the active child
      setActiveParentId: (id: string | null) => set({ activeParentId: id }),
      isUpdatingMdAfterReorder: false, // Track when we're updating MD after child reorder
      setIsUpdatingMdAfterReorder: (updating: boolean) =>
        set({ isUpdatingMdAfterReorder: updating }),
      canReorder: false,
      setCanReorder: (canReorder: boolean) => set({ canReorder }),
      draggingNodeId: null,
      setDraggingNodeId: (id: string | null) => set({ draggingNodeId: id }),
    }),
    {
      name: "mind-map-storage",
    },
  ),
);
