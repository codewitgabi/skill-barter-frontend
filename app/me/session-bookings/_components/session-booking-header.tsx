interface SessionBookingHeaderProps {
  totalCount: number;
}

function SessionBookingHeader({ totalCount }: SessionBookingHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Session Bookings</h1>
      <p className="text-sm sm:text-base text-muted-foreground">
        Manage your session bookings and schedules
        {totalCount > 0 && (
          <span className="ml-2 font-semibold text-foreground">
            ({totalCount} {totalCount === 1 ? "booking" : "bookings"})
          </span>
        )}
      </p>
    </div>
  );
}

export default SessionBookingHeader;
