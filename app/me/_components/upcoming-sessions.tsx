import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import type { IUpcomingSession } from "@/types/dashboard";

const upcomingSessions: Array<IUpcomingSession> = [
  {
    id: 1,
    type: "Learning",
    skill: "Photography",
    with: "Sarah Johnson",
    time: "Today, 2:00 PM",
    avatar: "/placeholder-avatar.jpg",
  },
  {
    id: 2,
    type: "Teaching",
    skill: "Web Development",
    with: "Mike Chen",
    time: "Tomorrow, 10:00 AM",
    avatar: "/placeholder-avatar.jpg",
  },
  {
    id: 3,
    type: "Learning",
    skill: "Spanish",
    with: "Maria Garcia",
    time: "Dec 28, 4:00 PM",
    avatar: "/placeholder-avatar.jpg",
  },
];

function UpcomingSessions() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
        <CardDescription>Your scheduled exchanges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingSessions.map((session) => (
          <div
            key={session.id}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={session.avatar} alt={session.with} />
              <AvatarFallback>
                {session.with
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={
                    session.type === "Learning" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {session.type}
                </Badge>
                <span className="text-sm font-medium truncate">
                  {session.skill}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {session.with}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {session.time}
                </span>
              </div>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          className="w-full rounded-full cursor-pointer"
          size="sm"
        >
          <Calendar className="h-4 w-4 mr-2" />
          View All Sessions
        </Button>
      </CardContent>
    </Card>
  );
}

export default UpcomingSessions;
