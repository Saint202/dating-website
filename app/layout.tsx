import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DatingApp",
  description: "Find your match",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center blur-sm scale-105"
          style={{ backgroundImage: "url('/auth-photo.jpg')" }}
        />
        <div className="fixed inset-0 -z-10 bg-background/75" />

        <Providers>
          <Navbar />
          <main className="flex-1">
             <PageTransition>{children}</PageTransition>
          </main>
        </Providers>
      </body>
    </html>
  );
}