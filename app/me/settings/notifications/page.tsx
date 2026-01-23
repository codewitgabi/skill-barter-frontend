"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import EmailNotifications from "./_components/email-notifications";
import PushNotifications from "./_components/push-notifications";
import InAppNotifications from "./_components/in-app-notifications";
import type { NotificationSettings } from "./_components/types";
import { apiGet, apiPatch } from "@/lib/api-client";

function Page() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiGet<NotificationSettings>(
          "/notification-settings",
        );

        if (response.status === "success" && response.data) {
          setSettings(response.data);
        } else {
          toast.error("Failed to load notification settings");
        }
      } catch {
        toast.error("Failed to load notification settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSetting = (
    category: keyof NotificationSettings,
    settingKey: string,
    value: boolean,
  ) => {
    if (!settings) return;

    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [settingKey]: value,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const response = await apiPatch<NotificationSettings>(
        "/notification-settings",
        settings,
      );

      if (response.status === "success") {
        toast.success("Notification settings saved successfully");
      } else {
        toast.error("Failed to save notification settings");
      }
    } catch {
      toast.error("Failed to save notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Failed to load notification settings
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmailNotifications settings={settings.email} onUpdate={updateSetting} />
      <PushNotifications settings={settings.push} onUpdate={updateSetting} />
      <InAppNotifications settings={settings.inApp} onUpdate={updateSetting} />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Notification Preferences"
          )}
        </Button>
      </div>
    </div>
  );
}

export default Page;
