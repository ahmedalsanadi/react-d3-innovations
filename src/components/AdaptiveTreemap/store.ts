import { create } from 'zustand';
import { TreemapNode } from './types';

interface TreemapStore {
  history: TreemapNode[];
  focusZones: TreemapNode[];
  addToHistory: (node: TreemapNode) => void;
  updateFocusZone: (node: TreemapNode) => void;
  clearHistory: () => void;
  clearFocusZones: () => void;
}

export const useTreemapStore = create<TreemapStore>((set) => ({
  history: [],
  focusZones: [],
  addToHistory: (node) => set((state) => ({
    history: [...state.history, { ...node, timestamp: Date.now() }]
  })),
  updateFocusZone: (node) => set((state) => ({
    focusZones: [...state.focusZones, node]
  })),
  clearHistory: () => set({ history: [] }),
  clearFocusZones: () => set({ focusZones: [] })
}));