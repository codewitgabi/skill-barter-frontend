import type { Metadata } from "next";
import AuthLayout from "../../_components/auth-layout";
import VerifyOtpForm from "./_components/verify-otp-form";

const baseUrl = "https://skill-barter-connect.vercel.app";

export const metadata: Metadata = {
  title: "Verify Code",
  description:
    "Enter the verification code sent to your email to reset your password.",
  alternates: {
    canonical: `${baseUrl}/auth/forgot-password/verify`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Verify Code | Skill Barter",
    description:
      "Enter the verification code sent to your email to reset your password.",
    url: `${baseUrl}/auth/forgot-password/verify`,
    images: [
      {
        url: `${baseUrl}/og-image`,
        width: 1200,
        height: 630,
        alt: "Skill Barter - Verify Code",
      },
    ],
  },
};

function VerifyOtpPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <VerifyOtpForm />
      </div>
    </AuthLayout>
  );
}

export default VerifyOtpPage;
