"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, MessageSquare, Calendar, Star, Bell, Shield } from "lucide-react";
import NotificationItem from "./notification-item";
import type { NotificationSettings } from "./types";

interface EmailNotificationsProps {
  settings: NotificationSettings["email"];
  onUpdate: (category: keyof NotificationSettings, settingKey: string, value: boolean) => void;
}

function EmailNotifications({ settings, onUpdate }: EmailNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <CardTitle>Email Notifications</CardTitle>
        </div>
        <CardDescription>
          Receive notifications via email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-0">
        <NotificationItem
          icon={MessageSquare}
          label="Exchange Requests"
          description="Get notified when someone requests a skill exchange"
          category="email"
          settingKey="exchangeRequests"
          value={settings.exchangeRequests}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Calendar}
          label="Session Reminders"
          description="Reminders before your scheduled sessions"
          category="email"
          settingKey="sessionReminders"
          value={settings.sessionReminders}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={MessageSquare}
          label="Messages"
          description="New messages from other users"
          category="email"
          settingKey="messages"
          value={settings.messages}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Star}
          label="Reviews & Ratings"
          description="When someone leaves you a review or rating"
          category="email"
          settingKey="reviews"
          value={settings.reviews}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Bell}
          label="Achievements"
          description="Unlock new achievements and milestones"
          category="email"
          settingKey="achievements"
          value={settings.achievements}
          onUpdate={onUpdate}
        />
        <Separator />
        <NotificationItem
          icon={Shield}
          label="Security Alerts"
          description="Important security and account updates"
          category="email"
          settingKey="security"
          value={settings.security}
          onUpdate={onUpdate}
        />
      </CardContent>
    </Card>
  );
}

export default EmailNotifications;
