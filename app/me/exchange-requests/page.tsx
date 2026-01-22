"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { UserPlus, Check, X, Clock, Loader2 } from "lucide-react";
import type { IExchangeRequest } from "@/types/dashboard";

// Generate mock data - in a real app, this would come from an API
const generateMockRequests = (count: number): Array<IExchangeRequest> => {
  const skills = [
    "Graphic Design",
    "Korean Language",
    "Photography",
    "Yoga",
    "Guitar",
    "Web Development",
    "Spanish",
    "Cooking",
    "Data Science",
    "React Development",
    "UI/UX Design",
    "Python Programming",
    "Music Theory",
    "Fitness Training",
    "French",
    "JavaScript",
    "Digital Marketing",
    "Video Editing",
    "Writing",
    "Drawing",
  ];

  const wantsToLearn = [
    "React Development",
    "Cooking",
    "Web Development",
    "Spanish",
    "Data Science",
    "Graphic Design",
    "Photography",
    "Korean Language",
    "Yoga",
    "Guitar",
    "Python Programming",
    "UI/UX Design",
    "Music Theory",
    "Fitness Training",
    "French",
    "JavaScript",
    "Digital Marketing",
    "Video Editing",
    "Writing",
    "Drawing",
  ];

  const names = [
    "John Smith",
    "Lisa Park",
    "Michael Chen",
    "Sarah Johnson",
    "David Martinez",
    "Emma Wilson",
    "James Brown",
    "Maria Garcia",
    "Alex Thompson",
    "Sophie Lee",
    "Ryan Davis",
    "Olivia White",
    "Noah Taylor",
    "Ava Anderson",
    "Liam Jackson",
    "Isabella Harris",
    "Ethan Clark",
    "Mia Lewis",
    "Mason Walker",
    "Charlotte Hall",
  ];

  const messages = [
    "I'd love to exchange skills! I have 5+ years of experience.",
    "Looking to teach in exchange for learning. Available for virtual sessions.",
    "Professional with extensive experience. Can teach from beginner to advanced.",
    "Native speaker here! Looking for a skill exchange opportunity.",
    "Certified instructor seeking language exchange. Available for in-person sessions.",
    "Passionate about teaching and learning. Let's exchange skills!",
    "Experienced professional looking to share knowledge and learn something new.",
    "Available for virtual or in-person sessions. Flexible schedule.",
    "10+ years of experience. Can teach from basics to advanced levels.",
    "Looking for a learning partner. I'm patient and enthusiastic!",
  ];

  const times = [
    "2 hours ago",
    "5 hours ago",
    "1 day ago",
    "2 days ago",
    "3 days ago",
    "4 days ago",
    "5 days ago",
    "1 week ago",
    "2 weeks ago",
    "3 weeks ago",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    from: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ""),
    skill: skills[i % skills.length],
    wantsToLearn: wantsToLearn[i % wantsToLearn.length],
    message: messages[i % messages.length],
    avatar: "/placeholder-avatar.jpg",
    time: times[i % times.length],
  }));
};

const ITEMS_PER_PAGE = 10;
const INITIAL_LOAD = 10;

