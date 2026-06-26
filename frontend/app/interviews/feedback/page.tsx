"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  Avatar,
  Badge,
  ButtonLink,
  Card,
  CircularScore,
  FooterLinks,
  Icon,
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
  audioUrl?: string | null;
};

type QuestionDocument = {
  _id: string;
  questionNumber: number;
  text: string;
  type: string;
  category: string;
  response: ResponseDocument | null;
};

type InterviewDocument = {
  _id: string;
  role: string;
  experience: string;
  difficulty: string;
  overallScore: number | null;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  improvementPlan?: string[];
  suggestedTopics?: string[];
  learningResources?: Array<{ title: string; url: string }>;
  roleReadiness: string | null;
};

function StrengthCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border border-[#0f7a45] bg-white p-5 shadow-none">
      <div className="flex items-start gap-4">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#e1fbeb] text-[#0f7a45]">
          <Icon name="check" className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-[1.15rem] font-semibold text-[#171a27]">{title}</h3>
          <p className="mt-2 text-[0.98rem] leading-7 text-[#5e647c]">{body}</p>
        </div>
      </div>
    </Card>
  );
}

function ImprovementCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border border-[#d72828] bg-white p-5 shadow-none">
      <div className="flex items-start gap-4">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#d72828]">
          <Icon name="x" className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-[1.02rem] font-semibold text-[#171a27]">{title}</h3>
          <p className="mt-2 text-[0.98rem] leading-7 text-[#5e647c]">{body}</p>
        </div>
      </div>
    </Card>
  );
}

