import QuickStart from "./_components/quick-start";
import UpcomingSessions from "./_components/upcoming-sessions";
import QuickActions from "./_components/quick-actions";
import QuickExchanges from "./_components/quick-exchanges";
import ExchangeRequests from "./_components/exchange-requests";
import SkillProgress from "./_components/skill-progress";
import RecentActivity from "./_components/recent-activity";
import CommunityHighlights from "./_components/community-highlights";

function Page() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar - Sticky */}
        <aside className="w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            <QuickStart />
            <UpcomingSessions />
            <QuickActions />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your skill exchanges
            </p>
          </div>

          <QuickExchanges />
          <ExchangeRequests />
          <SkillProgress />
          <RecentActivity />
          <CommunityHighlights />
        </main>
      </div>
    </div>
  );
}

export default Page;
