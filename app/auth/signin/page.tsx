import type { Metadata } from "next";
import AuthLayout from "../_components/auth-layout";
import SignInForm from "../_components/signin-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Skill Barter account to continue exchanging skills and learning with others.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Sign In | Skill Barter",
    description: "Sign in to your Skill Barter account to continue exchanging skills and learning with others.",
    images: [
      {
        url: "/og-image",
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
