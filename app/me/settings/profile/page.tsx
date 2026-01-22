"use client";

import ProfilePicture from "./_components/profile-picture";
import PersonalInformation from "./_components/personal-information";
import SkillsAndInterests from "./_components/skills-and-interests";

function Page() {
  return (
    <div className="space-y-6">
      <ProfilePicture />
      <PersonalInformation />
      <SkillsAndInterests />
    </div>
  );
}

export default Page;
