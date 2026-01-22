"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, Calendar, Star, Shield } from "lucide-react";

interface NotificationSettings {
  email: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviews: boolean;
    achievements: boolean;
    security: boolean;
  };
  push: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviews: boolean;
    achievements: boolean;
  };
  inApp: {
    exchangeRequests: boolean;
    sessionReminders: boolean;
    messages: boolean;
    reviews: boolean;
    achievements: boolean;
  };
}

function Page() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      exchangeRequests: true,
      sessionReminders: true,
      messages: true,
      reviews: true,
      achievements: true,
      security: true,
    },
    push: {
      exchangeRequests: true,
      sessionReminders: true,
      messages: true,
      reviews: false,
      achievements: true,
    },
    inApp: {
      exchangeRequests: true,
      sessionReminders: true,
      messages: true,
      reviews: true,
      achievements: true,
    },
  });

  const updateSetting = (
    category: keyof NotificationSettings,
    settingKey: string,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [settingKey]: value,
      },
    }));
  };

  const handleSave = () => {
    // Handle save logic
    console.log("Notification settings saved:", settings);
  };

  const NotificationItem = ({
    icon: Icon,
    label,
    description,
    category,
    settingKey,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    description: string;
    category: keyof NotificationSettings;
    settingKey: string;
    value: boolean;
  }) => (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 rounded-lg bg-accent">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <Label htmlFor={`${category}-${settingKey}`} className="font-medium cursor-pointer">
            {label}
          </Label>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      <Switch
        id={`${category}-${settingKey}`}
        checked={value}
        onCheckedChange={(checked) => updateSetting(category, settingKey, checked)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
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
            value={settings.email.exchangeRequests}
          />
          <Separator />
          <NotificationItem
            icon={Calendar}
            label="Session Reminders"
            description="Reminders before your scheduled sessions"
            category="email"
            settingKey="sessionReminders"
            value={settings.email.sessionReminders}
          />
          <Separator />
          <NotificationItem
            icon={MessageSquare}
            label="Messages"
            description="New messages from other users"
            category="email"
            settingKey="messages"
            value={settings.email.messages}
          />
          <Separator />
          <NotificationItem
            icon={Star}
            label="Reviews & Ratings"
            description="When someone leaves you a review or rating"
            category="email"
            settingKey="reviews"
            value={settings.email.reviews}
          />
          <Separator />
          <NotificationItem
            icon={Bell}
            label="Achievements"
            description="Unlock new achievements and milestones"
            category="email"
            settingKey="achievements"
            value={settings.email.achievements}
          />
          <Separator />
          <NotificationItem
            icon={Shield}
            label="Security Alerts"
            description="Important security and account updates"
            category="email"
            settingKey="security"
            value={settings.email.security}
          />
        </CardContent>
      </Card>

      {/* Push Notifications */}
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
            value={settings.push.exchangeRequests}
          />
          <Separator />
          <NotificationItem
            icon={Calendar}
            label="Session Reminders"
            description="Reminders before your scheduled sessions"
            category="push"
            settingKey="sessionReminders"
            value={settings.push.sessionReminders}
          />
          <Separator />
          <NotificationItem
            icon={MessageSquare}
            label="Messages"
            description="New messages from other users"
            category="push"
            settingKey="messages"
            value={settings.push.messages}
          />
          <Separator />
          <NotificationItem
            icon={Star}
            label="Reviews & Ratings"
            description="When someone leaves you a review or rating"
            category="push"
            settingKey="reviews"
            value={settings.push.reviews}
          />
          <Separator />
          <NotificationItem
            icon={Bell}
            label="Achievements"
            description="Unlock new achievements and milestones"
            category="push"
            settingKey="achievements"
            value={settings.push.achievements}
          />
        </CardContent>
      </Card>

      {/* In-App Notifications */}
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
            value={settings.inApp.exchangeRequests}
          />
          <Separator />
          <NotificationItem
            icon={Calendar}
            label="Session Reminders"
            description="Reminders before your scheduled sessions"
            category="inApp"
            settingKey="sessionReminders"
            value={settings.inApp.sessionReminders}
          />
          <Separator />
          <NotificationItem
            icon={MessageSquare}
            label="Messages"
            description="New messages from other users"
            category="inApp"
            settingKey="messages"
            value={settings.inApp.messages}
          />
          <Separator />
          <NotificationItem
            icon={Star}
            label="Reviews & Ratings"
            description="When someone leaves you a review or rating"
            category="inApp"
            settingKey="reviews"
            value={settings.inApp.reviews}
          />
          <Separator />
          <NotificationItem
            icon={Bell}
            label="Achievements"
            description="Unlock new achievements and milestones"
            category="inApp"
            settingKey="achievements"
            value={settings.inApp.achievements}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Notification Preferences</Button>
      </div>
    </div>
  );
}

export default Page;
