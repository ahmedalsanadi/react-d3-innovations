import { create } from 'zustand';
import { NetworkNode } from './types';

interface NetworkStore {
  currentNode: NetworkNode | null;
  history: NetworkNode[];
  setCurrentNode: (node: NetworkNode) => void;
  addToHistory: (node: NetworkNode) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  currentNode: null,
  history: [],
  setCurrentNode: (node) => set({ currentNode: node }),
  addToHistory: (node) => set((state) => ({
    history: [...state.history, node]
  }))
}));