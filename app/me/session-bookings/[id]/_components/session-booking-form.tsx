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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    isRecipient && (booking.status === "pending" || booking.status === "changes_made");

  // Form state for proposer (draft/changes_requested)
  // Use strings to allow clearing input fields completely
  const [daysPerWeek, setDaysPerWeek] = useState(String(booking.daysPerWeek));
  const [selectedDays, setSelectedDays] = useState<string[]>(
    booking.daysOfWeek,
  );
  const [startTime, setStartTime] = useState(booking.startTime);
  const [duration, setDuration] = useState(String(booking.duration));
  const [totalSessions, setTotalSessions] = useState(String(booking.totalSessions));

  // Form state for recipient (pending)
  const [message, setMessage] = useState(booking.message || "");

  const [isSaving, setIsSaving] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);

  // Update form state when booking changes
  useEffect(() => {
    setDaysPerWeek(String(booking.daysPerWeek));
    setSelectedDays(booking.daysOfWeek);
    setStartTime(booking.startTime);
    setDuration(String(booking.duration));
    setTotalSessions(String(booking.totalSessions));
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

      // Parse string values to numbers
      const daysPerWeekNum = parseInt(daysPerWeek, 10);
      const durationNum = parseInt(duration, 10);
      const totalSessionsNum = parseInt(totalSessions, 10);

      // Validation
      if (isEditableForProposer) {
        if (selectedDays.length === 0) {
          toast.error("Please select at least one day of the week");
          setIsSaving(false);
          return;
        }
        if (isNaN(daysPerWeekNum) || daysPerWeekNum < 1 || daysPerWeekNum > 7) {
          toast.error("Days per week must be between 1 and 7");
          setIsSaving(false);
          return;
        }
        if (isNaN(durationNum) || durationNum < 15) {
          toast.error("Duration must be at least 15 minutes");
          setIsSaving(false);
          return;
        }
        if (isNaN(totalSessionsNum) || totalSessionsNum < 1) {
          toast.error("Total sessions must be at least 1");
          setIsSaving(false);
          return;
        }
      } else if (isEditableForRecipient) {
        if (!message || message.trim().length === 0) {
          toast.error("Please enter a message before submitting");
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
        requestBody.daysPerWeek = daysPerWeekNum;
        requestBody.daysOfWeek = selectedDays;
        requestBody.startTime = startTime;
        requestBody.duration = durationNum;
        requestBody.totalSessions = totalSessionsNum;
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

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      setIsAcceptDialogOpen(false);

      const response = await apiPatch<SessionBooking>(
        `/session-bookings/${booking.id}/accept`,
        {},
      );

      if (response.status === "success" && response.data) {
        toast.success("Session booking accepted successfully", {
          description: "Sessions have been created based on the booking details.",
        });

        // Update parent component with new data
        if (onBookingUpdate) {
          onBookingUpdate(response.data);
        }
      } else {
        toast.error("Failed to accept session booking", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Failed to accept session booking", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      });
    } finally {
      setIsAccepting(false);
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
        <>
          {/* Show recipient's message prominently when changes are requested */}
          {booking.status === "changes_requested" && booking.message && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Changes Requested</CardTitle>
                <p className="text-sm text-muted-foreground">
                  The recipient has requested changes to your session proposal. Please review their message below and update the session details accordingly.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Recipient&apos;s Message:</Label>
                  <div className="bg-background border border-destructive/20 rounded-md p-4">
                    <p className="text-sm whitespace-pre-wrap">{booking.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
              {booking.status === "draft" && (
                <p className="text-sm text-muted-foreground">
                  Configure your session details below.
                </p>
              )}
              {booking.status === "changes_requested" && (
                <p className="text-sm text-muted-foreground">
                  Update the session details based on the recipient&apos;s feedback above.
                </p>
              )}
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
                onChange={(e) => setDaysPerWeek(e.target.value)}
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
                onChange={(e) => setDuration(e.target.value)}
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
                onChange={(e) => setTotalSessions(e.target.value)}
                disabled={!isEditableForProposer}
              />
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {booking.status === "changes_requested" ? "Update Proposal" : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
        </>
      )}

      {/* Non-editable fields for proposer */}
      {isProposer && !isEditableForProposer && (
        <>
          {/* Show recipient's message if status is pending and message exists */}
          {booking.status === "pending" && booking.message && (
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">Recipient&apos;s Feedback</CardTitle>
                <p className="text-sm text-muted-foreground">
                  The recipient has sent a message regarding your proposal.
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-background border border-blue-500/20 rounded-md p-4">
                  <p className="text-sm whitespace-pre-wrap">{booking.message}</p>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                {booking.status === "pending"
                  ? "Your session proposal has been sent. You are currently waiting for the recipient to review and respond to your proposal."
                  : booking.status === "changes_made"
                  ? "You have made the requested changes. The recipient will review and respond to your updated proposal."
                  : "Your session proposal details are shown below."}
              </p>
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
        </>
      )}

      {/* Recipient: Current Session Details (pending/changes_made) */}
      {isEditableForRecipient && (
        <Card>
          <CardHeader>
            <CardTitle>Current Session Proposal</CardTitle>
            <p className="text-sm text-muted-foreground">
              {booking.status === "changes_made"
                ? "The proposer has made the requested changes. Review the updated session details below."
                : "Review the proposed session details below before requesting adjustments."}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Days Per Week</Label>
                <p className="text-sm font-medium mt-1">{booking.daysPerWeek}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Duration</Label>
                <p className="text-sm font-medium mt-1">{booking.duration} mins</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Time</Label>
                <p className="text-sm font-medium mt-1">
                  {new Date(`2000-01-01T${booking.startTime}`).toLocaleTimeString(
                    "en-US",
                    { hour: "numeric", minute: "2-digit", hour12: true },
                  )}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Total Sessions</Label>
                <p className="text-sm font-medium mt-1">{booking.totalSessions}</p>
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

      {/* Recipient Accept Button (for changes_made status) */}
      {isRecipient && booking.status === "changes_made" && (
        <>
          <Card>
            <CardContent className="pt-6">
              <Button
                className="w-full sm:w-auto"
                onClick={() => setIsAcceptDialogOpen(true)}
                disabled={isAccepting}
              >
                {isAccepting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Accept Session Booking
              </Button>
            </CardContent>
          </Card>

          <AlertDialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept Session Booking?</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <div>
                      By accepting this session booking, sessions will be automatically created based on the following details:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li>
                        <strong>{booking.totalSessions}</strong> {booking.totalSessions === 1 ? "session" : "sessions"} total
                      </li>
                      <li>
                        <strong>{booking.daysPerWeek}</strong> {booking.daysPerWeek === 1 ? "day" : "days"} per week
                      </li>
                      <li>
                        Days: <strong>{booking.daysOfWeek.join(", ")}</strong>
                      </li>
                      <li>
                        Time: <strong>
                          {new Date(`2000-01-01T${booking.startTime}`).toLocaleTimeString(
                            "en-US",
                            { hour: "numeric", minute: "2-digit", hour12: true },
                          )}
                        </strong>
                      </li>
                      <li>
                        Duration: <strong>{booking.duration} minutes</strong>
                      </li>
                    </ul>
                    <div className="mt-3 font-medium">
                      Are you sure you want to proceed?
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isAccepting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleAccept}
                  disabled={isAccepting}
                >
                  {isAccepting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    "Accept & Create Sessions"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Recipient Editable Field (pending/changes_made) */}
      {isEditableForRecipient && (
        <Card>
          <CardHeader>
            <CardTitle>
              {booking.status === "changes_made" ? "Request More Adjustments" : "Request Adjustments"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {booking.status === "changes_made"
                ? "If you need additional changes, you can request them here. Otherwise, you can accept the updated proposal."
                : "You can suggest changes to the session proposal here."}
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
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !message || message.trim().length === 0} 
              className="w-full sm:w-auto"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recipient Accept Button (for pending status) */}
      {isRecipient && booking.status === "pending" && (
        <>
          <Card>
            <CardContent className="pt-6">
              <Button
                className="w-full sm:w-auto"
                onClick={() => setIsAcceptDialogOpen(true)}
                disabled={isAccepting}
              >
                {isAccepting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Accept Session Booking
              </Button>
            </CardContent>
          </Card>

          <AlertDialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Accept Session Booking?</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2">
                    <div>
                      By accepting this session booking, sessions will be automatically created based on the following details:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li>
                        <strong>{booking.totalSessions}</strong> {booking.totalSessions === 1 ? "session" : "sessions"} total
                      </li>
                      <li>
                        <strong>{booking.daysPerWeek}</strong> {booking.daysPerWeek === 1 ? "day" : "days"} per week
                      </li>
                      <li>
                        Days: <strong>{booking.daysOfWeek.join(", ")}</strong>
                      </li>
                      <li>
                        Time: <strong>
                          {new Date(`2000-01-01T${booking.startTime}`).toLocaleTimeString(
                            "en-US",
                            { hour: "numeric", minute: "2-digit", hour12: true },
                          )}
                        </strong>
                      </li>
                      <li>
                        Duration: <strong>{booking.duration} minutes</strong>
                      </li>
                    </ul>
                    <div className="mt-3 font-medium">
                      Are you sure you want to proceed?
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isAccepting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleAccept}
                  disabled={isAccepting}
                >
                  {isAccepting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    "Accept & Create Sessions"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
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
