import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Reset your Skill Barter account password. Enter your email to receive password reset instructions.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Forgot Password | Skill Barter",
    description:
      "Reset your Skill Barter account password. Enter your email to receive password reset instructions.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Skill Barter - Forgot Password",
      },
    ],
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
