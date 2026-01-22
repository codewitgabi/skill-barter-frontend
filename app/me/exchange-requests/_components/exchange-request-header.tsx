interface ExchangeRequestHeaderProps {
  displayedCount: number;
  totalCount?: number;
}

function ExchangeRequestHeader({
  displayedCount,
  totalCount,
}: ExchangeRequestHeaderProps) {
  return (
    <>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Exchange Requests
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          People who want to exchange skills with you. Accept to start a session.
        </p>
      </div>

      {displayedCount > 0 && (
        <div className="mb-3 sm:mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {displayedCount}
            </span>{" "}
            {displayedCount === 1 ? "request" : "requests"} pending
            {totalCount && totalCount > displayedCount && (
              <span className="text-muted-foreground/70">
                {" "}of {totalCount}
              </span>
            )}
          </p>
        </div>
      )}
    </>
  );
}

export default ExchangeRequestHeader;
