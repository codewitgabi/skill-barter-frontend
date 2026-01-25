"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiGet } from "@/lib/api-client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SessionBookingDetailHeader from "./_components/session-booking-detail-header";
import SessionBookingForm from "./_components/session-booking-form";

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

function Page() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const [booking, setBooking] = useState<SessionBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<SessionBooking>(
          `/session-bookings/${bookingId}`,
        );

        if (response.status === "success" && response.data) {
          setBooking(response.data);
        } else {
          toast.error("Failed to load session booking", {
            description: "Please try again later.",
          });
          router.push("/@me/session-bookings");
        }
      } catch (error) {
        toast.error("Failed to load session booking", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
        router.push("/@me/session-bookings");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">
              Loading session booking...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/@me/session-bookings")}
          className="mb-4 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Session Bookings
        </Button>

        {/* Header */}
        <SessionBookingDetailHeader booking={booking} />

        {/* Form */}
        <SessionBookingForm booking={booking} />
      </div>
    </div>
  );
}

export default Page;
