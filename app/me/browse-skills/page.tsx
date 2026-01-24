"use client";

import { useState, useEffect, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import { apiGet } from "@/lib/api-client";
import {
  Users,
  Code,
  Paintbrush,
  Music,
  Camera,
  Languages,
  ChefHat,
  BookOpen,
  Dumbbell,
  Palette,
  Briefcase,
  Heart,
} from "lucide-react";
import SearchBar from "./_components/search-bar";
import CategoryFilters from "./_components/category-filters";
import PeopleGrid from "./_components/people-grid";

// Categories with icons
const categories = [
  { id: "all", label: "All", icon: Users },
  { id: "tech", label: "Technology", icon: Code },
  { id: "design", label: "Design", icon: Paintbrush },
  { id: "music", label: "Music", icon: Music },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "cooking", label: "Cooking", icon: ChefHat },
  { id: "fitness", label: "Fitness", icon: Dumbbell },
  { id: "arts", label: "Arts", icon: Palette },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "education", label: "Education", icon: BookOpen },
  { id: "wellness", label: "Wellness", icon: Heart },
];

interface ConnectionResponse {
  id: string;
  avatarUrl: string;
  initials: string;
  name: string;
  location: string;
  rating: number;
  numberOfReviews: number;
  bio: string;
  teachingSkills: string[];
  learningSkills: string[];
}

interface ConnectionsData {
  connections: ConnectionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Person {
  id: number;
  originalId: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  avatar: string;
  skillsToTeach: {
    name: string;
    category: string;
    level: string;
  }[];
  skillsToLearn: {
    name: string;
    category: string;
    level: string;
  }[];
  bio: string;
}

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Debounce search query updates
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearchQuery(value);
  }, 500);

  // Helper function to determine category from skill name
  const getCategoryFromSkill = (skillName: string): string => {
    const lowerSkill = skillName.toLowerCase();
    if (
      lowerSkill.includes("web") ||
      lowerSkill.includes("react") ||
      lowerSkill.includes("javascript") ||
      lowerSkill.includes("typescript") ||
      lowerSkill.includes("python") ||
      lowerSkill.includes("code") ||
      lowerSkill.includes("programming") ||
      lowerSkill.includes("development")
    ) {
      return "tech";
    }
    if (
      lowerSkill.includes("design") ||
      lowerSkill.includes("ui") ||
      lowerSkill.includes("ux") ||
      lowerSkill.includes("figma")
    ) {
      return "design";
    }
    if (
      lowerSkill.includes("music") ||
      lowerSkill.includes("guitar") ||
      lowerSkill.includes("piano") ||
      lowerSkill.includes("dance")
    ) {
      return "music";
    }
    if (
      lowerSkill.includes("photo") ||
      lowerSkill.includes("camera")
    ) {
      return "photography";
    }
    if (
      lowerSkill.includes("spanish") ||
      lowerSkill.includes("english") ||
      lowerSkill.includes("korean") ||
      lowerSkill.includes("french") ||
      lowerSkill.includes("language")
    ) {
      return "languages";
    }
    if (
      lowerSkill.includes("cook") ||
      lowerSkill.includes("baking") ||
      lowerSkill.includes("chef")
    ) {
      return "cooking";
    }
    if (
      lowerSkill.includes("fitness") ||
      lowerSkill.includes("training") ||
      lowerSkill.includes("workout")
    ) {
      return "fitness";
    }
    if (
      lowerSkill.includes("yoga") ||
      lowerSkill.includes("wellness") ||
      lowerSkill.includes("meditation")
    ) {
      return "wellness";
    }
    if (
      lowerSkill.includes("art") ||
      lowerSkill.includes("drawing") ||
      lowerSkill.includes("painting")
    ) {
      return "arts";
    }
    if (
      lowerSkill.includes("business") ||
      lowerSkill.includes("marketing")
    ) {
      return "business";
    }
    if (
      lowerSkill.includes("education") ||
      lowerSkill.includes("teaching") ||
      lowerSkill.includes("tutor")
    ) {
      return "education";
    }
    return "all";
  };

  // Update debounced search when searchQuery changes
  useEffect(() => {
    debouncedSetSearch(searchQuery);
  }, [searchQuery, debouncedSetSearch]);

  // Reset page when debounced search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedCategory]);

  // Fetch connections from API
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams();
        
        if (debouncedSearchQuery) {
          queryParams.append("search", debouncedSearchQuery);
        }
        if (selectedCategory !== "all") {
          // For now, we'll use search for category filtering
          // The backend might need to support category filtering
        }
        queryParams.append("page", currentPage.toString());
        queryParams.append("limit", "20");

        const queryString = queryParams.toString();
        const response = await apiGet<ConnectionsData>(
          `/connections${queryString ? `?${queryString}` : ""}`,
        );

        if (response.status === "success" && response.data) {
          const mappedPeople: Person[] = response.data.connections.map(
            (conn, index) => {
              const numericId = parseInt(conn.id, 10);
              const id = isNaN(numericId) ? index + 1 : numericId;

              return {
                id,
                originalId: conn.id,
                name: conn.name,
                location: conn.location,
                rating: conn.rating,
                reviews: conn.numberOfReviews,
                avatar: conn.avatarUrl || "/placeholder-avatar.jpg",
                skillsToTeach: conn.teachingSkills.map((skill) => ({
                  name: skill,
                  category: getCategoryFromSkill(skill),
                  level: "intermediate", // API doesn't provide level, defaulting
                })),
                skillsToLearn: conn.learningSkills.map((skill) => ({
                  name: skill,
                  category: getCategoryFromSkill(skill),
                  level: "beginner", // API doesn't provide level, defaulting
                })),
                bio: conn.bio || "",
              };
            },
          );
          setPeople(mappedPeople);
          setPagination(response.data.pagination);
        } else {
          toast.error("Failed to load connections", {
            description: "Please try again later.",
          });
        }
      } catch (error) {
        toast.error("Failed to load connections", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [debouncedSearchQuery, selectedCategory, currentPage]);

  // Filter people based on category (client-side since API might not support it)
  const filteredPeople = useMemo(() => {
    if (selectedCategory === "all") {
      return people;
    }
    return people.filter((person) => {
      return (
        person.skillsToTeach.some(
          (skill) => skill.category === selectedCategory,
        ) ||
        person.skillsToLearn.some(
          (skill) => skill.category === selectedCategory,
        )
      );
    });
  }, [people, selectedCategory]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Browse Skills</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Discover people and connect through skill exchange
        </p>
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CategoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Results Count */}
      <div className="mb-4 sm:mb-6">
        <p className="text-sm text-muted-foreground">
          {isLoading ? (
            "Loading..."
          ) : (
            <>
              Found{" "}
              <span className="font-semibold text-foreground">
                {pagination.total || filteredPeople.length}
              </span>{" "}
              {(pagination.total || filteredPeople.length) === 1
                ? "person"
                : "people"}
            </>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading connections...</p>
        </div>
      ) : (
        <PeopleGrid filteredPeople={filteredPeople} />
      )}
    </div>
  );
}

export default Page;
