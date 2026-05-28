import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PYQ Platform — JEE & NEET Prep",
  description: "Solve previous year questions for JEE and NEET like LeetCode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className={`${sora.variable} ${inter.variable} antialiased`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
          <Toaster />
        </body>
      </html>
  );
}