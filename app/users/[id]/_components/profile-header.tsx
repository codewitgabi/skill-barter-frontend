"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  Calendar,
  Clock,
  Globe,
  MessageCircle,
  UserPlus,
  Award,
  CheckCircle,
  Briefcase,
  Check,
  Loader2,
} from "lucide-react";
import { apiPost } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import type { UserProfile, ConnectionStatus } from "./types";

interface ProfileHeaderProps {
  profile: UserProfile;
  currentUserId?: string | null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function ProfileHeader({ profile, currentUserId }: ProfileHeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const isOwnProfile = currentUserId === profile.id;
  const connectionStatus: ConnectionStatus = profile.connectionStatus;

  const handleConnectClick = async () => {
    if (connectionStatus === null) {
      // User not authenticated, redirect to sign in
      router.push("/auth/signin");
      return;
    }

    if (!user) {
      toast.error("Please sign in to connect");
      router.push("/auth/signin");
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

    // Find a skill the user can teach that the profile wants to learn
    const teachingSkill = profile.skillsToLearn
      .map((s) => s.name)
      .find((skillName) => userTeachingSkills.includes(skillName));

    // Find a skill the profile can teach that the user wants to learn
    const learningSkill = profile.skillsToTeach
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
      setIsConnecting(true);

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
        receiverId: profile.id,
        teachingSkill,
        learningSkill,
        message: null,
      });

      if (response.status === "success") {
        toast.success("Connection request sent!", {
          description: `Your exchange request has been sent to ${fullName}.`,
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
      setIsConnecting(false);
    }
  };

  const showConnectButton = !isOwnProfile && connectionStatus !== "connected";

  return (
    <Card className="overflow-hidden shadow-none">
      {/* Gradient Banner */}
      <div className="h-36 sm:h-44 bg-linear-to-br from-emerald-500 via-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="px-4 sm:px-8 pb-8">
        {/* Avatar - overlaps the banner */}
        <div className="-mt-16 sm:-mt-20 mb-4">
          <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background ring-4 ring-background">
            <AvatarImage src={profile.avatar} alt={fullName} />
            <AvatarFallback className="text-2xl sm:text-3xl font-semibold bg-linear-to-br from-emerald-500 via-blue-500 to-purple-600 text-white">
              {profile.initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info - below the avatar */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {fullName}
            </h1>
            <p className="text-muted-foreground text-lg">@{profile.username}</p>

            {/* Quick Info Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground/70" />
                <span>
                  {profile.location.city}, {profile.location.country}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground/70" />
                <span>Joined {formatDate(profile.memberSince)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground/70" />
                <span>{profile.weeklyAvailability} hrs/week</span>
              </div>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  <span>{new URL(profile.website).hostname}</span>
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0">
            {!isOwnProfile && (
              <Button
                variant="outline"
                size="default"
                className="gap-2"
                disabled
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            )}
            {connectionStatus === "connected" && !isOwnProfile && (
              <Button
                variant="outline"
                size="default"
                className="gap-2 text-emerald-600 border-emerald-200 dark:border-emerald-800 cursor-default"
                disabled
              >
                <Check className="h-4 w-4" />
                Connected
              </Button>
            )}
            {showConnectButton && (
              <Button
                size="default"
                className="gap-2 bg-linear-to-r from-emerald-500 via-blue-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
                onClick={handleConnectClick}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Rating & Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold text-yellow-700 dark:text-yellow-400">
              {profile.stats.averageRating}
            </span>
            <span className="text-sm text-yellow-600 dark:text-yellow-500">
              ({profile.stats.totalReviews} reviews)
            </span>
          </div>

          {profile.stats.averageRating >= 4.5 && (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            >
              <Award className="h-3.5 w-3.5" />
              Top Rated
            </Badge>
          )}

          {profile.stats.completedSessions > 0 && (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              {profile.stats.completedSessions} Sessions
            </Badge>
          )}

          {profile.stats.completedSessions >= 10 && (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1.5 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
            >
              <Briefcase className="h-3.5 w-3.5" />
              Verified Expert
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ProfileHeader;
