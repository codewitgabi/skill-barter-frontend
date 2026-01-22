import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Video, Calendar, ExternalLink } from "lucide-react";
import type { ISession } from "./types";

interface SessionDetailsDialogProps {
  session: ISession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin?: (id: number) => void;
}

function SessionDetailsDialog({
  session,
  open,
  onOpenChange,
  onJoin,
}: SessionDetailsDialogProps) {
  if (!session) return null;

  const getStatusColor = () => {
    switch (session.status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "scheduled":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  const getTypeColor = () => {
    return session.type === "Learning"
      ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      : "bg-orange-500/10 text-orange-700 dark:text-orange-400";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={session.partner.avatar}
                alt={session.partner.name}
              />
              <AvatarFallback className="bg-linear-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6] text-white">
                {session.partner.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl">{session.skill}</DialogTitle>
              <DialogDescription>
                {session.type} session with {session.partner.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs font-medium ${getTypeColor()}`}
            >
              {session.type}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-medium border ${getStatusColor()}`}
            >
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">
              {session.description}
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Scheduled:</span>
              <span className="font-medium">{session.scheduledTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{session.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {session.location === "online" ? (
                <Video className="h-4 w-4 text-muted-foreground" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium capitalize">{session.location}</span>
            </div>
            {session.meetingLink && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Meeting Link
                </a>
              </div>
            )}
          </div>

          {/* Objectives */}
          {session.objectives.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">
                Learning Objectives
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {session.objectives.map((objective, idx) => (
                  <li key={idx}>{objective}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          {session.status === "active" && session.meetingLink && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  onJoin?.(session.id);
                  onOpenChange(false);
                }}
                className="flex-1 rounded-full"
              >
                <Video className="h-4 w-4 mr-2" />
                Join Session
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SessionDetailsDialog;
