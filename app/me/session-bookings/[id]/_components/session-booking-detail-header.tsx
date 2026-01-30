import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
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

interface SessionBookingDetailHeaderProps {
  booking: SessionBooking;
}

function SessionBookingDetailHeader({
  booking,
}: SessionBookingDetailHeaderProps) {
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
      case "changes_made":
        return "default";
      default:
        return "default";
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Card className="shadow-none border mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Avatar Section */}
          <div className="shrink-0">
            <Link href={`/users/${partner.id}`}>
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage
                  src={partner.avatarUrl || "/placeholder-avatar.jpg"}
                  alt={partner.name}
                />
                <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white text-lg sm:text-xl">
                  {partner.initials || partner.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
              <div>
                <Link href={`/users/${partner.id}`}>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1 hover:text-primary transition-colors cursor-pointer">
                    {partner.name}
                  </h1>
                </Link>
                <p className="text-sm text-muted-foreground">@{partner.username}</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <Badge
                  variant={getStatusVariant(booking.status)}
                  className="text-xs sm:text-sm w-fit"
                >
                  {booking.status === "changes_requested"
                    ? "Changes Requested"
                    : booking.status === "changes_made"
                    ? "Changes Made"
                    : booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Created {timeSince(booking.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Skill */}
            <div className="mb-4">
              <Badge variant="default" className="text-sm font-medium">
                {booking.skill}
              </Badge>
            </div>

            {/* Schedule Details */}
            <div className="space-y-2">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SessionBookingDetailHeader;
