import SessionBookingCard from "./session-booking-card";

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

interface SessionBookingListProps {
  bookings: SessionBooking[];
  onBookingClick: (bookingId: string) => void;
}

function SessionBookingList({
  bookings,
  onBookingClick,
}: SessionBookingListProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {bookings.map((booking) => (
        <SessionBookingCard
          key={booking.id}
          booking={booking}
          onClick={() => onBookingClick(booking.id)}
        />
      ))}
    </div>
  );
}

export default SessionBookingList;
