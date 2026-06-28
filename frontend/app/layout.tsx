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
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='10' fill='url(%23g)'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%234f46e5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M30 14a2 2 0 0 1-2 2H10l-4 4V8a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2z' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M14 17v3' stroke='white' stroke-width='2.2' stroke-linecap='round'/%3E%3Cpath d='M20 15v7' stroke='white' stroke-width='2.2' stroke-linecap='round'/%3E%3Cpath d='M26 18v2' stroke='white' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
