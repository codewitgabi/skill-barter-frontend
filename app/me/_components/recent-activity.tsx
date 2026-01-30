"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Calendar, Star, Award, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IRecentActivity } from "@/types/dashboard";

interface FirebaseNotification {
  id: string;
  actionUrl: string;
  createdAt: Timestamp;
  data: {
    sessionId?: string;
    message: string;
    skill?: string;
    partnerName?: string;
    rating?: number;
    [key: string]: unknown;
  };
  message?: string;
  readAt: Timestamp | null;
  status: "unread" | "read";
  title: string;
  type: string;
  updatedAt: Timestamp;
  userId: string;
}

function formatTimeAgo(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function summarizeNotification(notification: FirebaseNotification): IRecentActivity {
  const { type, title, data, createdAt } = notification;
  const message = notification.message || data?.message || title;
  const skill = data?.skill || "";

  // Map notification type to activity type
  let activityType: IRecentActivity["type"] = "exchange";
  
  if (type.includes("review") || type.includes("rating")) {
    activityType = "review";
  } else if (type.includes("session") || type.includes("booking")) {
    activityType = "session";
  } else if (type.includes("achievement") || type.includes("milestone") || type.includes("badge")) {
    activityType = "achievement";
  } else if (type.includes("exchange") || type.includes("request")) {
    activityType = "exchange";
  }

  return {
    id: notification.id,
    type: activityType,
    message,
    skill,
    time: formatTimeAgo(createdAt),
  };
}

function RecentActivitySkeleton() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentActivityEmpty() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Bell className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your updates will appear here
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<IRecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentActivity() {
      if (!user?._id) {
        setIsLoading(false);
        return;
      }

      try {
        const notificationsRef = collection(db, "notifications");
        const q = query(
          notificationsRef,
          where("userId", "==", user._id),
          orderBy("createdAt", "desc"),
          limit(10),
        );

        const snapshot = await getDocs(q);
        const notifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FirebaseNotification[];

        // Convert notifications to activities and take only first 4
        const summarizedActivities = notifications
          .map(summarizeNotification)
          .slice(0, 4);

        setActivities(summarizedActivities);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentActivity();
  }, [user?._id]);

  if (isLoading) {
    return <RecentActivitySkeleton />;
  }

  if (activities.length === 0) {
    return <RecentActivityEmpty />;
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest updates and notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
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
              <p className="text-sm wrap-break-word">
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
