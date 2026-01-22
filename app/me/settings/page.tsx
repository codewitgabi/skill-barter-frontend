"use client";

import GeneralSettings from "./_components/general-settings";
import AccountActions from "./_components/account-actions";

function Page() {
  return (
    <div className="space-y-6">
      <GeneralSettings />
      <AccountActions />
    </div>
  );
}

export default Page;
