import { ReactNode } from "react";
import { AuthLayout } from "./_components/auth-layout";

function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

export default Layout;
