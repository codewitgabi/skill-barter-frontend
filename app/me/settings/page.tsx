"use client";

import GeneralSettings from "./_components/general-settings";
import AppInstallation from "./_components/app-installation";
import AccountActions from "./_components/account-actions";

function Page() {
  return (
    <div className="space-y-6">
      <GeneralSettings />
      <AppInstallation />
      <AccountActions />
    </div>
  );
}

export default Page;
