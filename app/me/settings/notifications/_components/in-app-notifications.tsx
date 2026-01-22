"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bell, MessageSquare, Calendar, Star } from "lucide-react";
import NotificationItem from "./notification-item";
import type { NotificationSettings } from "./types";

interface InAppNotificationsProps {
  settings: NotificationSettings["inApp"];
  onUpdate: (category: keyof NotificationSettings, settingKey: string, value: boolean) => void;
}

function InAppNotifications({ settings, onUpdate }: InAppNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>In-App Notifications</CardTitle>
        </div>
        <CardDescription>
          Show notifications within the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-0">
        <NotificationItem
          icon={MessageSquare}
          label="Exchange Requests"
          description="Get notified when someone requests a skill exchange"
          category="inApp"
          settingKey="exchangeRequests"
          value={settings.exchangeRequests}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Calendar}
          label="Session Reminders"
          description="Reminders before your scheduled sessions"
          category="inApp"
          settingKey="sessionReminders"
          value={settings.sessionReminders}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={MessageSquare}
          label="Messages"
          description="New messages from other users"
          category="inApp"
          settingKey="messages"
          value={settings.messages}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Star}
          label="Reviews & Ratings"
          description="When someone leaves you a review or rating"
          category="inApp"
          settingKey="reviews"
          value={settings.reviews}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Bell}
          label="Achievements"
          description="Unlock new achievements and milestones"
          category="inApp"
          settingKey="achievements"
          value={settings.achievements}
          onUpdate={onUpdate}
        />
      </CardContent>
    </Card>
  );
}

export default InAppNotifications;
