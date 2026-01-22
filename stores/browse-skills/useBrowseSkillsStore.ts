import { create } from "zustand";
import type { BrowseSkillsStore } from "./browse-skills.types";

export const useBrowseSkillsStore = create<BrowseSkillsStore>((set) => ({
  searchQuery: "",
  selectedCategory: "all",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetFilters: () => set({ searchQuery: "", selectedCategory: "all" }),
}));
