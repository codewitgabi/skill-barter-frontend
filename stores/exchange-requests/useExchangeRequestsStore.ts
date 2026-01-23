import { create } from "zustand";
import type { ExchangeRequestsStore } from "./exchange-requests.types";

export const useExchangeRequestsStore = create<ExchangeRequestsStore>(
  (set) => ({
    requests: [],
    isLoading: false,
    processingIds: new Set<number>(),
    setRequests: (requests) => set({ requests }),
    addRequest: (request) =>
      set((state) => ({ requests: [...state.requests, request] })),
    removeRequest: (id) =>
      set((state) => ({
        requests: state.requests.filter((r) => r.id !== id),
      })),
    addProcessingId: (id) =>
      set((state) => ({
        processingIds: new Set([...state.processingIds, id]),
      })),
    removeProcessingId: (id) =>
      set((state) => {
        const newSet = new Set(state.processingIds);
        newSet.delete(id);
        return { processingIds: newSet };
      }),
    clearProcessingIds: () => set({ processingIds: new Set<number>() }),
    setLoading: (loading) => set({ isLoading: loading }),
  }),
);
