import type { Metadata } from "next";
import { Elms_Sans } from "next/font/google";
import "./globals.css";

const elmsSans = Elms_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Barter",
  description: "Skill Barter",
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
      </body>
    </html>
  );
}
