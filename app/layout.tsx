import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ThemeInit from "@/components/theme/ThemeInit";

export const metadata: Metadata = {
  title: "CSE445 – Computer Vision",
  description:
    "Course portal for CSE445 Computer Vision at East West University. Lectures, lab manual, assessment guide, and resources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <ThemeInit />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
