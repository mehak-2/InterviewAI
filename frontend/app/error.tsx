"use client";

import { useEffect } from "react";
import { BrandMark, Card, Icon } from "@/components/interview-ai";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Next.js App Error boundary caught:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f6fb] flex flex-col justify-between">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.08),transparent_70%)]" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.06),transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        <BrandMark />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[500px] animate-fade-in-up">
          <Card className="rounded-[28px] bg-white p-8 text-center shadow-[0_8px_32px_rgba(13,15,26,0.08),0_1px_2px_rgba(13,15,26,0.04)] ring-1 ring-slate-200/60 sm:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-rose-50 text-rose-600 shadow-sm">
              <Icon name="x" className="h-8 w-8" />
            </div>
            <h1 className="text-[1.8rem] font-bold tracking-tight text-[#0d0f1a]">Something went wrong</h1>
            <p className="mt-3 text-[0.95rem] leading-7 text-[#6b7280]">
              An unexpected error occurred. Our team has been notified. Please try again or return to the dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="inline-flex w-full justify-center items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-3 text-[0.92rem] font-semibold shadow-md hover:shadow-lg transition"
              >
                Try Again
                <Icon name="history" className="h-4 w-4 text-white" />
              </button>
              <a
                href="/dashboard"
                className="inline-flex justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-[0.92rem] font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Return to Dashboard
              </a>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 bg-white px-6 py-5 text-center text-[0.82rem] text-[#9ca3af]">
        <span>© 2026 InterviewAI · Professional AI Recruitment</span>
      </footer>
    </div>
  );
}
