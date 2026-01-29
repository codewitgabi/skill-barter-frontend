"use client";

import ProfilePicture from "./_components/profile-picture";
import PersonalInformation from "./_components/personal-information";
import SkillsToTeach from "./_components/skills-to-teach";
import SkillsToLearn from "./_components/skills-to-learn";

function Page() {
  return (
    <div className="space-y-6">
      <ProfilePicture />
      <PersonalInformation />
      <SkillsToTeach />
      <SkillsToLearn />
    </div>
  );
}

export default Page;
