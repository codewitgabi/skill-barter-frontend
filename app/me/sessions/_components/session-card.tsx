import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  Calendar,
  Star,
  Play,
  Loader2,
} from "lucide-react";
import type { ISession } from "./types";

interface SessionCardProps {
  session: ISession;
  onJoin?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onMarkComplete?: (id: number) => void;
  isCompleting?: boolean;
}

function SessionCard({
  session,
  onJoin,
  onViewDetails,
  onMarkComplete,
  isCompleting,
}: SessionCardProps) {
  // Check if current time is at or past the scheduled time
  const isSessionTimeReached = () => {
    if (!session.scheduledDate) return false;
    const scheduledDate = new Date(session.scheduledDate);
    const now = new Date();
    return now >= scheduledDate;
  };

  const getStatusColor = () => {
    switch (session.status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "scheduled":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  const getTypeColor = () => {
    return session.type === "Learning"
      ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      : "bg-orange-500/10 text-orange-700 dark:text-orange-400";
  };

  return (
    <Card className="shadow-none border hover:bg-accent/50 transition-all hover:border-primary/20">
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-3 sm:gap-4">
          {/* Avatar */}
          <div className="shrink-0">
            <Link href={`/users/${session.partner.id}`}>
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={session.partner.avatar}
                  alt={session.partner.name}
                />
                <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white text-sm sm:text-base">
                  {session.partner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium ${getTypeColor()}`}
                  >
                    {session.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium border ${getStatusColor()}`}
                  >
                    {session.status.charAt(0).toUpperCase() +
                      session.status.slice(1)}
                  </Badge>
                  <h3 className="text-base sm:text-lg font-semibold truncate">
                    {session.skill}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  with {session.partner.name}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {session.description}
            </p>

            {/* Progress for active sessions */}
            {session.status === "active" && session.progress !== undefined && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-xs font-medium">
                    {session.progress}%
                  </span>
                </div>
                <Progress value={session.progress} className="h-2" />
              </div>
            )}

            {/* Rating for completed sessions */}
            {session.status === "completed" && session.rating && (
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < session.rating!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {session.rating}/5
                </span>
              </div>
            )}

            {/* Details */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                <span>{session.scheduledTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {session.location === "online" ? (
                  <Video className="h-3 w-3" />
                ) : (
                  <MapPin className="h-3 w-3" />
                )}
                <span className="capitalize">{session.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                <span>{session.duration} min</span>
              </div>
            </div>

            {/* Objectives */}
            {session.objectives.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium mb-1.5">Objectives:</p>
                <div className="flex flex-wrap gap-1.5">
                  {session.objectives.slice(0, 3).map((objective, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-xs font-normal"
                    >
                      {objective}
                    </Badge>
                  ))}
                  {session.objectives.length > 3 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{session.objectives.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {session.status === "active" && session.meetingLink && (
                <Button
                  onClick={() => onJoin?.(session.id)}
                  className="flex-1 sm:flex-initial rounded-full font-medium text-sm py-3 sm:py-0"
                  size="sm"
                >
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  Join Session
                </Button>
              )}
              {session.status === "scheduled" && !isSessionTimeReached() && (
                <Button
                  onClick={() => onViewDetails?.(session.id)}
                  variant="outline"
                  className="flex-1 sm:flex-initial rounded-full font-medium text-sm py-3 sm:py-0"
                  size="sm"
                >
                  <Video className="h-3.5 w-3.5 mr-1.5" />
                  View Details
                </Button>
              )}
              {session.status !== "completed" &&
                session.status !== "cancelled" &&
                isSessionTimeReached() && (
                  <Button
                    onClick={() => onMarkComplete?.(session.id)}
                    variant="outline"
                    className="flex-1 sm:flex-initial rounded-full font-medium text-sm py-3 sm:py-0 border-green-500/50 text-green-600 hover:bg-green-500/10 hover:text-green-700"
                    size="sm"
                    disabled={isCompleting}
                  >
                    {isCompleting ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    {isCompleting ? "Completing..." : "Mark as Completed"}
                  </Button>
                )}
              {session.status === "completed" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Completed {session.completedAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SessionCard;
