import type { Metadata } from "next";
import { LandingNavbar } from "@/components/navbar";
import HeroSection from "@/app/_components/hero-section";
import DemoSection from "@/app/_components/demo-section";
import HowItWorks from "@/app/_components/how-it-works";
import Features from "@/app/_components/features";
import Testimonials from "@/app/_components/testimonials";
import FAQ from "@/app/_components/faq";
import CTASection from "@/app/_components/cta-section";
import Footer from "@/app/_components/footer";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Join Skill Barter to exchange skills with others. Teach what you know, learn what you need. Connect with a community of learners and teachers.",
  openGraph: {
    title: "Skill Barter - Exchange Skills, Learn Together",
    description:
      "Join Skill Barter to exchange skills with others. Teach what you know, learn what you need. Connect with a community of learners and teachers.",
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
      "Join Skill Barter to exchange skills with others. Teach what you know, learn what you need.",
    images: ["/og-image"],
  },
};

function Page() {
  return (
    <>
      <LandingNavbar />
      <HeroSection />
      <DemoSection />
      <HowItWorks />
      <Features />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </>
  );
}

export default Page;
