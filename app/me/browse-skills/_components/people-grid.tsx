"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Star,
  MapPin,
  Users,
  BookOpen,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { trackConnectionRequest, trackUserCardClick } from "@/lib/analytics";

interface PeopleGridProps {
  filteredPeople: {
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
  }[];
}

function PeopleGrid({ filteredPeople }: PeopleGridProps) {
  const { user } = useAuth();
  const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());

  const handleConnect = async (
    person: PeopleGridProps["filteredPeople"][0],
  ) => {
    if (!user) {
      toast.error("Please sign in to connect");
      return;
    }

    // Get user's teaching skills (skills the user can teach)
    const userTeachingSkills = Array.isArray(user.skillsToTeach)
      ? user.skillsToTeach.map((skill) => skill.name).filter(Boolean)
      : [];

    // Get user's learning skills (skills the user wants to learn)
    const userLearningSkills = Array.isArray(user.skillsToLearn)
      ? user.skillsToLearn.map((skill) => skill.name).filter(Boolean)
      : [];

    // Find a skill the user can teach that the person wants to learn
    const teachingSkill = person.skillsToLearn
      .map((s) => s.name)
      .find((skillName) => userTeachingSkills.includes(skillName));

    // Find a skill the person can teach that the user wants to learn
    const learningSkill = person.skillsToTeach
      .map((s) => s.name)
      .find((skillName) => userLearningSkills.includes(skillName));

    if (!teachingSkill || !learningSkill) {
      toast.error("No matching skills found for exchange", {
        description:
          "Make sure you have skills that match what this person is looking for.",
      });
      return;
    }

    try {
      setConnectingIds((prev) => new Set(prev).add(person.originalId));

      const response = await apiPost<{
        id: string;
        requester: unknown;
        receiver: unknown;
        message: string | null;
        teachingSkill: string;
        learningSkill: string;
        status: string;
        createdAt: string;
      }>("/exchange-requests", {
        receiverId: person.originalId,
        teachingSkill,
        learningSkill,
        message: null,
      });

      if (response.status === "success") {
        trackConnectionRequest(person.originalId, teachingSkill, learningSkill);
        toast.success("Connection request sent!", {
          description: `Your exchange request has been sent to ${person.name}.`,
        });
      } else {
        const errorResponse = response as { error: { message: string } };
        toast.error("Failed to send connection request", {
          description:
            errorResponse.error?.message || "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Failed to send connection request", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    } finally {
      setConnectingIds((prev) => {
        const next = new Set(prev);
        next.delete(person.originalId);
        return next;
      });
    }
  };

  return (
    <>
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPeople.map((person) => (
            <Card
              key={person.originalId}
              className="hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/50"
            >
              <CardContent className="p-4 sm:p-6">
                {/* Header with Avatar and Info */}
                <div className="flex items-start gap-4 mb-4">
                  <Link href={`/users/${person.originalId}`} onClick={(e) => {
                    e.stopPropagation();
                    trackUserCardClick(person.originalId, "browse-skills");
                  }}>
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/users/${person.originalId}`} onClick={(e) => e.stopPropagation()}>
                      <h3 className="font-semibold text-base sm:text-lg mb-1 truncate hover:text-primary transition-colors cursor-pointer">
                        {person.name}
                      </h3>
                    </Link>
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
                <Button
                  className="w-full rounded-full"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(person);
                  }}
                  disabled={connectingIds.has(person.originalId)}
                >
                  {connectingIds.has(person.originalId) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
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
    </>
  );
}

export default PeopleGrid;
