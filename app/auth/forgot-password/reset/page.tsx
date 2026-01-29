import type { Metadata } from "next";
import AuthLayout from "../../_components/auth-layout";
import ResetPasswordForm from "./_components/reset-password-form";

const baseUrl = "https://skill-barter-connect.vercel.app";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your Skill Barter account.",
  alternates: {
    canonical: `${baseUrl}/auth/forgot-password/reset`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Reset Password | Skill Barter",
    description: "Create a new password for your Skill Barter account.",
    url: `${baseUrl}/auth/forgot-password/reset`,
    images: [
      {
        url: `${baseUrl}/og-image`,
        width: 1200,
        height: 630,
        alt: "Skill Barter - Reset Password",
      },
    ],
  },
};

function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <ResetPasswordForm />
      </div>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
