import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MessageSquare, Calendar, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const recentActivity = [
  {
    id: 1,
    type: "review",
    message: "Sarah Johnson left you a 5-star review",
    skill: "Web Development",
    time: "1 hour ago",
  },
  {
    id: 2,
    type: "exchange",
    message: "New exchange request from John Smith",
    skill: "Graphic Design",
    time: "3 hours ago",
  },
  {
    id: 3,
    type: "session",
    message: "Session scheduled with Mike Chen",
    skill: "Web Development",
    time: "1 day ago",
  },
  {
    id: 4,
    type: "achievement",
    message: "You completed 10 sessions!",
    skill: "Photography",
    time: "2 days ago",
  },
];

function RecentActivity() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                activity.type === "review" &&
                  "bg-green-100 dark:bg-green-900/20",
                activity.type === "exchange" &&
                  "bg-blue-100 dark:bg-blue-900/20",
                activity.type === "session" &&
                  "bg-purple-100 dark:bg-purple-900/20",
                activity.type === "achievement" &&
                  "bg-yellow-100 dark:bg-yellow-900/20",
              )}
            >
              {activity.type === "review" && (
                <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
              {activity.type === "exchange" && (
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
              {activity.type === "session" && (
                <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              )}
              {activity.type === "achievement" && (
                <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.message}</span>
                {activity.skill && (
                  <span className="text-muted-foreground">
                    {" "}
                    - {activity.skill}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
