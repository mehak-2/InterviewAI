"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Badge,
  ButtonLink,
  Card,
  FooterLinks,
  Icon,
  StatCard,
} from "@/components/interview-ai";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/cn";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { api, getApiErrorMessage } from "@/lib/api";

type InterviewHistoryItem = {
  _id: string;
  role: string;
  experience: string;
  difficulty: string;
  status: "in_progress" | "completed" | "abandoned";
  overallScore: number | null;
  createdAt: string;
  questionCount: number;
  responseCount: number;
  recommendations?: string[];
};

type DashboardStats = {
  totalInterviews: number;
  completedInterviews: number;
  activeInterviews: number;
  totalResponses: number;
  averageInterviewScore: number;
  averageResponseScore: number;
};

function ScoreTrendCard({ history }: { history: InterviewHistoryItem[] }) {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");

  // Get last 5 (weekly) or 10 (monthly) completed sessions in chronological order (oldest to newest)
  const completedSessions = history
    .filter((s) => s.status === "completed" && s.overallScore !== null)
    .slice(0, timeframe === "weekly" ? 5 : 10)
    .reverse();

  const scores = completedSessions.map((s) => s.overallScore || 0);
  const trend = scores.length ? scores : [0];
  const max = Math.max(...trend) > 10 ? 100 : 10;

  // Compute average of these sessions
  const avg = scores.length
    ? Number((scores.reduce((sum, val) => sum + val, 0) / scores.length).toFixed(1))
    : 0;

  // Compute best of these sessions
  const best = scores.length ? Math.max(...scores) : 0;

  // Percentage improvement between first and last of these sessions
  let trendPctText = "Stable";
  let trendDirection: "up" | "down" | "stable" = "stable";
  if (scores.length >= 2) {
    const diff = scores[scores.length - 1] - scores[0];
    if (diff > 0) {
      trendPctText = `+${diff}%`;
      trendDirection = "up";
    } else if (diff < 0) {
      trendPctText = `${diff}%`;
      trendDirection = "down";
    }
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[1.1rem] font-bold text-[var(--foreground)]">Score Trend</h2>
          <p className="mt-1 text-[0.82rem] text-[var(--muted-soft)]">
            Last {timeframe === "weekly" ? "5" : "10"} sessions
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-[var(--surface-soft)] p-1">
          <button
            onClick={() => setTimeframe("weekly")}
            className={cn(
              "rounded-full px-3 py-1 text-[0.78rem] transition-all",
              timeframe === "weekly"
                ? "bg-[var(--surface)] font-semibold text-[var(--foreground)] shadow-sm"
                : "font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={cn(
              "rounded-full px-3 py-1 text-[0.78rem] transition-all",
              timeframe === "monthly"
                ? "bg-[var(--surface)] font-semibold text-[var(--foreground)] shadow-sm"
                : "font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
            )}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="mt-8 flex h-[200px] items-end justify-between gap-4">
        {completedSessions.map((session, index) => {
          const score = session.overallScore || 0;
          const isLast = index === completedSessions.length - 1;
          const heightPct = (score / max) * 100;
          return (
            <div key={session._id} className="group relative flex flex-1 flex-col items-center gap-2">
              {/* Tooltip */}
              <div className={cn(
                "absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg px-2 py-1 text-[0.72rem] font-bold text-white shadow-md transition-opacity duration-200",
                isLast ? "bg-indigo-600 opacity-100" : "bg-[var(--muted)] opacity-0 group-hover:opacity-100",
              )}>
                {score}
              </div>
              <div className="w-full flex-1 flex items-end justify-center">
                <div
                  className={cn(
                    "w-full rounded-t-[10px] transition-all duration-300",
                    isLast
                      ? "bg-gradient-to-t from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/10"
                      : "bg-[var(--brand-soft)] group-hover:opacity-80",
                  )}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[0.75rem] font-medium text-[var(--muted-soft)]">
                S{index + 1}
              </span>
            </div>
          );
        })}
        {completedSessions.length === 0 && (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted-soft)] text-[0.9rem] italic">
            Complete an interview to see trends.
          </div>
        )}
      </div>

      {/* Bottom stats */}
      <div className="mt-5 flex items-center justify-between rounded-[14px] bg-[var(--surface-soft)] px-4 py-3 border border-[var(--line)]">
        <div className="text-center">
          <p className="text-[0.72rem] font-medium text-[var(--muted-soft)]">Average</p>
          <p className="mt-0.5 text-[1rem] font-bold text-[var(--foreground)]">{avg}</p>
        </div>
        <div className="h-8 w-px bg-[var(--line)]" />
        <div className="text-center">
          <p className="text-[0.72rem] font-medium text-[var(--muted-soft)]">Best</p>
          <p className="mt-0.5 text-[1rem] font-bold text-emerald-500">{best}</p>
        </div>
        <div className="h-8 w-px bg-[var(--line)]" />
        <div className="text-center">
          <p className="text-[0.72rem] font-medium text-[var(--muted-soft)]">Trend</p>
          <p className="mt-0.5 flex items-center gap-1 text-[1rem] font-bold text-emerald-500">
            {trendDirection === "up" && <Icon name="trend-up" className="h-4 w-4" />}
            {trendDirection === "down" && <Icon name="trend-up" className="h-4 w-4 rotate-180 text-rose-400" />}
            <span className={cn(trendDirection === "down" && "text-rose-400")}>{trendPctText}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

