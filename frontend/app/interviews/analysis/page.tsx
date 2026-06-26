import Link from "next/link";
import {
  Card,
  FooterLinks,
  Icon,
  ProgressBar,
} from "@/components/interview-ai";
import { AuthenticatedShell } from "@/components/authenticated-shell";

function StageCard({
  title,
  status,
  active,
}: {
  title: string;
  status: string;
  active?: boolean;
}) {
  return (
    <Card
      className={
        active
          ? "border border-[#6366f1] bg-white p-6 shadow-[0_16px_40px_rgba(79,70,229,0.14)]"
          : "bg-white/60 p-6 shadow-none ring-[#e1e5f2]"
      }
    >
      <div className="flex items-center gap-4">
        <div className={active ? "grid h-14 w-14 place-items-center rounded-2xl bg-[#4f46e5]" : "grid h-14 w-14 place-items-center rounded-2xl bg-[#ede9fe]"}>
          <Icon name={active ? "trend-up" : "dots"} className={active ? "h-7 w-7 text-white" : "h-7 w-7 text-[#6b7280]"} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[1.35rem] font-medium tracking-tight text-[#0d0f1a]">{title}</p>
          <p className={active ? "mt-2 text-[1.05rem] text-[#4f46e5]" : "mt-2 text-[1.05rem] text-[#9ca3af]"}>{status}</p>
        </div>
        {!active ? <Icon name="chevron-right" className="h-6 w-6 text-[#d1d5db]" /> : null}
      </div>
    </Card>
  );
}

export default function AnalysisPage() {
  return (
    <AuthenticatedShell active="interviews">
      <div className="border-b border-slate-200/70 bg-white/80 px-6 py-4 backdrop-blur md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-[#6366f1]">Processing</p>
          <h1 className="mt-2 text-[2rem] font-bold tracking-tight text-[#0d0f1a] md:text-[2.6rem]">
            Analyzing your response...
          </h1>
          <p className="mt-3 max-w-2xl text-[1rem] leading-7 text-[#6b7280]">
            Our AI is preparing your detailed feedback across technical and behavioral benchmarks.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8">
        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
          <Card className="relative overflow-hidden p-8 md:p-10">
            <div className="absolute left-1/2 top-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_65%)]" />
            <div className="relative flex h-full min-h-[480px] flex-col items-center justify-center text-center">
              <div className="grid h-28 w-28 place-items-center rounded-full border-4 border-[#4f46e5] text-[#4f46e5]">
                <Icon name="settings" className="h-14 w-14" />
              </div>
              <div className="mt-10 w-full max-w-[32rem]">
                <ProgressBar value={72} color="#4f46e5" />
                <p className="mt-5 text-[1.1rem] text-[#4f46e5]">Running advanced heuristics...</p>
              </div>
            </div>
          </Card>

          <div className="space-y-5">
            <StageCard title="Transcribing Audio" status="Complete" />
            <StageCard title="Evaluating Technical Knowledge" status="In progress..." active />
            <StageCard title="Generating Feedback" status="Pending" />
            <Card className="bg-white p-6 shadow-none ring-slate-200/60">
              <div className="flex items-start gap-4">
                <Icon name="sparkles" className="mt-1 h-6 w-6 text-[#4f46e5]" />
                <p className="text-[1.05rem] leading-8 text-[#374151]">
                  <strong>Did you know?</strong> Our AI analyzes over 50 data points including sentiment, keyword
                  relevance, and pace of speech.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-10 text-[1rem] text-[#6b7280]">
          <div className="inline-flex items-center gap-3">
            <Icon name="lock" className="h-5 w-5 text-[#9ca3af]" />
            End-to-end encrypted processing
          </div>
          <div className="inline-flex items-center gap-3">
            <Icon name="check" className="h-5 w-5 text-[#9ca3af]" />
            Privacy Compliant (GDPR/SOC2)
          </div>
        </div>
      </div>

      <FooterLinks
        left={<span>© 2026 InterviewAI · Professional AI Recruitment</span>}
        right={
          <>
            <Link href="#privacy" className="transition hover:text-[#4f46e5]">Privacy Policy</Link>
            <Link href="#terms" className="transition hover:text-[#4f46e5]">Terms of Service</Link>
            <Link href="#support" className="transition hover:text-[#4f46e5]">Contact Support</Link>
          </>
        }
      />
    </AuthenticatedShell>
  );
}
