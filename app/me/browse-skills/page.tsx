"use client";

import { useState, useMemo } from "react";
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

// Mock data for people with skills
const people = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, NY",
    rating: 4.9,
    reviews: 24,
    avatar: "/placeholder-avatar.jpg",
    skillsToTeach: [
      { name: "Web Development", category: "tech", level: "advanced" },
      { name: "React", category: "tech", level: "advanced" },
      { name: "TypeScript", category: "tech", level: "intermediate" },
    ],
    skillsToLearn: [
      { name: "Photography", category: "photography", level: "beginner" },
      { name: "Spanish", category: "languages", level: "beginner" },
    ],
    bio: "Full-stack developer passionate about teaching React and modern web development.",
  },
  {
    id: 2,
    name: "Mike Chen",
    location: "San Francisco, CA",
    rating: 4.8,
    reviews: 18,
    avatar: "/placeholder-avatar.jpg",
    skillsToTeach: [
      { name: "UI/UX Design", category: "design", level: "advanced" },
      { name: "Figma", category: "design", level: "advanced" },
    ],
    skillsToLearn: [
      { name: "Web Development", category: "tech", level: "beginner" },
      { name: "Guitar", category: "music", level: "beginner" },
    ],
    bio: "Designer with 5+ years of experience. Love sharing design principles and tools.",
  },
  {
    id: 3,
    name: "Emma Wilson",
    location: "London, UK",
    rating: 5.0,
    reviews: 32,
    avatar: "/placeholder-avatar.jpg",
    skillsToTeach: [
      { name: "Photography", category: "photography", level: "advanced" },
      { name: "Photo Editing", category: "photography", level: "intermediate" },
    ],
    skillsToLearn: [
      { name: "Data Science", category: "tech", level: "beginner" },
      { name: "Yoga", category: "wellness", level: "beginner" },
    ],
    bio: "Professional photographer specializing in portrait and landscape photography.",
  },
  {
    id: 4,
    name: "David Lee",
    location: "Tokyo, Japan",
    rating: 4.7,
    reviews: 15,
    avatar: "/placeholder-avatar.jpg",
    skillsToTeach: [
      { name: "Guitar", category: "music", level: "advanced" },
      { name: "Music Theory", category: "music", level: "intermediate" },
    ],
    skillsToLearn: [
      { name: "Japanese Cooking", category: "cooking", level: "beginner" },
      { name: "Web Development", category: "tech", level: "beginner" },
    ],
    bio: "Guitarist and music teacher. Can teach from beginner to advanced levels.",
  },
  {
    id: 5,
    name: "Maria Garcia",
    location: "Madrid, Spain",
    rating: 4.9,
    reviews: 28,
    avatar: "/placeholder-avatar.jpg",
    skillsToTeach: [
      { name: "Spanish", category: "languages", level: "advanced" },
      { name: "English", category: "languages", level: "intermediate" },
    ],
    skillsToLearn: [
      { name: "Photography", category: "photography", level: "beginner" },
      { name: "Web Development", category: "tech", level: "beginner" },
    ],
    bio: "Native Spanish speaker offering language exchange and tutoring services.",
  },
  {
    id: 6,
    name: "Alex Thompson",
    location: "Toronto, Canada",
    rating: 4.6,
    reviews: 12,
    avatar: "/placeholder-avatar.jpg",
    skillsToTeach: [
      { name: "Cooking", category: "cooking", level: "advanced" },
      { name: "Baking", category: "cooking", level: "intermediate" },
    ],
    skillsToLearn: [
      { name: "French", category: "languages", level: "beginner" },
      { name: "Photography", category: "photography", level: "beginner" },
    ],
    bio: "Chef with expertise in Italian and French cuisine. Love teaching cooking basics.",
  },
  {
    id: 7,
    name: "Lisa Park",
    location: "Seoul, South Korea",
    rating: 4.8,
    reviews: 21,
    avatar: "/placeholder-avatar.jpg",
    skillsToTeach: [
      { name: "Korean", category: "languages", level: "advanced" },
      { name: "K-Pop Dance", category: "arts", level: "intermediate" },
    ],
    skillsToLearn: [
      { name: "Web Development", category: "tech", level: "beginner" },
      { name: "Cooking", category: "cooking", level: "beginner" },
    ],
    bio: "Korean language tutor and dance instructor. Passionate about cultural exchange.",
  },
  {
    id: 8,
    name: "James Brown",
    location: "Sydney, Australia",
    rating: 4.7,
    reviews: 19,
    avatar: "/placeholder-avatar.jpg",
    skillsToTeach: [
      { name: "Fitness Training", category: "fitness", level: "advanced" },
      { name: "Yoga", category: "wellness", level: "intermediate" },
    ],
    skillsToLearn: [
      { name: "Spanish", category: "languages", level: "beginner" },
      { name: "Photography", category: "photography", level: "beginner" },
    ],
    bio: "Certified fitness trainer and yoga instructor. Focus on strength and flexibility.",
  },
];

function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter people based on search and category
  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.skillsToTeach.some((skill) =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        person.skillsToLearn.some((skill) =>
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ) ||
        person.bio.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "all" ||
        person.skillsToTeach.some(
          (skill) => skill.category === selectedCategory,
        ) ||
        person.skillsToLearn.some(
          (skill) => skill.category === selectedCategory,
        );

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
          Found{" "}
          <span className="font-semibold text-foreground">
            {filteredPeople.length}
          </span>{" "}
          {filteredPeople.length === 1 ? "person" : "people"}
        </p>
      </div>

      <PeopleGrid filteredPeople={filteredPeople} />
    </div>
  );
}

export default Page;
