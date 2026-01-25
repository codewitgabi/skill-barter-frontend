"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiPatch } from "@/lib/api-client";

interface SessionBooking {
  id: string;
  userRole: string;
  exchangeRequest: {
    id: string;
    teachingSkill: string;
    learningSkill: string;
    status: string;
  };
  proposer: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
  };
  recipient: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    initials: string;
  };
  skill: string;
  status: string;
  daysPerWeek: number;
  daysOfWeek: string[];
  startTime: string;
  duration: number;
  totalSessions: number;
  message: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface SessionBookingFormProps {
  booking: SessionBooking;
  onBookingUpdate?: (updatedBooking: SessionBooking) => void;
}

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function SessionBookingForm({ booking, onBookingUpdate }: SessionBookingFormProps) {
  const isProposer = booking.userRole === "proposer";
  const isRecipient = booking.userRole === "recipient";
  const isEditableForProposer =
    isProposer &&
    (booking.status === "draft" || booking.status === "changes_requested");
  const isEditableForRecipient =
    isRecipient && booking.status === "pending";

  // Form state for proposer (draft/changes_requested)
  const [daysPerWeek, setDaysPerWeek] = useState(booking.daysPerWeek);
  const [selectedDays, setSelectedDays] = useState<string[]>(
    booking.daysOfWeek,
  );
  const [startTime, setStartTime] = useState(booking.startTime);
  const [duration, setDuration] = useState(booking.duration);
  const [totalSessions, setTotalSessions] = useState(booking.totalSessions);

  // Form state for recipient (pending)
  const [message, setMessage] = useState(booking.message || "");

  const [isSaving, setIsSaving] = useState(false);

  // Update form state when booking changes
  useEffect(() => {
    setDaysPerWeek(booking.daysPerWeek);
    setSelectedDays(booking.daysOfWeek);
    setStartTime(booking.startTime);
    setDuration(booking.duration);
    setTotalSessions(booking.totalSessions);
    setMessage(booking.message || "");
  }, [booking]);

  const handleDayToggle = (day: string) => {
    if (!isEditableForProposer) return;

    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validation
      if (isEditableForProposer) {
        if (selectedDays.length === 0) {
          toast.error("Please select at least one day of the week");
          setIsSaving(false);
          return;
        }
        if (daysPerWeek < 1 || daysPerWeek > 7) {
          toast.error("Days per week must be between 1 and 7");
          setIsSaving(false);
          return;
        }
        if (duration < 15) {
          toast.error("Duration must be at least 15 minutes");
          setIsSaving(false);
          return;
        }
        if (totalSessions < 1) {
          toast.error("Total sessions must be at least 1");
          setIsSaving(false);
          return;
        }
      }

      // Build request body based on user role
      const requestBody: {
        daysPerWeek?: number;
        daysOfWeek?: string[];
        startTime?: string;
        duration?: number;
        totalSessions?: number;
        message?: string | null;
      } = {};

      if (isEditableForProposer) {
        // Proposer: send all fields except message
        requestBody.daysPerWeek = daysPerWeek;
        requestBody.daysOfWeek = selectedDays;
        requestBody.startTime = startTime;
        requestBody.duration = duration;
        requestBody.totalSessions = totalSessions;
      } else if (isEditableForRecipient) {
        // Recipient: only send message
        requestBody.message = message || null;
      }

      const response = await apiPatch<SessionBooking>(
        `/session-bookings/${booking.id}`,
        requestBody,
      );

      if (response.status === "success" && response.data) {
        toast.success("Session booking updated successfully", {
          description: "Your changes have been saved.",
        });
        
        // Update parent component with new data
        if (onBookingUpdate) {
          onBookingUpdate(response.data);
        }
      } else {
        toast.error("Failed to update session booking", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Failed to update session booking", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Non-editable: Skill and Status */}
      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Skill</Label>
              <p className="text-sm font-medium mt-1">{booking.skill}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <p className="text-sm font-medium mt-1 capitalize">{booking.status.replace("_", " ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposer Editable Fields (draft/changes_requested) */}
      {isEditableForProposer && (
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Days Per Week */}
            <div className="space-y-2">
              <Label htmlFor="daysPerWeek">Days Per Week</Label>
              <Input
                id="daysPerWeek"
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value) || 1)}
                disabled={!isEditableForProposer}
              />
            </div>

            {/* Days of Week */}
            <div className="space-y-2">
              <Label>Days of Week</Label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="flex items-center space-x-2"
                    onClick={() => handleDayToggle(day)}
                  >
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      disabled={!isEditableForProposer}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label
                      htmlFor={day}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {day.slice(0, 3)}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={!isEditableForProposer}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
                disabled={!isEditableForProposer}
              />
            </div>

            {/* Total Sessions */}
            <div className="space-y-2">
              <Label htmlFor="totalSessions">Total Sessions</Label>
              <Input
                id="totalSessions"
                type="number"
                min="1"
                value={totalSessions}
                onChange={(e) =>
                  setTotalSessions(parseInt(e.target.value) || 1)
                }
                disabled={!isEditableForProposer}
              />
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Non-editable fields for proposer */}
      {isProposer && !isEditableForProposer && (
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Days Per Week</Label>
                <p className="text-sm font-medium">{booking.daysPerWeek}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Duration</Label>
                <p className="text-sm font-medium">{booking.duration} mins</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Time</Label>
                <p className="text-sm font-medium">
                  {new Date(`2000-01-01T${booking.startTime}`).toLocaleTimeString(
                    "en-US",
                    { hour: "numeric", minute: "2-digit", hour12: true },
                  )}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Sessions</Label>
                <p className="text-sm font-medium">{booking.totalSessions}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Days of Week</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {booking.daysOfWeek.map((day) => (
                  <Badge key={day} variant="secondary">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recipient Editable Field (pending) */}
      {isEditableForRecipient && (
        <Card>
          <CardHeader>
            <CardTitle>Request Adjustments</CardTitle>
            <p className="text-sm text-muted-foreground">
              You can suggest changes to the session proposal here.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Suggest any adjustments to the session schedule..."
                rows={5}
                disabled={!isEditableForRecipient}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recipient Accept Button */}
      {isRecipient && (
        <Card>
          <CardContent className="pt-6">
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                // TODO: Implement accept logic
                console.log("Accept clicked");
              }}
            >
              Accept Session Booking
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Non-editable fields for recipient (when not pending) */}
      {isRecipient && !isEditableForRecipient && (
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Days Per Week</Label>
                <p className="text-sm font-medium">{booking.daysPerWeek}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Duration</Label>
                <p className="text-sm font-medium">{booking.duration} mins</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Time</Label>
                <p className="text-sm font-medium">
                  {new Date(`2000-01-01T${booking.startTime}`).toLocaleTimeString(
                    "en-US",
                    { hour: "numeric", minute: "2-digit", hour12: true },
                  )}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Sessions</Label>
                <p className="text-sm font-medium">{booking.totalSessions}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Days of Week</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {booking.daysOfWeek.map((day) => (
                  <Badge key={day} variant="secondary">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
            {booking.message && (
              <div>
                <Label className="text-muted-foreground">Message</Label>
                <p className="text-sm mt-1">{booking.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SessionBookingForm;
