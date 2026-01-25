import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { timeSince } from "@/lib/helpers";

interface SessionBooking {
  id: string;
  userRole: string;
  exchangeRequest: {
    id: string;
    teachingSkill: string;
    learningSkill: string;
    status: string;
  };
  proposer: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
  };
  recipient: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
  };
  skill: string;
  status: string;
  daysPerWeek: number;
  daysOfWeek: string[];
  startTime: string;
  duration: number;
  totalSessions: number;
  message: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface SessionBookingCardProps {
  booking: SessionBooking;
  onClick: () => void;
}

function SessionBookingCard({ booking, onClick }: SessionBookingCardProps) {
  const partner =
    booking.userRole === "proposer" ? booking.recipient : booking.proposer;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "draft":
        return "outline";
      case "changes_requested":
        return "destructive";
      default:
        return "default";
    }
  };

  const formatTime = (time: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card
      className="shadow-none border hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex gap-3 sm:gap-4">
          {/* Avatar Section */}
          <div className="shrink-0">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
              <AvatarImage src={partner.avatarUrl || "/placeholder-avatar.jpg"} alt={partner.name} />
              <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white text-sm sm:text-base">
                {partner.initials || partner.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header with name and status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-semibold">
                  {partner.name}
                </h3>
                <Badge 
                  variant={booking.userRole === "proposer" ? "default" : "outline"} 
                  className="text-xs"
                >
                  {booking.userRole === "proposer" ? "You're Proposing" : "You're Recipient"}
                </Badge>
                <Badge variant={getStatusVariant(booking.status)} className="text-xs">
                  {booking.status === "changes_requested"
                    ? "Changes Requested"
                    : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{timeSince(booking.createdAt)}</span>
              </div>
            </div>

            {/* Skill */}
            <div className="mb-3">
              <Badge variant="default" className="text-xs font-medium">
                {booking.skill}
              </Badge>
            </div>

            {/* Schedule Details */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  {booking.daysOfWeek.join(", ")} • {formatTime(booking.startTime)} • {booking.duration} mins
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                <span>
                  {booking.totalSessions} {booking.totalSessions === 1 ? "session" : "sessions"} • {booking.daysPerWeek} {booking.daysPerWeek === 1 ? "day" : "days"} per week
                </span>
              </div>
            </div>

            {/* Message if available */}
            {booking.message && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {booking.message}
              </p>
            )}

            {/* Click indicator */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>View details</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SessionBookingCard;
