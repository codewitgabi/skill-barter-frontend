"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Star,
  MapPin,
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
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills, people, or interests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-full"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "rounded-full",
                  isActive && "bg-primary text-primary-foreground",
                )}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

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

      {/* People Grid */}
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPeople.map((person) => (
            <Card
              key={person.id}
              className="hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/50"
            >
              <CardContent className="p-4 sm:p-6">
                {/* Header with Avatar and Info */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shrink-0">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">
                      {person.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">{person.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-medium">
                          {person.rating}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        ({person.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                  {person.bio}
                </p>

                {/* Skills to Teach */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-2">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Teaching
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {person.skillsToTeach.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="text-xs rounded-full"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills to Learn */}
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Learning
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {person.skillsToLearn.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs rounded-full"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full rounded-full" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Page;
