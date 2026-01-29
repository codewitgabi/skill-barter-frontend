"use client";

import { useState, useMemo, useRef, useEffect, startTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { apiPatch } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import type { User } from "@/stores/auth/auth.types";

interface UserResponseData {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  about: string;
  city: string;
  country: string;
  location: string;
  profile_picture: string;
  weekly_availability: number;
  skills: unknown[];
  interests: unknown[];
  skillsToTeach: {
    name: string;
    difficulty: "beginner" | "intermediate" | "advanced";
  }[];
  skillsToLearn: {
    name: string;
    difficulty: "beginner" | "intermediate" | "advanced";
  }[];
  language: string;
  timezone: string;
  website: string;
  createdAt: string;
  updatedAt: string;
}

function mapUserResponseToUser(data: UserResponseData): User {
  return {
    _id: data.id,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.username,
    email: data.email,
    about: data.about,
    city: data.city,
    country: data.country,
    profile_picture: data.profile_picture,
    weekly_availability: data.weekly_availability,
    skills: data.skills,
    interests: data.interests,
    skillsToTeach: data.skillsToTeach || [],
    skillsToLearn: data.skillsToLearn || [],
    language: data.language,
    timezone: data.timezone,
    website: data.website || "",
    deletedAt: null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

function GeneralSettings() {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const defaultSettings = useMemo(
    () => ({
      language: user?.language || "en",
      timezone: user?.timezone || "UTC",
    }),
    [user?.language, user?.timezone],
  );

  const [language, setLanguage] = useState(() => defaultSettings.language);
  const [timezone, setTimezone] = useState(() => defaultSettings.timezone);
  const previousUserIdRef = useRef<string | null>(null);

  // Reset settings when user data changes
  // Note: We use an effect here because React recommends using a key prop for this pattern,
  // but we can't control the key from inside the component. Using startTransition to
  // mark this as a non-urgent update, minimizing render blocking.
  useEffect(() => {
    if (user && previousUserIdRef.current !== user._id) {
      previousUserIdRef.current = user._id;
      startTransition(() => {
        setLanguage(defaultSettings.language);
        setTimezone(defaultSettings.timezone);
      });
    }
  }, [user?._id, defaultSettings, user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await apiPatch<UserResponseData>("/users/me", {
        language,
        timezone,
      });

      if (response.status === "success" && response.data) {
        const updatedUser = mapUserResponseToUser(response.data);
        setUser(updatedUser);
        toast.success("General settings saved successfully");
      } else {
        const errorResponse = response as { error: { message: string } };
        toast.error("Failed to save settings", {
          description: errorResponse.error?.message || "Please try again.",
        });
      }
    } catch {
      toast.error("Failed to save settings", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Manage your general account preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <optgroup label="UTC">
              <option value="UTC">UTC (Coordinated Universal Time)</option>
            </optgroup>
            <optgroup label="North America">
              <option value="America/New_York">
                Eastern Time (ET) - New York
              </option>
              <option value="America/Chicago">
                Central Time (CT) - Chicago
              </option>
              <option value="America/Denver">
                Mountain Time (MT) - Denver
              </option>
              <option value="America/Los_Angeles">
                Pacific Time (PT) - Los Angeles
              </option>
              <option value="America/Phoenix">
                Mountain Time (MST) - Phoenix
              </option>
              <option value="America/Anchorage">
                Alaska Time (AKT) - Anchorage
              </option>
              <option value="Pacific/Honolulu">
                Hawaii Time (HST) - Honolulu
              </option>
              <option value="America/Toronto">Eastern Time - Toronto</option>
              <option value="America/Vancouver">
                Pacific Time - Vancouver
              </option>
            </optgroup>
            <optgroup label="Europe">
              <option value="Europe/London">
                Greenwich Mean Time (GMT) - London
              </option>
              <option value="Europe/Paris">
                Central European Time (CET) - Paris
              </option>
              <option value="Europe/Berlin">
                Central European Time - Berlin
              </option>
              <option value="Europe/Rome">Central European Time - Rome</option>
              <option value="Europe/Madrid">
                Central European Time - Madrid
              </option>
              <option value="Europe/Amsterdam">
                Central European Time - Amsterdam
              </option>
              <option value="Europe/Stockholm">
                Central European Time - Stockholm
              </option>
              <option value="Europe/Moscow">Moscow Time (MSK)</option>
              <option value="Europe/Istanbul">
                Turkey Time (TRT) - Istanbul
              </option>
            </optgroup>
            <optgroup label="Asia">
              <option value="Asia/Dubai">
                Gulf Standard Time (GST) - Dubai
              </option>
              <option value="Asia/Karachi">Pakistan Standard Time (PKT)</option>
              <option value="Asia/Kolkata">
                India Standard Time (IST) - Mumbai
              </option>
              <option value="Asia/Dhaka">Bangladesh Standard Time (BST)</option>
              <option value="Asia/Bangkok">
                Indochina Time (ICT) - Bangkok
              </option>
              <option value="Asia/Singapore">Singapore Time (SGT)</option>
              <option value="Asia/Hong_Kong">Hong Kong Time (HKT)</option>
              <option value="Asia/Shanghai">
                China Standard Time (CST) - Shanghai
              </option>
              <option value="Asia/Tokyo">
                Japan Standard Time (JST) - Tokyo
              </option>
              <option value="Asia/Seoul">
                Korea Standard Time (KST) - Seoul
              </option>
            </optgroup>
            <optgroup label="Australia & Pacific">
              <option value="Australia/Sydney">
                Australian Eastern Time (AET) - Sydney
              </option>
              <option value="Australia/Melbourne">
                Australian Eastern Time - Melbourne
              </option>
              <option value="Australia/Brisbane">
                Australian Eastern Standard Time - Brisbane
              </option>
              <option value="Australia/Perth">
                Australian Western Time (AWST) - Perth
              </option>
              <option value="Pacific/Auckland">
                New Zealand Time (NZST) - Auckland
              </option>
            </optgroup>
            <optgroup label="South America">
              <option value="America/Sao_Paulo">
                Brasília Time (BRT) - São Paulo
              </option>
              <option value="America/Argentina/Buenos_Aires">
                Argentina Time (ART) - Buenos Aires
              </option>
              <option value="America/Lima">Peru Time (PET) - Lima</option>
              <option value="America/Santiago">
                Chile Time (CLT) - Santiago
              </option>
            </optgroup>
            <optgroup label="Africa & Middle East">
              <option value="Africa/Cairo">
                Eastern European Time (EET) - Cairo
              </option>
              <option value="Africa/Johannesburg">
                South Africa Standard Time (SAST)
              </option>
              <option value="Africa/Lagos">
                West Africa Time (WAT) - Lagos
              </option>
              <option value="Asia/Riyadh">
                Arabia Standard Time (AST) - Riyadh
              </option>
              <option value="Asia/Tehran">
                Iran Standard Time (IRST) - Tehran
              </option>
              <option value="Asia/Jerusalem">
                Israel Standard Time (IST) - Jerusalem
              </option>
            </optgroup>
          </select>
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default GeneralSettings;
