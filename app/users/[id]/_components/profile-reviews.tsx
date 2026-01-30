"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import type { UserReview } from "./types";

interface ProfileReviewsProps {
  reviews: UserReview[];
  averageRating: number;
  totalReviews: number;
}

function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: UserReview }) {
  return (
    <div className="p-4 sm:p-5 rounded-xl border bg-linear-to-r from-background to-muted/20">
      <div className="flex items-start gap-4">
        <Link href={`/users/${review.reviewer.id}`}>
          <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.name} />
            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-blue-500 text-white font-medium">
              {review.reviewer.initials}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <Link href={`/users/${review.reviewer.id}`}>
                <p className="font-semibold hover:text-primary transition-colors cursor-pointer">{review.reviewer.name}</p>
              </Link>
              <p className="text-sm text-muted-foreground">
                @{review.reviewer.username}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StarRating rating={review.rating} />
              <span className="text-sm text-muted-foreground">
                {formatReviewDate(review.createdAt)}
              </span>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="mt-3 bg-primary/10 text-primary border-0"
          >
            {review.skill}
          </Badge>

          <p className="mt-3 text-muted-foreground leading-relaxed">
            &ldquo;{review.comment}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileReviews({
  reviews,
  averageRating,
  totalReviews,
}: ProfileReviewsProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            Reviews
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{averageRating}</span>
            </div>
            <span className="text-muted-foreground">{totalReviews} reviews</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review, index) => (
          <div key={review.id}>
            <ReviewCard review={review} />
            {index < reviews.length - 1 && (
              <Separator className="my-4 bg-transparent" />
            )}
          </div>
        ))}

        {/* Load More Button */}
        <div className="pt-4 text-center">
          <Button variant="outline" className="px-8">
            Load More Reviews
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileReviews;
