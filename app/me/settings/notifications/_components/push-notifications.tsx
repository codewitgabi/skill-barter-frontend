"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, MessageSquare, Calendar, Star } from "lucide-react";
import NotificationItem from "./notification-item";
import type { NotificationSettings } from "./types";

interface PushNotificationsProps {
  settings: NotificationSettings["push"];
  onUpdate: (
    category: keyof NotificationSettings,
    settingKey: string,
    value: boolean,
  ) => void;
}

function PushNotifications({ settings, onUpdate }: PushNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Push Notifications</CardTitle>
        </div>
        <CardDescription>
          Receive push notifications on your device
        </CardDescription>
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
