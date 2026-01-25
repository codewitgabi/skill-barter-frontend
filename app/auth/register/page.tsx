import type { Metadata } from "next";
import AuthLayout from "../_components/auth-layout";
import RegisterForm from "./_components/register-form";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your Skill Barter account and start exchanging skills with others. Join a community of learners and teachers.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Register | Skill Barter",
    description:
      "Create your Skill Barter account and start exchanging skills with others. Join a community of learners and teachers.",
    images: [
      {
        url: "/og-image",
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
