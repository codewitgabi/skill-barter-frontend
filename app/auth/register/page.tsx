import type { Metadata } from "next";
import AuthLayout from "../_components/auth-layout";
import RegisterForm from "./_components/register-form";

const baseUrl = "https://skill-barter-connect.vercel.app";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Skill Barter account and start exchanging skills with others. Join a community of learners and teachers.",
  alternates: {
    canonical: `${baseUrl}/auth/register`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Register | Skill Barter",
    description:
      "Create your Skill Barter account and start exchanging skills with others. Join a community of learners and teachers.",
    url: `${baseUrl}/auth/register`,
    images: [
      {
        url: `${baseUrl}/og-image`,
        width: 1200,
        height: 630,
        alt: "Skill Barter - Register",
      },
    ],
  },
};

function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
