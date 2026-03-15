import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Job Tracker | Premium Career Assistant",
    template: "%s | Job Tracker",
  },
  description: "Accelerate your career with Job Tracker. Automate your job applications, track interviews, and generate premium LaTeX resumes with our glassmorphic dashboard.",
  keywords: ["job tracker", "career management", "resume builder", "interview tracker", "job application", "professional dashboard"],
  authors: [{ name: "Job Tracker Team" }],
  creator: "Job Tracker Team",
  publisher: "Job Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
