"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, PenLine, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiPost } from "@/lib/api-client";
import { trackReviewSubmit } from "@/lib/analytics";
import type { UserSkill } from "./types";

interface WriteReviewDialogProps {
  userId: string;
  userName: string;
  skills: UserSkill[];
  onReviewSubmitted?: () => void;
}

function StarRatingInput({
  rating,
  onRatingChange,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-1 transition-transform hover:scale-110 focus:outline-none"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors",
              (hoverRating || rating) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function WriteReviewDialog({
  userId,
  userName,
  skills,
  onReviewSubmitted,
}: WriteReviewDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [skill, setSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!skill) {
      toast.error("Please select a skill");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Please write a review with at least 10 characters");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await apiPost(`/users/${userId}/reviews`, {
        rating,
        comment: comment.trim(),
        skill,
      });

      if (response.status === "success") {
        trackReviewSubmit(userId, rating, skill);
        toast.success("Review submitted!", {
          description: `Your review for ${userName} has been posted.`,
        });
        setOpen(false);
        resetForm();
        onReviewSubmitted?.();
        // Refresh the page to show the new review
        router.refresh();
      } else {
        const errorResponse = response as { error?: { message?: string } };
        toast.error("Failed to submit review", {
          description: errorResponse.error?.message || "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Failed to submit review", {
        description:
          error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setSkill("");
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "Select a rating";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PenLine className="h-4 w-4" />
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            Write a Review
          </DialogTitle>
          <DialogDescription>
            Share your experience with {userName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Rating */}
          <div className="space-y-3">
            <Label>Your Rating</Label>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/30">
              <StarRatingInput rating={rating} onRatingChange={setRating} />
              <span
                className={cn(
                  "text-sm font-medium",
                  rating > 0 ? "text-yellow-600" : "text-muted-foreground"
                )}
              >
                {getRatingText()}
              </span>
            </div>
          </div>

          {/* Skill */}
          <div className="space-y-2">
            <Label htmlFor="skill">Skill Reviewed</Label>
            <Select value={skill} onValueChange={setSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the skill this review is about
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience... What did you learn? How was the teaching style?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/500 characters (minimum 10)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !skill || comment.trim().length < 10}
              className="bg-linear-to-r from-emerald-500 via-blue-500 to-purple-600 text-white hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WriteReviewDialog;
