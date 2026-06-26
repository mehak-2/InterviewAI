"use client";

import React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useAuth } from "@/components/auth-provider";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { api, getApiErrorMessage } from "@/lib/api";
import { Card, FooterLinks, Icon } from "@/components/interview-ai";
import { cn } from "@/lib/cn";

const roleChoices = [
  { label: "Junior", icon: "user", desc: "0–2 years", color: "var(--success-soft)", text: "var(--success)" },
  { label: "Mid-Level", icon: "briefcase", desc: "2–5 years", color: "var(--brand-soft)", text: "var(--brand)" },
  { label: "Senior", icon: "medal", desc: "5+ years", color: "var(--warning-soft)", text: "var(--warning)" },
] as const;

const difficultyLevels = ["Relaxed", "Standard", "Intense"] as const;

const tips = [
  { icon: "sparkles", text: "Speak naturally — don't memorize scripts." },
  { icon: "check", text: "Use the STAR method for behavioral questions." },
  { icon: "trend-up", text: "Senior interviews focus on system design & leadership." },
];

export default function InterviewSetupPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState<(typeof roleChoices)[number]["label"]>("Mid-Level");
  const [difficultyIndex, setDifficultyIndex] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const difficulty = difficultyLevels[difficultyIndex];
  const displayName = `${user?.firstName || "Alex"} ${user?.lastName || "Morgan"}`.trim();

  const difficultyWidth = useMemo(
    () => `${(difficultyIndex / (difficultyLevels.length - 1)) * 100}%`,
    [difficultyIndex],
  );
  const difficultyThumb = useMemo(
    () => `calc(${(difficultyIndex / (difficultyLevels.length - 1)) * 100}% - 14px)`,
    [difficultyIndex],
  );

  const difficultyColors = ["#10b981", "#6366f1", "#ef4444"];
  const difficultyColor = difficultyColors[difficultyIndex];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post("/interviews", {
        role: role.trim(),
        experience,
        difficulty,
        interviewType: "technical",
        totalQuestions: 5,
      });
      const interviewId = String(data?.interview?._id ?? data?.interview?.id ?? "");
      if (!interviewId) throw new Error("Interview created, but the session id was missing.");
      router.push(`/interviews/recording?interviewId=${interviewId}`);
      router.refresh();
    } catch (submitError) {
      setError(getApiErrorMessage(submitError, "Unable to create interview session"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthenticatedShell active="interviews">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 px-6 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.4rem] font-bold tracking-tight text-[#0d0f1a]">Setup Interview</h1>
            <p className="text-[0.82rem] text-[#9ca3af]">Configure your AI mock session</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[0.85rem] font-medium text-[#374151] shadow-sm sm:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#059669]" />
              12 sessions available
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#374151] shadow-sm transition hover:bg-slate-50">
              <Icon name="bell" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <form className="mx-auto max-w-[1200px] px-6 py-8 md:px-8" onSubmit={handleSubmit}>
        {/* Hero heading */}
        <div className="mb-8">
          <h2 className="text-[2rem] font-bold tracking-tight text-[#0d0f1a] md:text-[2.6rem]">
            Ready to practice, {displayName.split(" ")[0]}?
          </h2>
          <p className="mt-3 max-w-2xl text-[1rem] leading-7 text-[#6b7280]">
            Our AI generates industry-standard questions tailored to your role and experience level.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* Config card */}
          <Card className="p-6 md:p-8">
            {error ? (
              <div className="mb-6 flex items-start gap-3 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3" role="alert">
                <div className="mt-0.5 h-4 w-4 shrink-0 text-red-500">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" /></svg>
                </div>
                <p className="text-[0.875rem] text-red-700">{error}</p>
              </div>
            ) : null}

            {/* Target role */}
            <div>
              <label className="block text-[0.85rem] font-semibold text-[#374151]">Target Role</label>
              <p className="mt-0.5 text-[0.78rem] text-[#9ca3af]">The position you're interviewing for</p>
              <div className="mt-3 flex items-center gap-3 rounded-[16px] bg-slate-50 px-4 py-3.5 ring-1 ring-slate-200/80 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.06)]">
                <Icon name="briefcase" className="h-[18px] w-[18px] shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Senior React Engineer, Product Manager…"
                  name="role"
                  autoComplete="off"
                  required
                  disabled={submitting}
                  value={role}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setRole(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-transparent text-[0.95rem] font-semibold text-slate-800 placeholder:font-normal placeholder:text-slate-400 outline-none disabled:opacity-60"
                />
              </div>
            </div>

            {/* Experience level */}
            <div className="mt-8">
              <label className="block text-[0.85rem] font-semibold text-[#374151]">Experience Level</label>
              <p className="mt-0.5 text-[0.78rem] text-[#9ca3af]">Calibrates question depth and complexity</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {roleChoices.map((choice) => {
                  const active = experience === choice.label;
                  return (
                    <button
                      key={choice.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => { setExperience(choice.label); setError(null); }}
                      className={cn(
                        "group relative flex flex-col items-center rounded-[20px] border-2 px-4 py-5 text-center transition-all duration-300",
                        active
                          ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-md shadow-indigo-500/5"
                          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
                      )}
                    >
                      {active && (
                        <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500">
                          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M10.28 2.28 3.989 8.575 1.695 6.28A1 1 0 0 0 .28 7.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28 2.28Z" />
                          </svg>
                        </div>
                      )}
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-[14px]"
                        style={{ backgroundColor: choice.color }}
                      >
                        <Icon name={choice.icon} className="h-6 w-6" style={{ color: choice.text }} />
                      </div>
                      <p className={cn("mt-3 text-[0.92rem] font-bold", active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-slate-100")}>
                        {choice.label}
                      </p>
                      <p className={cn("text-[0.75rem] font-medium", active ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500")}>
                        {choice.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-[0.85rem] font-semibold text-[#374151]">Interview Difficulty</label>
                  <p className="mt-0.5 text-[0.78rem] text-[#9ca3af]">Adjusts question pressure and follow-ups</p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-[0.82rem] font-bold"
                  style={{ color: difficultyColor, backgroundColor: `${difficultyColor}18` }}
                >
                  {difficulty}
                </span>
              </div>

              <div className="relative mt-5 pb-6">
                {/* Track */}
                <div className="h-2 rounded-full bg-[#e5e7eb]">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: difficultyWidth, backgroundColor: difficultyColor }}
                  />
                </div>
                {/* Hidden range */}
                <input
                  type="range"
                  min={0}
                  max={difficultyLevels.length - 1}
                  step={1}
                  value={difficultyIndex}
                  onChange={(e) => { setDifficultyIndex(Number(e.target.value)); setError(null); }}
                  className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent opacity-0"
                />
                {/* Thumb */}
                <div
                  className="absolute top-[-7px] h-[26px] w-[26px] rounded-full border-[3px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300"
                  style={{ left: difficultyThumb, backgroundColor: difficultyColor }}
                />
                {/* Labels */}
                <div className="absolute bottom-0 flex w-full justify-between text-[0.75rem] font-medium text-[#9ca3af]">
                  {difficultyLevels.map((l) => <span key={l}>{l}</span>)}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={submitting || !role.trim()}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(135deg,#6366f1,#4f46e5)] px-6 py-3.5 text-[1rem] font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(79,70,229,0.38)] disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Generating questions…
                  </>
                ) : (
                  <>
                    Generate Interview Questions
                    <Icon name="sparkles" className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[0.8rem] text-[#9ca3af]">
                AI tailoring takes 5–10 seconds · 5 questions per session
              </p>
            </div>
          </Card>

          {/* Sidebar info */}
          <div className="space-y-4">
            {/* How it works */}
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#ede9fe]">
                  <Icon name="sparkles" className="h-5 w-5 text-[#4f46e5]" />
                </div>
                <h3 className="text-[1rem] font-bold text-[#0d0f1a]">How it works</h3>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { step: 1, title: "Configure", desc: "Choose your target role and level" },
                  { step: 2, title: "Practice", desc: "Answer 5 AI-generated questions" },
                  { step: 3, title: "Feedback", desc: "Get instant AI performance report" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ede9fe] text-[0.72rem] font-bold text-[#4f46e5]">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-semibold text-[#0d0f1a]">{item.title}</p>
                      <p className="text-[0.78rem] text-[#9ca3af]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pro tips */}
            <Card className="overflow-hidden p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#fef3c7]">
                  <Icon name="lightbulb" className="h-5 w-5 text-[#b45309]" />
                </div>
                <h3 className="text-[1rem] font-bold text-[#0d0f1a]">Quick Tips</h3>
              </div>
              <div className="mt-4 space-y-3">
                {tips.map((tip) => (
                  <div key={tip.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d1fae5] text-[#059669]">
                      <Icon name={tip.icon} className="h-3 w-3" />
                    </div>
                    <p className="text-[0.82rem] leading-5 text-[#374151]">{tip.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community card */}
            <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-6 text-white">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_60%)]" />
              <div className="relative">
                <div className="mb-4 flex -space-x-2">
                  {["#ede9fe", "#d1fae5", "#fef3c7", "#fce7f3"].map((bg, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0f172a] text-[0.65rem] font-bold"
                      style={{ backgroundColor: bg, color: "#0d0f1a" }}
                    >
                      {["AR", "MK", "SJ", "+"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-[0.9rem] font-semibold">Join 5,000+ professionals</p>
                <p className="mt-1 text-[0.78rem] text-white/60">preparing for their dream roles</p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <FooterLinks
        left={<span>© 2026 InterviewAI · Professional AI Recruitment</span>}
        right={
          <>
            <Link href="#privacy" className="transition-colors hover:text-[#4f46e5]">Privacy</Link>
            <Link href="#terms" className="transition-colors hover:text-[#4f46e5]">Terms</Link>
            <Link href="#contact" className="transition-colors hover:text-[#4f46e5]">Support</Link>
          </>
        }
      />
    </AuthenticatedShell>
  );
}
