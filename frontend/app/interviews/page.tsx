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
  { label: "Junior",    icon: "user",      desc: "0–2 years",  gradient: "from-emerald-500/20 to-teal-500/10",    iconBg: "bg-emerald-500/15",  iconColor: "text-emerald-400",  activeBorder: "border-emerald-500/60", activeBg: "bg-emerald-500/10" },
  { label: "Mid-Level", icon: "briefcase", desc: "2–5 years",  gradient: "from-indigo-500/20 to-purple-500/10",   iconBg: "bg-indigo-500/15",   iconColor: "text-indigo-400",   activeBorder: "border-indigo-500/70",  activeBg: "bg-indigo-500/10"  },
  { label: "Senior",    icon: "medal",     desc: "5+ years",   gradient: "from-amber-500/20 to-orange-500/10",    iconBg: "bg-amber-500/15",    iconColor: "text-amber-400",    activeBorder: "border-amber-500/60",   activeBg: "bg-amber-500/10"   },
] as const;

const difficultyLevels = ["Relaxed", "Standard", "Intense"] as const;

const tips = [
  { icon: "sparkles",  text: "Speak naturally — don't memorize scripts." },
  { icon: "check",     text: "Use the STAR method for behavioral questions." },
  { icon: "trend-up",  text: "Senior interviews focus on system design & leadership." },
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
      <div className="sticky top-0 z-20 border-b border-indigo-500/10 bg-[#04060e]/90 px-6 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.25rem] font-extrabold tracking-tight text-white">
              Setup Interview
            </h1>
            <p className="text-[0.78rem] text-slate-500">Configure your AI mock session</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-[0.82rem] font-semibold text-emerald-400 sm:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              AI Coach Ready
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-500 transition hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white">
              <Icon name="bell" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <form className="mx-auto max-w-[1200px] px-6 py-8 md:px-8" onSubmit={handleSubmit}>
        {/* Hero heading */}
        <div className="mb-8 animate-fade-up">
          <h2 className="text-[2rem] font-extrabold tracking-tight text-white md:text-[2.4rem]">
            Ready to practice,{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {displayName.split(" ")[0]}?
            </span>
          </h2>
          <p className="mt-3 max-w-xl text-[0.97rem] leading-7 text-slate-400">
            Our AI generates industry-standard questions tailored to your role and experience level.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* Config card */}
          <Card className="p-6 md:p-8 border-slate-800/70 bg-[#090d16] animate-fade-up delay-100">
            {error ? (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3" role="alert">
                <div className="mt-0.5 h-4 w-4 shrink-0 text-red-400">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" /></svg>
                </div>
                <p className="text-[0.875rem] text-red-400">{error}</p>
              </div>
            ) : null}

            {/* Target role */}
            <div>
              <label className="block text-[0.85rem] font-bold text-slate-300">Target Role</label>
              <p className="mt-0.5 text-[0.78rem] text-slate-500">The position you&apos;re interviewing for</p>
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 transition-all duration-200 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.07)]">
                <Icon name="briefcase" className="h-[18px] w-[18px] shrink-0 text-slate-500" />
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
                  className="w-full bg-transparent text-[0.95rem] font-semibold text-white placeholder:font-normal placeholder:text-slate-600 outline-none disabled:opacity-60"
                />
              </div>
            </div>

            {/* Experience level */}
            <div className="mt-8">
              <label className="block text-[0.85rem] font-bold text-slate-300">Experience Level</label>
              <p className="mt-0.5 text-[0.78rem] text-slate-500">Calibrates question depth and complexity</p>
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
                        "group relative flex flex-col items-center rounded-2xl border-2 px-4 py-5 text-center transition-all duration-300",
                        active
                          ? `${choice.activeBorder} ${choice.activeBg} shadow-lg`
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800/50",
                      )}
                    >
                      {active && (
                        <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500">
                          <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                            <path d="M10.28 2.28 3.989 8.575 1.695 6.28A1 1 0 0 0 .28 7.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28 2.28Z" />
                          </svg>
                        </div>
                      )}
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-[14px]", choice.iconBg)}>
                        <Icon name={choice.icon} className={cn("h-6 w-6", choice.iconColor)} />
                      </div>
                      <p className={cn("mt-3 text-[0.92rem] font-bold", active ? "text-white" : "text-slate-300 group-hover:text-white")}>
                        {choice.label}
                      </p>
                      <p className={cn("text-[0.75rem] font-medium", active ? "text-slate-400" : "text-slate-600")}>
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
                  <label className="block text-[0.85rem] font-bold text-slate-300">Interview Difficulty</label>
                  <p className="mt-0.5 text-[0.78rem] text-slate-500">Adjusts question pressure and follow-ups</p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-[0.82rem] font-bold border"
                  style={{ color: difficultyColor, backgroundColor: `${difficultyColor}18`, borderColor: `${difficultyColor}30` }}
                >
                  {difficulty}
                </span>
              </div>

              <div className="relative mt-5 pb-6">
                {/* Track */}
                <div className="h-2 rounded-full bg-slate-800">
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
                  className="absolute top-[-7px] h-[26px] w-[26px] rounded-full border-[3px] border-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300"
                  style={{ left: difficultyThumb, backgroundColor: difficultyColor }}
                />
                {/* Labels */}
                <div className="absolute bottom-0 flex w-full justify-between text-[0.75rem] font-medium text-slate-600">
                  {difficultyLevels.map((l) => <span key={l}>{l}</span>)}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8">
              <button
                id="start-interview-btn"
                type="submit"
                disabled={submitting || !role.trim()}
                className="btn-shimmer inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4338ca] px-6 py-3.5 text-[1rem] font-bold text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(99,102,241,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
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
                    <Icon name="sparkles" className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[0.8rem] text-slate-600">
                AI tailoring takes 5–10 seconds · 5 questions per session
              </p>
            </div>
          </Card>

          {/* Sidebar info */}
          <div className="space-y-4 animate-fade-up delay-200">
            {/* How it works */}
            <Card className="p-6 border-slate-800/70 bg-[#090d16]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-indigo-500/15">
                  <Icon name="sparkles" className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="text-[0.98rem] font-bold text-white">How it works</h3>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { step: 1, title: "Configure", desc: "Choose your target role and level" },
                  { step: 2, title: "Practice",  desc: "Answer 5 AI-generated questions" },
                  { step: 3, title: "Feedback",  desc: "Get instant AI performance report" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[0.72rem] font-bold text-indigo-400 border border-indigo-500/30">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-semibold text-slate-200">{item.title}</p>
                      <p className="text-[0.78rem] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pro tips */}
            <Card className="overflow-hidden p-6 border-slate-800/70 bg-[#090d16]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-amber-500/15">
                  <Icon name="lightbulb" className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="text-[0.98rem] font-bold text-white">Quick Tips</h3>
              </div>
              <div className="mt-4 space-y-3">
                {tips.map((tip) => (
                  <div key={tip.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                      <Icon name={tip.icon} className="h-3 w-3" />
                    </div>
                    <p className="text-[0.82rem] leading-5 text-slate-400">{tip.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Community card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1a1040] p-6 text-white border border-indigo-500/20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
              <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />
              <div className="relative">
                <div className="mb-4 flex -space-x-2">
                  {["#6366f1", "#10b981", "#f59e0b", "#ec4899"].map((bg, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0f172a] text-[0.65rem] font-bold text-white"
                      style={{ backgroundColor: bg }}
                    >
                      {["AR", "MK", "SJ", "+"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-[0.9rem] font-bold text-white">Join 5,000+ professionals</p>
                <p className="mt-1 text-[0.78rem] text-white/60">preparing for their dream roles</p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <FooterLinks
        className="border-slate-900 bg-[#02040a]"
        left={<span className="text-[0.75rem] text-slate-500">© 2026 InterviewAI · Professional AI Recruitment</span>}
        right={
          <>
            <Link href="#privacy" className="transition-colors text-slate-500 hover:text-indigo-400">Privacy</Link>
            <Link href="#terms" className="transition-colors text-slate-500 hover:text-indigo-400">Terms</Link>
            <Link href="#contact" className="transition-colors text-slate-500 hover:text-indigo-400">Support</Link>
          </>
        }
      />
    </AuthenticatedShell>
  );
}
