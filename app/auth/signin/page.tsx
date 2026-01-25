import type { Metadata } from "next";
import AuthLayout from "../_components/auth-layout";
import SignInForm from "../_components/signin-form";

const baseUrl = "https://skill-barter-connect.vercel.app";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Skill Barter account to continue exchanging skills and learning with others.",
  alternates: {
    canonical: `${baseUrl}/auth/signin`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Sign In | Skill Barter",
    description: "Sign in to your Skill Barter account to continue exchanging skills and learning with others.",
    url: `${baseUrl}/auth/signin`,
    images: [
      {
        url: `${baseUrl}/og-image`,
        width: 1200,
        height: 630,
        alt: "Skill Barter - Sign In",
      },
    ],
  },
};

function SignInPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <SignInForm />
      </div>
    </AuthLayout>
  );
}

export default SignInPage;
