import type { Metadata } from "next";
import { Elms_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const elmsSans = Elms_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Skill Barter - Exchange Skills, Learn Together",
    template: "%s | Skill Barter",
  },
  description:
    "Connect with others to exchange skills and learn together. Teach what you know, learn what you need.",
  keywords: [
    "skill exchange",
    "learn skills",
    "teach skills",
    "skill sharing",
    "peer learning",
    "skill barter",
  ],
  authors: [{ name: "Skill Barter" }],
  creator: "Skill Barter",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skill-barter-connect.vercel.app",
    siteName: "Skill Barter Connect",
    title: "Skill Barter - Exchange Skills, Learn Together",
    description:
      "Connect with others to exchange skills and learn together. Teach what you know, learn what you need.",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Skill Barter - Exchange Skills, Learn Together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skill Barter - Exchange Skills, Learn Together",
    description:
      "Connect with others to exchange skills and learn together. Teach what you know, learn what you need.",
    images: ["/og-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${elmsSans.className} antialiased`}>
        {children}
        <Toaster closeButton />
      </body>
    </html>
  );
}
