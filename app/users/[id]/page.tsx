import type { Metadata } from "next";
import ProfileHeader from "./_components/profile-header";
import ProfileStats from "./_components/profile-stats";
import ProfileAbout from "./_components/profile-about";
import ProfileSkills from "./_components/profile-skills";
import ProfileReviews from "./_components/profile-reviews";
import ProfileNotFound from "./_components/profile-not-found";
import { fetchUserProfile, getCurrentUserId } from "./_components/fetch-profile";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  const { profile } = await fetchUserProfile(id);
  
  if (!profile) {
    return {
      title: "User Not Found | SkillBarter",
      description: "The user you're looking for doesn't exist.",
    };
  }
  
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const title = `${fullName} (@${profile.username}) | SkillBarter`;
  const description = profile.bio
    ? profile.bio.slice(0, 160) + (profile.bio.length > 160 ? "..." : "")
    : `Connect with ${fullName} on SkillBarter. ${profile.stats.completedSessions} sessions completed with a ${profile.stats.averageRating} rating.`;
  
  const skillsTeaching = profile.skillsToTeach.map((s) => s.name).join(", ");
  const skillsLearning = profile.skillsToLearn.map((s) => s.name).join(", ");

  return {
    title,
    description,
    keywords: [
      fullName,
      profile.username,
      "skill exchange",
      "learn",
      "teach",
      ...profile.skillsToTeach.map((s) => s.name),
      ...profile.skillsToLearn.map((s) => s.name),
    ],
    authors: [{ name: fullName }],
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/users/${id}`,
      images: profile.avatar
        ? [
            {
              url: profile.avatar,
              width: 400,
              height: 400,
              alt: `${fullName}'s profile picture`,
            },
          ]
        : [],
      siteName: "SkillBarter",
      firstName: profile.firstName,
      lastName: profile.lastName,
      username: profile.username,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.avatar ? [profile.avatar] : [],
    },
    other: {
      "profile:skills_teaching": skillsTeaching,
      "profile:skills_learning": skillsLearning,
      "profile:rating": profile.stats.averageRating.toString(),
      "profile:sessions": profile.stats.completedSessions.toString(),
      "profile:location": `${profile.location.city}, ${profile.location.country}`,
    },
  };
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch profile and current user ID in parallel
  const [{ profile }, currentUserId] = await Promise.all([
    fetchUserProfile(id),
    getCurrentUserId(),
  ]);

  if (!profile) {
    return <ProfileNotFound />;
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const isOwnProfile = currentUserId === profile.id;

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <ProfileHeader profile={profile} currentUserId={currentUserId} />
          
          <ProfileStats stats={profile.stats} />
          
          <ProfileAbout bio={profile.bio} />
          
          <ProfileSkills
            skillsToTeach={profile.skillsToTeach}
            skillsToLearn={profile.skillsToLearn}
          />
          
          <ProfileReviews
            reviews={profile.reviews}
            averageRating={profile.stats.averageRating}
            totalReviews={profile.stats.totalReviews}
            userId={profile.id}
            userName={fullName}
            skills={profile.skillsToTeach}
            connectionStatus={profile.connectionStatus}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
