"use client";

import SkillsToTeach from "./_components/skills-to-teach";
import SkillsToLearn from "./_components/skills-to-learn";

function SkillsSettingsPage() {
  return (
    <div className="space-y-6">
      <SkillsToTeach />
      <SkillsToLearn />
    </div>
  );
}

export default SkillsSettingsPage;
