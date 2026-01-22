"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EmailNotifications from "./_components/email-notifications";
import PushNotifications from "./_components/push-notifications";
import InAppNotifications from "./_components/in-app-notifications";
import type { NotificationSettings } from "./_components/types";

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

  return (
    <div className="space-y-6">
      <EmailNotifications
        settings={settings.email}
        onUpdate={updateSetting}
      />
      <PushNotifications
        settings={settings.push}
        onUpdate={updateSetting}
      />
      <InAppNotifications
        settings={settings.inApp}
        onUpdate={updateSetting}
      />
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Notification Preferences</Button>
      </div>
    </div>
  );
}

export default Page;
