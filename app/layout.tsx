import type { Metadata } from "next";
import { Elms_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const elmsSans = Elms_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const baseUrl = "https://skill-barter-connect.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
    "skill trading",
    "learn from peers",
    "teach online",
    "skill exchange platform",
  ],
  authors: [{ name: "Skill Barter" }],
  creator: "Skill Barter",
  publisher: "Skill Barter",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Skill Barter Connect",
    title: "Skill Barter - Exchange Skills, Learn Together",
    description:
      "Connect with others to exchange skills and learn together. Teach what you know, learn what you need.",
    images: [
      {
        url: `${baseUrl}/og-image`,
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
    images: [`${baseUrl}/og-image`],
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
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Skill Barter Connect",
  url: baseUrl,
  logo: `${baseUrl}/og-image`,
  description:
    "Connect with others to exchange skills and learn together. Teach what you know, learn what you need.",
  sameAs: [
    "https://twitter.com/skillbarter",
    "https://github.com/skillbarter",
    "https://linkedin.com/company/skillbarter",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "support@skillbarter.com",
  },
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Skill Barter Connect",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: baseUrl,
  description:
    "Connect with others to exchange skills and learn together. Teach what you know, learn what you need.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA meta tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Skill Barter" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#fafafa" />

        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
      </head>
      <body className={`${elmsSans.className} antialiased`}>
        {children}
        <Toaster closeButton />
      </body>
    </html>
  );
}
