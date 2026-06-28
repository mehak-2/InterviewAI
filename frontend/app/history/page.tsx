"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ButtonLink,
  Card,
  FooterLinks,
  Icon,
  StatCard,
} from "@/components/interview-ai";
import { cn } from "@/lib/cn";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { api, getApiErrorMessage } from "@/lib/api";
import { useToast } from "@/components/toast";

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
};

function ScoreBar({ value }: { value: number }) {
  const color = value >= 90 ? "#10b981" : value >= 75 ? "#818cf8" : "#f59e0b";
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full transition-all shadow-[0_0_6px_rgba(99,102,241,0.4)]" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[0.88rem] font-bold" style={{ color }}>{value}%</span>
    </div>
  );
}

export default function HistoryPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<InterviewHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/analytics/history");
      setHistory(data.history || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load interview history"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this interview session? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/interviews/${id}`);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      showToast("Interview session deleted successfully", "success");
    } catch (err) {
      showToast(getApiErrorMessage(err, "Could not delete the interview session"), "error");
    }
  };

  // Filter logic
  const filteredHistory = history.filter((item) =>
    item.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedRows = filteredHistory.slice(startIndex, endIndex);

  // Stats calculation
  const completedSessions = history.filter((item) => item.status === "completed" && item.overallScore !== null);
  const averageScore = completedSessions.length
    ? Math.round(completedSessions.reduce((sum, item) => sum + (item.overallScore || 0), 0) / completedSessions.length)
    : 0;

  // Find most frequent role (top skill)
  const roleCounts: Record<string, number> = {};
  history.forEach((item) => {
    roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
  });
  let topSkill = "N/A";
  let maxCount = 0;
  Object.entries(roleCounts).forEach(([role, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topSkill = role;
    }
  });
  if (topSkill.length > 25) {
    topSkill = topSkill.slice(0, 22) + "...";
  }

  // Generate pagination buttons
  const pageNumbers = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, "…", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
    }
  }

  return (
    <AuthenticatedShell active="history">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-indigo-500/10 bg-[#04060e]/90 px-6 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.25rem] font-extrabold tracking-tight text-white">Interview History</h1>
            <p className="text-[0.78rem] text-slate-500">Track your progress and review past sessions</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-[0.82rem] font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white">
              <Icon name="download" className="h-4 w-4" />
              Export
            </button>
            <ButtonLink href="/interviews" className="gap-2 rounded-xl px-4 py-2 text-[0.82rem]">
              <Icon name="plus" className="h-4 w-4" />
              New Interview
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[0.9rem] text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {/* Stats Cards Skeletons */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-[#090d16]/80 p-6">
                  <div className="h-4 w-24 rounded bg-slate-800 animate-pulse" />
                  <div className="mt-3 h-8 w-20 rounded bg-slate-800 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Filter Bar Skeleton */}
            <div className="rounded-2xl border border-slate-800 bg-[#090d16]/80 p-4">
              <div className="h-10 w-full rounded-xl bg-slate-800 animate-pulse" />
            </div>

            {/* Table Skeleton */}
            <div className="rounded-2xl border border-slate-800 bg-[#090d16]/80 overflow-hidden">
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-900 last:border-0">
                    <div className="space-y-2">
                      <div className="h-4 w-24 rounded bg-slate-800 animate-pulse" />
                      <div className="h-3 w-16 rounded bg-slate-800 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-800 animate-pulse" />
                      <div className="h-4 w-32 rounded bg-slate-800 animate-pulse" />
                    </div>
                    <div className="h-4 w-16 rounded bg-slate-800 animate-pulse" />
                    <div className="h-6 w-20 rounded-full bg-slate-800 animate-pulse" />
                    <div className="h-9 w-28 rounded-xl bg-slate-800 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3 animate-fade-in-up">
              <StatCard label="Average Score" value={averageScore > 0 ? `${averageScore}%` : "N/A"} icon="trend-up" accent="var(--brand-soft)" />
              <StatCard label="Total Interviews" value={String(history.length)} icon="calendar" accent="var(--success-soft)" />
              <StatCard label="Top Target" value={topSkill} icon="medal" accent="var(--warning-soft)" />
            </div>

            {/* Search / filter bar */}
            <Card className="mt-6 p-4 animate-fade-in-up delay-75">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="flex flex-1 items-center gap-2.5 rounded-[12px] bg-[var(--surface-soft)] px-4 py-2.5 ring-1 ring-[var(--line)] transition-all focus-within:bg-[var(--surface)] focus-within:ring-2 focus-within:ring-[var(--brand)]/40 min-w-[200px]">
                  <Icon name="search" className="h-4 w-4 shrink-0 text-[var(--muted-soft)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by role..."
                    className="w-full bg-transparent text-[0.88rem] text-[var(--foreground)] placeholder:text-[var(--muted-soft)] outline-none"
                  />
                </div>

                {/* Role filter */}
                <button className="flex items-center gap-2 rounded-[12px] bg-[var(--surface-soft)] px-4 py-2.5 text-[0.88rem] font-medium text-[var(--foreground)] ring-1 ring-[var(--line)] transition hover:bg-[var(--surface)]">
                  All Roles
                  <Icon name="chevron-down" className="h-4 w-4 text-[var(--muted-soft)]" />
                </button>

                {/* Date filter */}
                <button className="flex items-center gap-2 rounded-[12px] bg-[var(--surface-soft)] px-4 py-2.5 text-[0.88rem] font-medium text-[var(--foreground)] ring-1 ring-[var(--line)] transition hover:bg-[var(--surface)]">
                  <Icon name="calendar" className="h-4 w-4 text-[var(--muted-soft)]" />
                  Any date
                </button>

                {/* More filters */}
                <button className="flex items-center gap-2 rounded-[12px] px-4 py-2.5 text-[0.85rem] font-semibold text-[var(--brand)] transition hover:bg-[var(--brand-soft)]">
                  <Icon name="filter" className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </Card>

            {/* Table or Empty State */}
            {history.length === 0 ? (
              <Card className="mt-5 p-12 text-center flex flex-col items-center justify-center border-slate-800/70 bg-[#090d16]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400 mb-4">
                  <Icon name="plus" className="h-8 w-8" />
                </div>
                <h3 className="text-[1.15rem] font-bold text-white">No mock interviews yet</h3>
                <p className="mt-2 text-[0.88rem] text-slate-500 max-w-sm leading-relaxed">
                  Start practicing to see detailed feedback, metrics, transcripts, and insights customized to your profile.
                </p>
                <ButtonLink href="/interviews" className="mt-6 px-6 py-2.5 rounded-xl">
                  Start Your First Interview
                  <Icon name="arrow-right" className="h-4 w-4" />
                </ButtonLink>
              </Card>
            ) : filteredHistory.length === 0 ? (
              <Card className="mt-5 p-12 text-center flex flex-col items-center justify-center border-slate-800/70 bg-[#090d16]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-4">
                  <Icon name="search" className="h-6 w-6" />
                </div>
                <h3 className="text-[1.05rem] font-bold text-white">No results found</h3>
                <p className="mt-2 text-[0.88rem] text-slate-500">
                  We couldn&apos;t find any interview sessions matching &ldquo;{searchQuery}&rdquo;.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-[0.85rem] font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Clear search query
                </button>
              </Card>
            ) : (
              <Card className="mt-5 overflow-hidden animate-fade-in-up delay-150">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-[var(--line)] bg-[var(--surface-soft)]">
                        <th className="px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">Date</th>
                        <th className="px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">Role</th>
                        <th className="px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">Score</th>
                        <th className="px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">Questions</th>
                        <th className="px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">Status</th>
                        <th className="px-6 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted-soft)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {paginatedRows.map((row) => {
                        const dateObj = new Date(row.createdAt);
                        const formattedDate = dateObj.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });
                        const formattedTime = dateObj.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        const statusLabel =
                          row.status === "in_progress"
                            ? "In Progress"
                            : (row.overallScore || 0) >= 85
                              ? "Excellent"
                              : "Qualified";

                        const isExcellent = row.status === "completed" && (row.overallScore || 0) >= 85;

                        return (
                          <tr key={row._id} className="group transition-colors hover:bg-[var(--surface-soft)]">
                            <td className="px-6 py-4">
                              <p className="text-[0.88rem] font-semibold text-[var(--foreground)]">{formattedDate}</p>
                              <p className="text-[0.78rem] text-[var(--muted-soft)]">{formattedTime}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--brand-soft)]">
                                  <Icon name="briefcase" className="h-4 w-4 text-[var(--brand)]" />
                                </div>
                                <span className="text-[0.9rem] font-semibold text-[var(--foreground)]">{row.role}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {row.overallScore !== null ? (
                                <ScoreBar value={row.overallScore} />
                              ) : (
                                <span className="text-[0.88rem] text-[var(--muted-soft)]">N/A</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5 text-[0.88rem] text-[var(--muted)]">
                                <Icon name="history" className="h-3.5 w-3.5" />
                                {row.responseCount} / {row.questionCount} Qs
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.72rem] font-semibold",
                                row.status === "in_progress"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                  : isExcellent
                                    ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                                    : "bg-[var(--success-soft)] text-[var(--success)]",
                              )}>
                                <span className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  row.status === "in_progress"
                                    ? "bg-amber-500"
                                    : isExcellent
                                      ? "bg-[var(--brand)]"
                                      : "bg-[var(--success)]",
                                )} />
                                {statusLabel}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <ButtonLink
                                  href={
                                    row.status === "in_progress"
                                      ? `/interviews/recording?interviewId=${row._id}`
                                      : `/interviews/results?interviewId=${row._id}`
                                  }
                                  variant="outline"
                                  className="px-3 py-1.5 text-[0.8rem]"
                                >
                                  {row.status === "in_progress" ? "Resume" : "View"}
                                  <Icon name="arrow-right" className="h-3.5 w-3.5" />
                                </ButtonLink>
                                <button
                                  onClick={() => handleDelete(row._id)}
                                  className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-colors"
                                >
                                  <Icon name="x" className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-3 border-t border-[var(--line)] px-6 py-4 md:flex-row md:items-center md:justify-between">
                    <span className="text-[0.82rem] text-[var(--muted-soft)]">
                      Showing {startIndex + 1}–{endIndex} of {totalItems} sessions
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--line)] text-[var(--foreground)] hover:bg-[var(--surface-soft)] transition-colors disabled:opacity-40"
                      >
                        <Icon name="chevron-left" className="h-4 w-4" />
                      </button>
                      {pageNumbers.map((p, i) => (
                        <button
                          key={i}
                          onClick={() => typeof p === "number" && setCurrentPage(p)}
                          disabled={p === "…"}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-[8px] text-[0.82rem] font-medium transition-colors",
                            p === currentPage
                              ? "bg-[var(--brand)] text-white shadow-sm"
                              : "text-[var(--muted)] hover:bg-[var(--surface-soft)]",
                          )}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--line)] text-[var(--foreground)] hover:bg-[var(--surface-soft)] transition-colors disabled:opacity-40"
                      >
                        <Icon name="chevron-right" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </>
        )}

        {/* CTA banner */}
        <div className="mt-6 overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#4f46e5,#3730a3)] p-8 text-center text-white shadow-[0_12px_32px_rgba(79,70,229,0.28)]">
          <div className="mx-auto max-w-lg">
            <h2 className="text-[1.5rem] font-bold tracking-tight">Ready to boost your score?</h2>
            <p className="mt-3 text-[0.92rem] leading-7 text-white/75">
              Start a new AI-powered mock interview and get instant performance feedback.
            </p>
            <div className="mt-6">
              <ButtonLink href="/interviews" variant="dark" className="px-6 py-2.5 text-[0.92rem]">
                Start New Interview
                <Icon name="arrow-right" className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <FooterLinks
        left={<span>© 2026 InterviewAI · Professional AI Recruitment</span>}
        right={
          <>
            <Link href="#privacy" className="transition-colors hover:text-[#4f46e5]">Privacy</Link>
            <Link href="#terms" className="transition-colors hover:text-[#4f46e5]">Terms</Link>
            <Link href="#support" className="transition-colors hover:text-[#4f46e5]">Support</Link>
          </>
        }
      />
    </AuthenticatedShell>
  );
}
