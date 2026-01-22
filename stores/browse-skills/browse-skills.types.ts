export interface BrowseSkillsState {
  searchQuery: string;
  selectedCategory: string;
}

export interface BrowseSkillsActions {
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
}

export type BrowseSkillsStore = BrowseSkillsState & BrowseSkillsActions;
