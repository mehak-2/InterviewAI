import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export const metadata: Metadata = {
  title: {
    default: "InterviewAI – AI-Powered Interview Preparation",
    template: "%s · InterviewAI",
  },
  description:
    "The most realistic AI-powered interview prep platform. Practice with personalized mock interviews, get instant feedback, and land your dream job.",
  keywords: ["interview prep", "AI interview", "mock interview", "career coaching"],
  authors: [{ name: "InterviewAI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "InterviewAI – AI-Powered Interview Preparation",
    description: "Practice with AI-powered mock interviews and instant performance feedback.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`h-full antialiased ${plusJakartaSans.variable} ${outfit.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
