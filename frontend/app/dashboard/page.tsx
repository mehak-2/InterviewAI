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
    <Card className="p-6 md:p-8 bg-[#090d16]/90 border border-slate-800/80 shadow-[0_4px_24px_rgba(99,102,241,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[1.15rem] font-extrabold text-white">Score Trend</h2>
          <p className="mt-1 text-[0.78rem] text-slate-500">
            Last {timeframe === "weekly" ? "5" : "10"} completed sessions
          </p>
        </div>
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setTimeframe("weekly")}
            className={cn(
              "rounded-md px-2.5 py-1 text-[0.72rem] font-bold transition-all",
              timeframe === "weekly" ? "bg-indigo-500/20 text-indigo-300" : "text-slate-500 hover:text-slate-300",
            )}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={cn(
              "rounded-md px-2.5 py-1 text-[0.72rem] font-bold transition-all",
              timeframe === "monthly" ? "bg-indigo-500/20 text-indigo-300" : "text-slate-500 hover:text-slate-300",
            )}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="mt-8 flex h-[220px] items-end justify-between gap-3 px-2">
        {trend.map((val, idx) => {
          const heightPct = Math.max(8, Math.round((val / max) * 100));
          return (
            <div key={idx} className="group relative flex flex-1 flex-col items-center gap-2">
              <div className="absolute -top-7 scale-75 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded bg-slate-950 px-2 py-0.5 text-[0.7rem] font-extrabold text-indigo-300 border border-indigo-500/20">
                  {val}%
                </span>
              </div>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600/30 to-indigo-500/80 group-hover:to-indigo-400 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all duration-300"
                style={{ height: `${heightPct}%` }}
              />
              <span className="text-[0.62rem] font-bold text-slate-600">S{idx + 1}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-900 pt-5 text-[0.8rem]">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          <span className="text-slate-400">Average:</span>
          <span className="font-extrabold text-white">{avg}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-400">Best:</span>
          <span className="font-extrabold text-white">{best}%</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-slate-500">Direction:</span>
          <span
            className={cn(
              "font-extrabold",
              trendDirection === "up" ? "text-emerald-400" : trendDirection === "down" ? "text-rose-400" : "text-slate-400"
            )}
          >
            {trendPctText}
          </span>
        </div>
      </div>
    </Card>
  );
}

function AIRecommendationCard({ history }: { history: InterviewHistoryItem[] }) {
  // Get last recommendation from completed sessions
  const lastCompleted = history.find((s) => s.status === "completed" && s.recommendations?.length);
  const rec = lastCompleted?.recommendations?.[0];

  return (
    <Card className="p-6 bg-[#090d16]/90 border border-slate-800/80 shadow-[0_4px_24px_rgba(99,102,241,0.04)]">
      <div className="flex items-center gap-2">
        <Icon name="sparkles" className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
        <h2 className="text-[0.98rem] font-extrabold text-white">AI Recommendation</h2>
      </div>
      {rec ? (
        <div className="mt-4 space-y-3">
          <p className="text-[0.82rem] leading-6 text-slate-300 italic bg-slate-950/60 p-3 rounded-xl border border-slate-900">
            &ldquo;{rec}&rdquo;
          </p>
          <p className="text-[0.72rem] text-indigo-400/80 font-bold">
            Based on your last interview as {lastCompleted.role}.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-[0.82rem] leading-6 text-slate-500">
            No recommendations yet. Complete an interview session with scoring to receive personalized AI recommendations.
          </p>
        </div>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [historyRes, statsRes] = await Promise.all([
          api.get<{ history: InterviewHistoryItem[] }>("/analytics/history?limit=15"),
          api.get<{ stats: DashboardStats }>("/analytics/dashboard"),
        ]);
        setHistory(historyRes.data.history || []);
        setStats(statsRes.data.stats);
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load dashboard data"));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalInterviews = stats?.totalInterviews || 0;
  const avgScore = stats?.averageInterviewScore ? Math.round(stats.averageInterviewScore) : 0;
  const bestScore = history.length
    ? Math.max(...history.map((s) => s.overallScore || 0))
    : 0;

  const recentActivity = history.slice(0, 3);

  const firstName = user?.firstName || "Alex";
  const initials = `${firstName[0]}${user?.lastName?.[0] || ""}`.toUpperCase();

  const greeting = (() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  })();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <AuthenticatedShell active="dashboard">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-slate-900 bg-[#04060e]/80 px-6 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.25rem] font-extrabold tracking-tight text-white">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-[0.78rem] text-slate-500">{today}</p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="hidden items-center gap-2 rounded-lg border border-slate-900 bg-slate-950 px-3 py-1.5 text-[0.8rem] text-slate-500 md:flex md:min-w-[180px]">
              <Icon name="search" className="h-3.5 w-3.5 shrink-0" />
              <span>Search...</span>
            </div>
            {/* Bell */}
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-900 bg-slate-950 text-slate-500 transition hover:bg-slate-900 hover:text-white">
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
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[0.88rem] text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {/* Stats Cards Skeletons */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-900 bg-[#090d16]/80 p-6 shadow-sm">
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
              <div className="rounded-2xl border border-slate-900 bg-[#090d16]/80 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-900 pb-5">
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

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-900 bg-[#090d16]/80 p-6 shadow-sm">
                  <div className="h-4 w-20 rounded-full skeleton" />
                  <div className="mt-3 h-14 w-full skeleton" />
                  <div className="mt-2 h-8 w-full skeleton" />
                  <div className="mt-5 h-10 w-full rounded-xl skeleton" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3 animate-fade-up">
              <StatCard label="Total Interviews" value={String(totalInterviews)} icon="chart" note="All-time" />
              <StatCard label="Average Score" value={avgScore > 0 ? `${avgScore}%` : "N/A"} icon="trend-up" note="Completed" />
              <StatCard label="Best Score" value={bestScore > 0 ? `${bestScore}%` : "N/A"} icon="medal" />
            </div>

            {/* Main grid */}
            <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_0.6fr] animate-fade-up delay-100">
              <ScoreTrendCard history={history} />

              <div className="space-y-4">
                {/* CTA card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6366f1] via-[#4338ca] to-[#312e81] p-6 text-white shadow-[0_16px_40px_rgba(99,102,241,0.22)] border border-indigo-500/20">
                  <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/[0.07]" />
                  <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/[0.05]" />
                  <div className="relative">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.15] px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      AI Coach Active
                    </div>
                    <h2 className="mt-3 text-[1.25rem] font-extrabold leading-tight">
                      Ready for the<br />next interview?
                    </h2>
                    <p className="mt-2 text-[0.8rem] leading-5 text-white/70">
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
            <Card className="mt-6 overflow-hidden border border-slate-900 bg-[#090d16]/90 shadow-[0_4px_24px_rgba(99,102,241,0.04)] animate-fade-up delay-200">
              <div className="flex items-center justify-between border-b border-slate-900 px-6 py-5">
                <div>
                  <h2 className="text-[1rem] font-extrabold text-white">Recent Activity</h2>
                  <p className="text-[0.78rem] text-slate-500">Your last 3 sessions</p>
                </div>
                <Link href="/history" className="text-[0.82rem] font-bold text-indigo-400 hover:opacity-75">
                  View all &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-950">
                      <th className="px-5 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">Role</th>
                      <th className="px-5 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">Date</th>
                      <th className="px-5 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">Score</th>
                      <th className="px-5 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">Status</th>
                      <th className="px-5 py-3 text-left text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
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
                        <tr key={row._id} className="transition-colors hover:bg-slate-950">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                                <Icon name="briefcase" className="h-4 w-4 text-indigo-400" />
                              </div>
                              <span className="text-[0.88rem] font-extrabold text-white">{row.role}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[0.82rem] text-slate-400">{formattedDate}</td>
                          <td className="px-5 py-4">
                            {row.overallScore !== null ? (
                              <div className="flex items-center gap-2.5">
                                <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-950">
                                  <div
                                    className="h-full rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                    style={{ width: `${row.overallScore}%` }}
                                  />
                                </div>
                                <span className="text-[0.82rem] font-bold text-indigo-300">{row.overallScore}%</span>
                              </div>
                            ) : (
                              <span className="text-[0.82rem] text-slate-500 font-medium">N/A</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <Badge tone={tone}>
                              {statusLabel}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            <ButtonLink
                              href={
                                row.status === "in_progress"
                                  ? `/interviews/recording?interviewId=${row._id}`
                                  : `/interviews/results?interviewId=${row._id}`
                              }
                              variant="outline"
                              className="px-3.5 py-1.5 text-[0.78rem] border border-slate-800 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500/25"
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
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-[0.88rem]">
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
        className="border-slate-900 bg-[#02040a]"
        left={<span className="text-[0.75rem] text-slate-500">&copy; 2026 InterviewAI &middot; Career Intelligence Platform</span>}
        right={
          <>
            <Link href="#privacy" className="transition-colors text-slate-500 hover:text-indigo-400">Privacy</Link>
            <Link href="#terms" className="transition-colors text-slate-500 hover:text-indigo-400">Terms</Link>
            <Link href="#support" className="transition-colors text-slate-500 hover:text-indigo-400">Support</Link>
          </>
        }
      />
    </AuthenticatedShell>
  );
}
