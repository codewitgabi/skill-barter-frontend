"use client";

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
} from "lucide-react";

interface PeopleGridProps {
  filteredPeople: {
    id: number;
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
  return (
    <>
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
    </>
  );
}

export default PeopleGrid;
