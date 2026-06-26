"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  ButtonLink,
  Card,
  CircularScore,
  FooterLinks,
  Icon,
  ProgressBar,
} from "@/components/interview-ai";
import { useAuth } from "@/components/auth-provider";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { api, getApiErrorMessage } from "@/lib/api";

type ResponseDocument = {
  _id: string;
  answerText: string;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  clarityScore: number;
  overallScore: number;
  feedback: string;
  improvedAnswer: string;
};

type InterviewDocument = {
  _id: string;
  role: string;
  experience: string;
  difficulty: string;
  status: string;
  overallScore: number | null;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  roleReadiness: string | null;
};

function InsightCard({ summary }: { summary: string }) {
  return (
    <Card className="relative overflow-hidden bg-[linear-gradient(180deg,#4f46e5,#3730a3)] p-7 text-white shadow-[0_20px_40px_rgba(79,70,229,0.25)]">
      <div className="absolute right-6 top-6 h-28 w-28 rounded-full border border-white/10 bg-white/5" />
      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-3 text-[1.25rem] font-semibold">
          <Icon name="lightbulb" className="h-7 w-7 text-white" />
          AI Key Summary
        </div>
        <p className="max-w-md text-[1.02rem] leading-8 text-white/90">
          {summary}
        </p>
      </div>
    </Card>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { user } = useAuth();
  const firstName = user?.firstName || "Alex";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interview, setInterview] = useState<InterviewDocument | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [shareText, setShareText] = useState("Share Report");

  useEffect(() => {
    if (!interviewId) {
      setLoading(false);
      setError("Missing interview ID.");
      return;
    }

    const fetchResults = async () => {
      try {
        const { data } = await api.get(`/interviews/${interviewId}`);
        setInterview(data.interview);
        setQuestions(data.questions || []);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to load interview results"));
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [interviewId]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareText("Link Copied!");
      setTimeout(() => setShareText("Share Report"), 3000);
    }
  };

  if (loading) {
    return (
      <AuthenticatedShell active="interviews">
        <div className="mx-auto max-w-[1000px] px-6 py-8 md:px-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="h-7 w-56 skeleton" />
              <div className="h-4 w-40 skeleton" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32 rounded-xl skeleton" />
              <div className="h-10 w-32 rounded-xl skeleton" />
            </div>
          </div>

          {/* Main Grid Skeleton */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Card: Score */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center justify-center space-y-6">
              <div className="h-32 w-32 rounded-full skeleton" />
              <div className="h-5 w-40 skeleton" />
              <div className="w-full space-y-3 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-28 skeleton" />
                      <div className="h-4 w-8 skeleton" />
                    </div>
                    <div className="h-2 w-full rounded-full skeleton" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Key Summary & Strengths */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="h-6 w-36 skeleton mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full skeleton" />
                  <div className="h-4 w-full skeleton" />
                  <div className="h-4 w-[75%] skeleton" />
                </div>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div className="h-5 w-40 skeleton" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 rounded-xl skeleton" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedShell>
    );
  }

  if (error || !interview) {
    return (
      <AuthenticatedShell active="interviews">
        <div className="mx-auto max-w-2xl px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading results</h2>
          <p className="mt-2 text-slate-600">{error || "Interview not found"}</p>
          <div className="mt-6">
            <ButtonLink href="/interviews" variant="primary">Start New Interview</ButtonLink>
          </div>
        </div>
      </AuthenticatedShell>
    );
  }

  const responses = questions.map((q) => q.response).filter(Boolean) as ResponseDocument[];
  const avgTechnical = responses.length
    ? Math.round((responses.reduce((sum, r) => sum + r.technicalScore, 0) / responses.length) * 10)
    : 80;
  const avgConfidence = responses.length
    ? Math.round((responses.reduce((sum, r) => sum + (r.confidenceScore || r.clarityScore || 8), 0) / responses.length) * 10)
    : 80;
  const avgCommunication = responses.length
    ? Math.round((responses.reduce((sum, r) => sum + r.communicationScore, 0) / responses.length) * 10)
    : 80;

  const skillRows = [
    { label: "Technical Accuracy", value: avgTechnical, color: "#4f46e5" },
    { label: "Confidence & Tone", value: avgConfidence, color: "#0f8b56" },
    { label: "Communication", value: avgCommunication, color: "#b20f1b" },
  ];

  return (
    <AuthenticatedShell
      active="interviews"
      bottomSlot={
        <div className="print:hidden">
          <Card className="bg-[#4f46e5] p-5 text-white shadow-[0_16px_40px_rgba(79,70,229,0.28)]">
            <p className="text-[1.05rem] font-semibold">Ready for more?</p>
            <div className="mt-4">
              <ButtonLink href="/interviews" variant="dark" className="w-full justify-center py-3 text-[0.98rem]">
                Start New Interview
              </ButtonLink>
            </div>
          </Card>
        </div>
      }
    >
      {/* Print styles */}
      <style>{`
        @media print {
          header, nav, footer, aside, .sticky, button, .print\\:hidden {
            display: none !important;
          }
          main, .max-w-\\[1200px\\] {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .card, div[class*="Card"] {
            background: none !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            color: black !important;
          }
        }
      `}</style>

      <div className="border-b border-slate-200/70 dark:border-slate-800/80 bg-[rgba(247,248,253,0.92)] dark:bg-[rgba(13,16,28,0.92)] px-6 py-4 backdrop-blur md:px-8 print:border-0 print:bg-transparent">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-[0.98rem] text-[#60667d] dark:text-[var(--muted)] print:hidden">
              <Link href="/history" className="transition hover:text-[#4f46e5] dark:hover:text-[var(--brand)]">
                History
              </Link>
              <span>/</span>
              <span className="font-medium text-[#4f46e5] dark:text-[var(--brand)]">Interview Result</span>
            </div>
            <h1 className="mt-3 text-[2.2rem] font-semibold tracking-tight text-[var(--foreground)] md:text-[3rem]">
              {interview.role}
            </h1>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-[1rem] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              <Icon name="download" className="h-5 w-5" />
              Print Results
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-[14px] bg-[#4f46e5] hover:bg-indigo-700 px-5 py-3 text-[1rem] font-semibold text-white transition"
            >
              <Icon name="share" className="h-5 w-5" />
              {shareText}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8">
        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
          <Card className="p-8 text-center flex flex-col justify-between">
            <div>
              <div className="flex justify-center">
                <CircularScore value={interview.overallScore || 0} />
              </div>
              <h2 className="mt-10 text-[2rem] font-semibold tracking-tight text-[var(--foreground)]">Great job, {firstName}!</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[1.05rem] leading-8 text-[var(--muted)]">
                Your experience level was evaluated as <span className="font-semibold text-[var(--foreground)]">{interview.experience}</span> with a difficulty level of <span className="font-semibold text-[var(--foreground)]">{interview.difficulty}</span>.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 print:hidden">
              <ButtonLink href={`/interviews/feedback?interviewId=${interviewId}`} className="px-5 py-3 text-[0.98rem]">
                View Detailed Feedback
              </ButtonLink>
              <ButtonLink href="/interviews" variant="secondary" className="px-5 py-3 text-[0.98rem]">
                <Icon name="arrow-left" className="h-4 w-4 rotate-180" />
                Try Another
              </ButtonLink>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[1.55rem] font-semibold text-[var(--foreground)]">Skill Assessment</h2>
                <Icon name="sparkles" className="h-6 w-6 text-[#4f46e5] print:hidden" />
              </div>
              <div className="mt-7 space-y-6">
                {skillRows.map((row) => (
                  <div key={row.label}>
                    <div className="mb-3 flex items-center justify-between text-[1.05rem]">
                      <span className="text-[var(--foreground)]">{row.label}</span>
                      <span className="font-semibold" style={{ color: row.color }}>
                        {row.value}%
                      </span>
                    </div>
                    <ProgressBar value={row.value} color={row.color} />
                  </div>
                ))}
              </div>
            </Card>
            <InsightCard summary={interview.summary || "No summary feedback details generated."} />
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Card className="p-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e2fbef] text-[#0f8b56] print:border">
              <Icon name="check" className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-[1.25rem] font-semibold text-[var(--foreground)]">Strong Points</h3>
            <ul className="mt-3 space-y-2 text-[0.98rem] leading-7 text-[var(--muted)]">
              {interview.strengths?.map((item, idx) => (
                <li key={idx} className="list-none">• {item}</li>
              )) || <li>No recorded items</li>}
            </ul>
          </Card>
          <Card className="p-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f9d9d9] text-[#b20f1b] print:border">
              <Icon name="x" className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-[1.25rem] font-semibold text-[var(--foreground)]">Growth Areas</h3>
            <ul className="mt-3 space-y-2 text-[0.98rem] leading-7 text-[var(--muted)]">
              {interview.weaknesses?.map((item, idx) => (
                <li key={idx} className="list-none">• {item}</li>
              )) || <li>No recorded items</li>}
            </ul>
          </Card>
          <Card className="p-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3e0ff] text-[#4f46e5] print:border">
              <Icon name="lightbulb" className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-[1.25rem] font-semibold text-[var(--foreground)]">Recommendations</h3>
            <ul className="mt-3 space-y-2 text-[0.98rem] leading-7 text-[var(--muted)]">
              {interview.recommendations?.map((item, idx) => (
                <li key={idx} className="list-none">• {item}</li>
              )) || <li>No recorded items</li>}
            </ul>
          </Card>
        </div>

        <div className="mt-10 text-center print:hidden">
          <ButtonLink href="/dashboard" variant="ghost" className="gap-3 text-[1.05rem] text-[var(--muted)] hover:text-[var(--foreground)]">
            <Icon name="arrow-left" className="h-5 w-5" />
            Back to Dashboard
          </ButtonLink>
        </div>
      </div>

      <div className="print:hidden">
        <FooterLinks
          left={<span>InterviewAI | © 2026. Professional AI Recruitment.</span>}
          right={
            <>
              <Link href="#privacy" className="transition hover:text-[#4f46e5]">
                Privacy Policy
              </Link>
              <Link href="#terms" className="transition hover:text-[#4f46e5]">
                Terms of Service
              </Link>
              <Link href="#support" className="transition hover:text-[#4f46e5]">
                Contact Support
              </Link>
            </>
          }
        />
      </div>
    </AuthenticatedShell>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(36,40,54,0.35),_transparent_30%),linear-gradient(180deg,#121316_0%,#181b1f_100%)] px-6 py-10 text-white flex items-center justify-center">
        <div className="text-center text-white/70 font-semibold tracking-wider">LOADING RESULTS...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
