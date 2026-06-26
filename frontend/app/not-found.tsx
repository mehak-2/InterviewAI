"use client";

import Link from "next/link";
import { BrandMark, ButtonLink, Card, Icon } from "@/components/interview-ai";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f6fb] flex flex-col justify-between">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)]" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.08),transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        <BrandMark />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[500px] animate-fade-in-up">
          <Card className="rounded-[28px] bg-white p-8 text-center shadow-[0_8px_32px_rgba(13,15,26,0.08),0_1px_2px_rgba(13,15,26,0.04)] ring-1 ring-slate-200/60 sm:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-indigo-50 text-indigo-600 shadow-sm">
              <span className="text-[1.8rem] font-bold">404</span>
            </div>
            <h1 className="text-[1.8rem] font-bold tracking-tight text-[#0d0f1a]">Page Not Found</h1>
            <p className="mt-3 text-[0.95rem] leading-7 text-[#6b7280]">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <ButtonLink href="/dashboard" className="w-full justify-center py-3 text-[0.92rem]">
                Go to Dashboard
                <Icon name="arrow-right" className="h-4 w-4" />
              </ButtonLink>
              <Link
                href="/support"
                className="inline-flex justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-[0.92rem] font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Contact Support
              </Link>
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
