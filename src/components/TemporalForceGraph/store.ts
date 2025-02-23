import { create } from 'zustand';
import { NetworkNode, NetworkLink } from '../SmartNetworkNavigator/types';

interface Snapshot {
  nodes: NetworkNode[];
  links: NetworkLink[];
  timestamp?: number;
}

interface TemporalStore {
  currentTimeStep: number;
  snapshots: Snapshot[];
  setTimeStep: (step: number) => void;
  addSnapshot: (snapshot: Snapshot) => void;
  clearSnapshots: () => void;
}

export const useTemporalStore = create<TemporalStore>((set) => ({
  currentTimeStep: 0,
  snapshots: [],
  setTimeStep: (step) => set({ currentTimeStep: step }),
  addSnapshot: (snapshot) => set((state) => ({
    snapshots: [...state.snapshots, { ...snapshot, timestamp: Date.now() }]
  })),
  clearSnapshots: () => set({ snapshots: [], currentTimeStep: 0 })
}));