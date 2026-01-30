import { ReactNode } from "react";
import { AppNavbar } from "@/components/navbar";

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppNavbar />
      {/* Add bottom padding on mobile to account for bottom navigation */}
      <div className="pb-20 md:pb-0">{children}</div>
    </>
  );
}

export default Layout;
