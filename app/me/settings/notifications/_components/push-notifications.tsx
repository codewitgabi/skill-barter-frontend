"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  MessageSquare,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import NotificationItem from "./notification-item";
import type { NotificationSettings } from "./types";
import { useNotifications } from "@/hooks/use-notifications";

interface PushNotificationsProps {
  settings: NotificationSettings["push"];
  onUpdate: (
    category: keyof NotificationSettings,
    settingKey: string,
    value: boolean,
  ) => void;
}

function PushNotifications({ settings, onUpdate }: PushNotificationsProps) {
  const { permission, isLoading, requestPermission, isSupported } =
    useNotifications();

  const getPermissionBadge = () => {
    if (!isSupported) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Not Supported
        </Badge>
      );
    }

    switch (permission) {
      case "granted":
        return (
          <Badge
            variant="secondary"
            className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            <CheckCircle className="h-3 w-3" />
            Enabled
          </Badge>
        );
      case "denied":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Blocked
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Not Enabled
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Push Notifications</CardTitle>
          </div>
          {getPermissionBadge()}
        </div>
        <CardDescription>
          Receive push notifications on your device
        </CardDescription>
        {isSupported && permission === "default" && (
          <div className="pt-2">
            <Button size="sm" onClick={requestPermission} disabled={isLoading}>
              {isLoading ? "Enabling..." : "Enable Push Notifications"}
            </Button>
          </div>
        )}
        {permission === "denied" && (
          <p className="text-sm text-muted-foreground pt-2">
            Push notifications are blocked. Please enable them in your browser
            settings to receive notifications.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-0">
        <NotificationItem
          icon={MessageSquare}
          label="Exchange Requests"
          description="Get notified when someone requests a skill exchange"
          category="push"
          settingKey="exchangeRequests"
          value={settings.exchangeRequests}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Calendar}
          label="Session Reminders"
          description="Reminders before your scheduled sessions"
          category="push"
          settingKey="sessionReminders"
          value={settings.sessionReminders}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={MessageSquare}
          label="Messages"
          description="New messages from other users"
          category="push"
          settingKey="messages"
          value={settings.messages}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Star}
          label="Reviews & Ratings"
          description="When someone leaves you a review or rating"
          category="push"
          settingKey="reviewsAndRatings"
          value={settings.reviewsAndRatings}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Bell}
          label="Achievements"
          description="Unlock new achievements and milestones"
          category="push"
          settingKey="achievements"
          value={settings.achievements}
          onUpdate={onUpdate}
        />
      </CardContent>
    </Card>
  );
}

export default PushNotifications;
