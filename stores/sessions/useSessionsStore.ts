import { create } from "zustand";
import type { SessionsStore } from "./sessions.types";

export const useSessionsStore = create<SessionsStore>((set) => ({
  sessions: [],
  selectedSession: null,
  isLoading: false,
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) =>
    set((state) => ({ sessions: [...state.sessions, session] })),
  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    })),
  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    })),
  setSelectedSession: (session) => set({ selectedSession: session }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