function Page() {
  // Generate all mock requests (simulating a large dataset)
  const allRequests = generateMockRequests(100);
  
  const [displayedRequests, setDisplayedRequests] = useState<Array<IExchangeRequest>>(
    allRequests.slice(0, INITIAL_LOAD),
  );
  const [processing, setProcessing] = useState<Set<number>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(allRequests.length > INITIAL_LOAD);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const currentCount = displayedRequests.length;
    const nextBatch = allRequests.slice(currentCount, currentCount + ITEMS_PER_PAGE);
    
    if (nextBatch.length > 0) {
      setDisplayedRequests((prev) => [...prev, ...nextBatch]);
      setHasMore(currentCount + nextBatch.length < allRequests.length);
    } else {
      setHasMore(false);
    }
    
    setIsLoadingMore(false);
  }, [displayedRequests.length, isLoadingMore, hasMore, allRequests]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const handleAccept = async (id: number) => {
    const request = displayedRequests.find((req) => req.id === id);
    if (!request) return;

    setProcessing((prev) => new Set(prev).add(id));
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Remove the request and add to sessions (in a real app, this would be an API call)
      setDisplayedRequests((prev) => prev.filter((req) => req.id !== id));
      
      toast.success("Exchange request accepted!", {
        description: `You've started a session with ${request.from}. Check your sessions page.`,
      });
      
      // In a real app, you would:
      // 1. Call API to accept the request
      // 2. Create a session for both users
      // 3. Redirect or update the UI
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept request", {
        description: "Please try again later.",
      });
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDecline = async (id: number) => {
    const request = displayedRequests.find((req) => req.id === id);
    if (!request) return;

    setProcessing((prev) => new Set(prev).add(id));
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Remove the request (in a real app, this would be an API call)
      setDisplayedRequests((prev) => prev.filter((req) => req.id !== id));
      
      toast.info("Exchange request declined", {
        description: `You've declined the request from ${request.from}.`,
      });
      
      // In a real app, you would:
      // 1. Call API to decline the request
      // 2. Update the UI
    } catch (error) {
      console.error(error);
      toast.error("Failed to decline request", {
        description: "Please try again later.",
      });
    } finally {
      setProcessing((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Exchange Requests
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            People who want to exchange skills with you. Accept to start a session.
          </p>
        </div>

        {/* Requests Count */}
        {displayedRequests.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {displayedRequests.length}
              </span>{" "}
              {displayedRequests.length === 1 ? "request" : "requests"} pending
              {allRequests.length > displayedRequests.length && (
                <span className="text-muted-foreground/70">
                  {" "}of {allRequests.length}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Requests List */}
        {displayedRequests.length === 0 ? (
          <Card className="shadow-none">
            <CardContent className="p-6 sm:p-8">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UserPlus className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>No exchange requests</EmptyTitle>
                  <EmptyDescription>
                    When someone sends you an exchange request, it will appear
                    here. You can accept or decline each request.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {displayedRequests.map((request) => {
              const isProcessing = processing.has(request.id);
              
              return (
                <Card
                  key={request.id}
                  className="shadow-none border hover:bg-accent/50 transition-colors"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Avatar Section */}
                      <div className="shrink-0">
                        <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                          <AvatarImage
                            src={request.avatar}
                            alt={request.from}
                          />
                          <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white text-sm sm:text-base">
                            {request.from
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 min-w-0">
                        {/* Header with name and time */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold">
                            {request.from}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{request.time}</span>
                          </div>
                        </div>

                        {/* Message */}
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-3">
                          {request.message}
                        </p>

                        {/* Skills Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
                          <Badge
                            variant="default"
                            className="text-xs font-medium"
                          >
                            Teaching: {request.skill}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs font-medium"
                          >
                            Learning: {request.wantsToLearn}
                          </Badge>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <Button
                            onClick={() => handleAccept(request.id)}
                            disabled={isProcessing}
                            className="flex-1 sm:flex-initial rounded-full font-medium text-sm py-3 sm:py-0"
                            size="sm"
                          >
                            {isProcessing ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Processing...
                              </>
                            ) : (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                Accept
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleDecline(request.id)}
                            disabled={isProcessing}
                            variant="outline"
                            className="flex-1 sm:flex-initial rounded-full font-medium text-sm py-3 sm:py-0"
                            size="sm"
                          >
                            {isProcessing ? (
                              <>
                                <span className="animate-spin mr-2">⏳</span>
                                Processing...
                              </>
                            ) : (
                              <>
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                Decline
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
              })}
            </div>

            {/* Loading indicator and observer target */}
            {hasMore && (
              <div ref={observerTarget} className="py-4 flex justify-center">
                {isLoadingMore && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more requests...</span>
                  </div>
                )}
              </div>
            )}

            {!hasMore && displayedRequests.length > INITIAL_LOAD && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No more requests to load
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
