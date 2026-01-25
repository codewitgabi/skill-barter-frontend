"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiGet } from "@/lib/api-client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SessionBookingHeader from "./_components/session-booking-header";
import SessionBookingEmpty from "./_components/session-booking-empty";
import SessionBookingList from "./_components/session-booking-list";

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

interface SessionBookingsData {
  draftBookings: SessionBooking[];
  pendingBookings: SessionBooking[];
  changesRequestedBookings: SessionBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function Page() {
  const router = useRouter();
  const [allBookings, setAllBookings] = useState<SessionBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "proposer" | "recipient">("all");

  useEffect(() => {
    const fetchSessionBookings = async () => {
      try {
        setIsLoading(true);
        const response = await apiGet<SessionBookingsData>("/session-bookings");

        if (response.status === "success" && response.data) {
          // Combine all booking types into one array
          const combined = [
            ...response.data.draftBookings,
            ...response.data.pendingBookings,
            ...response.data.changesRequestedBookings,
          ];
          setAllBookings(combined);
        } else {
          toast.error("Failed to load session bookings", {
            description: "Please try again later.",
          });
        }
      } catch (error) {
        toast.error("Failed to load session bookings", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionBookings();
  }, []);

  const handleBookingClick = (bookingId: string) => {
    router.push(`/@me/session-bookings/${bookingId}`);
  };

  // Filter bookings by role
  const filteredBookings = useMemo(() => {
    if (activeFilter === "all") {
      return allBookings;
    }
    return allBookings.filter(
      (booking) => booking.userRole === activeFilter,
    );
  }, [allBookings, activeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const proposerCount = allBookings.filter(
      (b) => b.userRole === "proposer",
    ).length;
    const recipientCount = allBookings.filter(
      (b) => b.userRole === "recipient",
    ).length;
    return {
      total: allBookings.length,
      proposer: proposerCount,
      recipient: recipientCount,
    };
  }, [allBookings]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading session bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto">
        <SessionBookingHeader totalCount={allBookings.length} />

        {/* Tabs */}
        {allBookings.length > 0 && (
          <Tabs
            value={activeFilter}
            onValueChange={(value) =>
              setActiveFilter(value as "all" | "proposer" | "recipient")
            }
            className="mb-4 sm:mb-6"
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-initial">
                All ({stats.total})
              </TabsTrigger>
              <TabsTrigger value="proposer" className="flex-1 sm:flex-initial">
                Proposing ({stats.proposer})
              </TabsTrigger>
              <TabsTrigger value="recipient" className="flex-1 sm:flex-initial">
                Recipient ({stats.recipient})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {filteredBookings.length === 0 ? (
          <SessionBookingEmpty />
        ) : (
          <SessionBookingList
            bookings={filteredBookings}
            onBookingClick={handleBookingClick}
          />
        )}
      </div>
    </div>
  );
}

export default Page;