function FeedbackContent() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { user } = useAuth();
  const displayName = `${user?.firstName || "Alex"} ${user?.lastName || "Rivera"}`.trim();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interview, setInterview] = useState<InterviewDocument | null>(null);
  const [questions, setQuestions] = useState<QuestionDocument[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [shareText, setShareText] = useState("Share Results");

  useEffect(() => {
    if (!interviewId) {
      setLoading(false);
      setError("Missing interview ID.");
      return;
    }

    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/interviews/${interviewId}`);
        setInterview(data.interview);
        setQuestions(data.questions || []);
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to load detailed feedback"));
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [interviewId]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareText("Link Copied!");
      setTimeout(() => setShareText("Share Results"), 3000);
    }
  };

  if (loading) {
    return (
      <AuthenticatedShell active="interviews">
        <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="h-7 w-64 skeleton" />
              <div className="h-4 w-48 skeleton" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-32 rounded-xl skeleton" />
              <div className="h-10 w-32 rounded-xl skeleton" />
            </div>
          </div>

          {/* Main Grid Skeleton */}
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Left Sidebar Skeleton (Question tabs) */}
            <div className="space-y-3">
              <div className="h-5 w-32 skeleton mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 rounded-xl skeleton w-full" />
              ))}
            </div>

            {/* Right Panel Skeleton */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-start justify-between border-b border-slate-50 pb-5">
                <div className="space-y-2.5 w-[70%]">
                  <div className="h-4.5 w-24 skeleton" />
                  <div className="h-5 w-full skeleton" />
                  <div className="h-5 w-[85%] skeleton" />
                </div>
                <div className="h-20 w-20 rounded-full skeleton" />
              </div>
              <div className="space-y-3">
                <div className="h-4.5 w-32 skeleton" />
                <div className="h-12 w-full skeleton" />
              </div>
              <div className="space-y-3">
                <div className="h-4.5 w-32 skeleton" />
                <div className="h-16 w-full skeleton" />
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
          <h2 className="text-2xl font-bold text-red-600">Error loading feedback</h2>
          <p className="mt-2 text-slate-600">{error || "Feedback not found"}</p>
          <div className="mt-6">
            <ButtonLink href="/interviews" variant="primary">Start New Interview</ButtonLink>
          </div>
        </div>
      </AuthenticatedShell>
    );
  }

  const activeQuestion = questions[selectedQuestionIndex] || null;
  const activeResponse = activeQuestion?.response || null;

  const score = interview.overallScore || 0;
  const readinessLabel = interview.roleReadiness
    ? interview.roleReadiness.toUpperCase().replaceAll("_", " ")
    : score >= 85
    ? "READY"
    : score >= 70
    ? "ALMOST READY"
    : "NEEDS PRACTICE";

  const readinessColor = score >= 85 ? "#0f7a45" : score >= 70 ? "#b58b09" : "#d72828";

  return (
    <AuthenticatedShell
      active="interviews"
      bottomSlot={
        <div className="print:hidden">
          <Card className="flex items-center gap-4 bg-[#f8f9fc] p-4 ring-1 ring-slate-200/60">
            <Avatar name={displayName} tone="violet" size={52} className="text-sm" />
            <div>
              <p className="text-[1.05rem] font-semibold text-[#0d0f1a]">{displayName}</p>
              <p className="text-[0.84rem] uppercase tracking-[0.16em] text-[#9ca3af]">Candidate</p>
            </div>
          </Card>
        </div>
      }
    >
      {/* Dynamic Report Print CSS */}
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
          .page-break-avoid {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="border-b border-slate-200/70 bg-[rgba(247,248,253,0.92)] px-6 py-4 backdrop-blur md:px-8 print:border-0 print:bg-transparent">
        <div className="mx-auto flex max-w-[1200px] items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[0.98rem] text-[#60667d] print:hidden">
              <Link href={`/interviews/results?interviewId=${interviewId}`} className="transition hover:text-[#4f46e5]">
                Results
              </Link>
              <span>/</span>
              <span className="font-medium text-[#4f46e5]">Feedback Details</span>
            </div>
            <h1 className="mt-3 text-balance text-[2.2rem] font-semibold tracking-tight text-[#111317] md:text-[3rem]">
              {interview.role}
            </h1>
            <p className="mt-3 text-[1.05rem] text-[#545a70]">
              Evaluation Level: {interview.experience} · Difficulty: {interview.difficulty}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-[1rem] font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Icon name="download" className="h-5 w-5" />
              Download PDF
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
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.5fr]">
          <Card className="p-7 text-center flex flex-col justify-center items-center">
            <div className="flex justify-center">
              <CircularScore value={score} size={190} label="%" accent={readinessColor} />
            </div>
            <h2 className="mt-8 text-[2rem] font-semibold text-[#111317]" style={{ color: readinessColor }}>
              {readinessLabel}
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-[1.02rem] leading-8 text-[#5e647c]">
              {interview.summary}
            </p>
          </Card>

          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center gap-3 text-[1.55rem] font-semibold text-[#111317]">
                <Icon name="check" className="h-7 w-7 text-[#0f7a45]" />
                Strengths
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {interview.strengths?.map((str, index) => (
                  <StrengthCard
                    key={index}
                    title={`Strength #${index + 1}`}
                    body={str}
                  />
                )) || <StrengthCard title="Evaluated Strengths" body="Your structured communication was effective." />}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3 text-[1.55rem] font-semibold text-[#111317]">
                <Icon name="x" className="h-6 w-6 text-[#d72828]" />
                Areas for Improvement
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {interview.weaknesses?.map((weak, index) => (
                  <ImprovementCard
                    key={index}
                    title={`Growth Area #${index + 1}`}
                    body={weak}
                  />
                )) || <ImprovementCard title="Growth Focus" body="Ensure you provide enough technical depth." />}
              </div>
            </div>
          </div>
        </div>

        {interview.recommendations?.length > 0 && (
          <div className="mt-8 page-break-avoid">
            <Card className="relative overflow-hidden bg-[linear-gradient(180deg,#6366f1,#4f46e5)] p-7 text-white shadow-[0_20px_42px_rgba(79,70,229,0.26)] print:bg-none print:border print:border-slate-200">
              <div className="absolute right-6 top-6 text-white/30 print:hidden">
                <Icon name="sparkles" className="h-10 w-10" />
              </div>
              <div className="flex items-center gap-3 text-[1.55rem] font-semibold print:text-slate-800">
                <Icon name="lightbulb" className="h-7 w-7 text-white print:text-slate-800" />
                Actionable AI Recommendations
              </div>
              <ul className="mt-6 space-y-3 text-[1.1rem] leading-8 text-white/90 print:text-slate-700 list-disc pl-5">
                {interview.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* Improvement Plan, Suggested Topics & Learning Resources */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 page-break-avoid">
          {/* Improvement Plan & Suggested Topics */}
          <div className="space-y-6">
            {interview.improvementPlan && interview.improvementPlan.length > 0 && (
              <Card className="border border-indigo-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-[1.25rem] font-bold text-slate-800 mb-4">
                  <Icon name="chart" className="h-6 w-6 text-indigo-600" />
                  Actionable Improvement Plan
                </div>
                <ul className="space-y-3 text-[0.95rem] leading-7 text-slate-600 list-decimal pl-5">
                  {interview.improvementPlan.map((step, idx) => (
                    <li key={idx} className="pl-1">{step}</li>
                  ))}
                </ul>
              </Card>
            )}

            {interview.suggestedTopics && interview.suggestedTopics.length > 0 && (
              <Card className="border border-violet-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-[1.25rem] font-bold text-slate-800 mb-4">
                  <Icon name="medal" className="h-6 w-6 text-violet-600" />
                  Suggested Topics to Master
                </div>
                <div className="flex flex-wrap gap-2">
                  {interview.suggestedTopics.map((topic, idx) => (
                    <span key={idx} className="rounded-full bg-violet-50 text-violet-700 px-3 py-1.5 text-[0.82rem] font-semibold border border-violet-100">
                      {topic}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Learning Resources */}
          {interview.learningResources && interview.learningResources.length > 0 && (
            <Card className="border border-emerald-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-[1.25rem] font-bold text-slate-800 mb-4">
                  <Icon name="lightbulb" className="h-6 w-6 text-emerald-600" />
                  Recommended Learning Resources
                </div>
                <p className="text-[0.88rem] text-slate-500 mb-5 leading-6">
                  Check out these tailored tutorials, docs, and courses curated by our AI to address your growth areas.
                </p>
                <div className="space-y-3">
                  {interview.learningResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 p-3.5 text-[0.9rem] font-medium text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-200 hover:text-emerald-700 transition"
                    >
                      <span className="truncate pr-3">{res.title}</span>
                      <Icon name="arrow-right" className="h-4 w-4 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Screen-Only Tab Breakdown */}
        <div className="mt-12 print:hidden">
          <h2 className="mb-6 text-[1.8rem] font-semibold text-[#111317]">Question-by-Question Breakdown</h2>
          
          {/* Question Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => setSelectedQuestionIndex(index)}
                className={`px-5 py-3 rounded-full text-[0.95rem] font-semibold transition ${
                  selectedQuestionIndex === index
                    ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Q{q.questionNumber} ({q.category})
              </button>
            ))}
          </div>

          {activeQuestion && (
            <Card className="overflow-hidden bg-[#eef0f4] p-0 border border-slate-200">
              <div className="border-b border-[#d7dced] bg-white px-6 py-6 md:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Badge tone="violet" className="bg-[#4f46e5] text-white ring-[#4f46e5] text-[0.88rem] px-3.5 py-1">
                    Question {activeQuestion.questionNumber}: {activeQuestion.category}
                  </Badge>
                  {activeResponse && (
                    <div className="rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-[0.88rem] font-semibold text-slate-700">
                      Score: {activeResponse.overallScore}/10 (Tech: {activeResponse.technicalScore}/10 · Comm: {activeResponse.communicationScore}/10)
                    </div>
                  )}
                </div>
                <p className="mt-5 text-[1.15rem] font-semibold text-slate-800 leading-8">
                  &quot;{activeQuestion.text}&quot;
                </p>
              </div>

              <div className="px-6 py-6 md:px-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-[0.85rem] uppercase tracking-[0.2em] font-bold text-slate-500">
                      {activeResponse?.audioUrl ? "Your Spoken Answer (Transcript)" : "Your Answer"}
                    </h4>
                    {activeResponse?.audioUrl && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[0.72rem] font-semibold text-[#4f46e5]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4f46e5] animate-pulse" />
                        Voice Recorded
                      </span>
                    )}
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 text-[1rem] leading-8 text-slate-800 space-y-4">
                    <p>{activeResponse?.answerText || <span className="italic text-slate-400">No response submitted.</span>}</p>
                    {activeResponse?.audioUrl && (
                      <div className="pt-4 border-t border-slate-100">
                        <audio src={activeResponse.audioUrl} controls className="w-full h-11 focus:outline-none" />
                      </div>
                    )}
                  </div>
                </div>

                {activeResponse && (
                  <>
                    <div>
                      <h4 className="text-[0.85rem] uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">AI Feedback</h4>
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 text-[1rem] leading-8 text-indigo-900">
                        {activeResponse.feedback}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[0.85rem] uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">AI-Generated Perfect Response</h4>
                      <div className="bg-teal-50/50 border border-teal-100 rounded-2xl p-5 text-[1rem] leading-8 text-teal-900 whitespace-pre-line font-medium">
                        {activeResponse.improvedAnswer}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Print-Only Sequential Question Breakdown */}
        <div className="hidden print:block mt-12 space-y-8">
          <h2 className="text-[1.8rem] font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-6">
            Detailed Q&A Breakdown
          </h2>
          {questions.map((q) => {
            const resp = q.response;
            return (
              <div key={q._id} className="border border-slate-200 rounded-2xl p-6 bg-white space-y-4 page-break-avoid">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-bold text-slate-800">
                    Q{q.questionNumber}: {q.text}
                  </span>
                  {resp && (
                    <span className="text-slate-700 font-semibold text-sm">
                      Score: {resp.overallScore}/10 (Tech: {resp.technicalScore} · Comm: {resp.communicationScore})
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Answer Transcript</h4>
                  <p className="text-slate-700 text-sm leading-7 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {resp?.answerText || "No response submitted."}
                  </p>
                </div>
                {resp && (
                  <>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">AI Evaluation</h4>
                      <p className="text-slate-700 text-sm leading-7 bg-indigo-50/20 p-4 rounded-lg border border-indigo-100">
                        {resp.feedback}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Perfect Answer Guide</h4>
                      <p className="text-slate-700 text-sm leading-7 bg-teal-50/20 p-4 rounded-lg border border-teal-100 whitespace-pre-line font-medium">
                        {resp.improvedAnswer}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center print:hidden">
          <ButtonLink href="/dashboard" variant="ghost" className="gap-3 text-[1.05rem] text-[#24273a]">
            <Icon name="arrow-left" className="h-5 w-5" />
            Back to Dashboard
          </ButtonLink>
        </div>
      </div>

      <div className="print:hidden">
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
      </div>
    </AuthenticatedShell>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(36,40,54,0.35),_transparent_30%),linear-gradient(180deg,#121316_0%,#181b1f_100%)] px-6 py-10 text-white flex items-center justify-center">
        <div className="text-center text-white/70 font-semibold tracking-wider">LOADING FEEDBACK...</div>
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  );
}
