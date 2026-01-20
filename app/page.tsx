import { LandingNavbar } from "@/components/navbar";
import HeroSection from "@/app/_components/hero-section";
import DemoSection from "@/app/_components/demo-section";
import HowItWorks from "@/app/_components/how-it-works";
import Features from "@/app/_components/features";
import Testimonials from "@/app/_components/testimonials";
import FAQ from "@/app/_components/faq";
import CTASection from "@/app/_components/cta-section";
import Footer from "@/app/_components/footer";

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