function AIRecommendationCard({ history }: { history: InterviewHistoryItem[] }) {
  // Find the first completed interview with recommendations
  const lastWithRecs = history.find(
    (s) => s.status === "completed" && s.recommendations && s.recommendations.length > 0
  );

  const recommendationText = lastWithRecs?.recommendations?.[0] ||
    "Start practicing with our AI. Once you complete an interview, we will analyze your performance and show customized recommendations here!";

  return (
    <Card className="border border-[var(--line)] bg-[var(--surface-soft)] p-6 shadow-none">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-emerald-100/80 dark:bg-emerald-900/40">
          <Icon name="sparkles" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">AI Insight</p>
          <p className="mt-2 text-[0.9rem] leading-6 text-[var(--foreground)]">
            {recommendationText}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Alex";
  const displayName = `${user?.firstName || "Alex"} ${user?.lastName || "Rivera"}`.trim();
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/analytics/history"),
        ]);
        setStats(statsRes.data.stats);
        setHistory(historyRes.data.history || []);
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load dashboard statistics"));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute stats helper values
  const totalInterviews = stats?.totalInterviews ?? history.length;
  const avgScore = stats?.averageInterviewScore ?? 0;

  const completedScores = history
    .filter((s) => s.status === "completed" && s.overallScore !== null)
    .map((s) => s.overallScore as number);
  const bestScore = completedScores.length ? Math.max(...completedScores) : 0;

  const recentActivity = history.slice(0, 3);

  return (
    <AuthenticatedShell active="dashboard">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--surface)] px-6 py-4 shadow-[var(--shadow-xs)] md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.3rem] font-bold tracking-tight text-[var(--foreground)]">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-[0.78rem] text-[var(--muted-soft)]">{today}</p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="hidden items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] px-3.5 py-2 text-[0.82rem] text-[var(--muted-soft)] md:flex md:min-w-[200px]">
              <Icon name="search" className="h-3.5 w-3.5 shrink-0" />
              <span>Search sessions…</span>
              <kbd className="ml-auto rounded border border-[var(--line)] px-1.5 py-0.5 text-[0.65rem]">⌘K</kbd>
            </div>
            {/* Bell */}
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--muted-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--muted)]">
              <Icon name="bell" className="h-4 w-4" />
            </button>
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#4338ca] text-[0.65rem] font-bold text-white shadow-[0_3px_8px_rgba(99,102,241,0.32)]">
              {initials}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[0.9rem] text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {/* Stats Cards Skeletons */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-28 skeleton" />
                    <div className="h-8 w-8 rounded-full skeleton" />
                  </div>
                  <div className="mt-4 h-8 w-20 skeleton" />
                  <div className="mt-2 h-3.5 w-32 skeleton" />
                </div>
              ))}
            </div>

            {/* Main grid Skeletons */}
            <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
              {/* Score Trend Card Skeleton */}
              <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-50 pb-5">
                  <div>
                    <div className="h-5 w-36 skeleton" />
                    <div className="mt-2 h-3 w-48 skeleton" />
                  </div>
                  <div className="h-6 w-24 skeleton" />
                </div>
                <div className="mt-6 flex h-[240px] items-end justify-between gap-2 px-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-full rounded-t-lg skeleton" style={{ height: `${30 + i * 12}%` }} />
                  ))}
                </div>
              </div>

              {/* Right CTA & AI Recommendation Skeleton */}
              <div className="space-y-4">
                <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="h-4 w-20 rounded-full skeleton" />
                  <div className="mt-3 h-14 w-full skeleton" />
                  <div className="mt-2 h-8 w-full skeleton" />
                  <div className="mt-5 h-10 w-full rounded-xl skeleton" />
                </div>
                <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="h-4 w-32 skeleton" />
                  <div className="mt-3 h-12 w-full skeleton" />
                </div>
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100/80 px-6 py-5">
                <div className="h-5 w-32 skeleton" />
                <div className="mt-2 h-3.5 w-24 skeleton" />
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl skeleton" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-32 skeleton" />
                        <div className="h-3.5 w-20 skeleton" />
                      </div>
                    </div>
                    <div className="h-4 w-16 skeleton" />
                    <div className="h-6 w-20 rounded-full skeleton" />
                    <div className="h-9 w-20 rounded-xl skeleton" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3 animate-fade-in-up">
              <StatCard label="Total Interviews" value={String(totalInterviews)} icon="chart" note="All-time" accent="var(--brand-soft)" />
              <StatCard label="Average Score" value={avgScore > 0 ? `${avgScore}/100` : "N/A"} icon="trend-up" note="Completed sessions" accent="var(--success-soft)" />
              <StatCard label="Best Score" value={bestScore > 0 ? String(bestScore) : "N/A"} icon="medal" accent="var(--warning-soft)" />
            </div>

            {/* Main grid */}
            <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_0.6fr] animate-fade-in-up delay-150">
              <ScoreTrendCard history={history} />

              <div className="space-y-4">
                {/* CTA card */}
                <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#4338ca] p-6 text-white shadow-[0_16px_40px_rgba(99,102,241,0.22)]">
                  <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/[0.07]" />
                  <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/[0.05]" />
                  <div className="pointer-events-none absolute top-1/2 right-1/4 -translate-y-1/2 h-24 w-24 rounded-full bg-white/[0.04]" />
                  <div className="relative">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.15] px-2.5 py-1 text-[0.7rem] font-bold backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      AI Ready
                    </div>
                    <h2 className="mt-3 text-[1.25rem] font-bold leading-tight">
                      Ready for the<br />next interview?
                    </h2>
                    <p className="mt-2 text-[0.82rem] leading-5 text-white/70">
                      Practice with AI tailored to your role and level.
                    </p>
                    <ButtonLink href="/interviews" variant="dark" className="mt-5 w-full justify-center py-2.5 text-[0.85rem] border border-white/20">
                      Start New Interview
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </ButtonLink>
                  </div>
                </div>

                <AIRecommendationCard history={history} />
              </div>
            </div>

            {/* Recent activity table */}
            <Card className="mt-6 overflow-hidden animate-fade-in-up delay-300">
              <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-5">
                <div>
                  <h2 className="text-[1rem] font-bold text-[var(--foreground)]">Recent Activity</h2>
                  <p className="text-[0.78rem] text-[var(--muted-soft)]">Your last 3 sessions</p>
                </div>
                <Link href="/history" className="text-[0.82rem] font-bold text-[var(--brand)] transition-opacity hover:opacity-75">
                  View all →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--surface-soft)]">
                      <th className="px-5 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">Role</th>
                      <th className="px-5 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">Date</th>
                      <th className="px-5 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">Score</th>
                      <th className="px-5 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">Status</th>
                      <th className="px-5 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted-soft)]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {recentActivity.map((row) => {
                      const formattedDate = new Date(row.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      });

                      const statusLabel =
                        row.status === "in_progress"
                          ? "In Progress"
                          : (row.overallScore || 0) >= 85
                            ? "Excellent"
                            : "Qualified";

                      const tone =
                        row.status === "in_progress"
                          ? "amber"
                          : (row.overallScore || 0) >= 85
                            ? "violet"
                            : "mint";

                      return (
                        <tr key={row._id} className="transition-colors hover:bg-[var(--surface-soft)]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--brand-soft)]">
                                <Icon name="briefcase" className="h-4 w-4 text-[var(--brand)]" />
                              </div>
                              <span className="text-[0.9rem] font-bold text-[var(--foreground)]">{row.role}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[0.88rem] text-[var(--muted)]">{formattedDate}</td>
                          <td className="px-6 py-4">
                            {row.overallScore !== null ? (
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[var(--line)]">
                                  <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{ width: `${row.overallScore}%` }}
                                  />
                                </div>
                                <span className="text-[0.88rem] font-bold text-emerald-500">{row.overallScore}%</span>
                              </div>
                            ) : (
                              <span className="text-[0.88rem] text-[var(--muted-soft)] font-medium">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge tone={tone}>
                              {statusLabel}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <ButtonLink
                              href={
                                row.status === "in_progress"
                                  ? `/interviews/recording?interviewId=${row._id}`
                                  : `/interviews/results?interviewId=${row._id}`
                              }
                              variant="outline"
                              className="px-4 py-1.5 text-[0.82rem]"
                            >
                              {row.status === "in_progress" ? "Resume" : "View"}
                              <Icon name="arrow-right" className="h-3.5 w-3.5" />
                            </ButtonLink>
                          </td>
                        </tr>
                      );
                    })}
                    {recentActivity.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[var(--muted-soft)] text-[0.92rem]">
                          No interview activities found. Start practicing to see your sessions!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>

      <FooterLinks
        left={<span>© 2026 InterviewAI · Professional AI Recruitment</span>}
        right={
          <>
            <Link href="#privacy" className="transition-colors hover:text-indigo-600">Privacy</Link>
            <Link href="#terms" className="transition-colors hover:text-indigo-600">Terms</Link>
            <Link href="#support" className="transition-colors hover:text-indigo-600">Support</Link>
          </>
        }
      />
    </AuthenticatedShell>
  );
}
