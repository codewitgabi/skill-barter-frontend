import type { Metadata } from "next";
import AuthLayout from "../_components/auth-layout";
import ForgotPasswordForm from "./_components/forgot-password-form";

const baseUrl = "https://skill-barter-connect.vercel.app";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your Skill Barter account password. Enter your email to receive a verification code.",
  alternates: {
    canonical: `${baseUrl}/auth/forgot-password`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Forgot Password | Skill Barter",
    description:
      "Reset your Skill Barter account password. Enter your email to receive a verification code.",
    url: `${baseUrl}/auth/forgot-password`,
    images: [
      {
        url: `${baseUrl}/og-image`,
        width: 1200,
        height: 630,
        alt: "Skill Barter - Forgot Password",
      },
    ],
  },
};

function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <ForgotPasswordForm />
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
