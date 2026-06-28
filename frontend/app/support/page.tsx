"use client";

import { useState } from "react";
import { Card, Icon } from "@/components/interview-ai";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { useToast } from "@/components/toast";
import { cn } from "@/lib/cn";

type FAQItem = {
  question: string;
  answer: string;
  category: "general" | "audio" | "resumes";
};

const faqs: FAQItem[] = [
  {
    category: "general",
    question: "How does the AI Interview Coach work?",
    answer: "InterviewAI uses Google's advanced Gemini models to generate personalized interview questions based on your target role, experience, and uploaded resume. During the mock interview, it evaluates your audio responses on communication, clarity, and technical correctness to provide comprehensive, actionable feedback.",
  },
  {
    category: "audio",
    question: "Why is the system not detecting my microphone?",
    answer: "Please ensure you have granted microphone permissions to this website in your browser settings. If you are using external headphones, double-check that the correct input device is selected in your system settings before starting the interview.",
  },
  {
    category: "resumes",
    question: "What resume formats are supported?",
    answer: "Currently, InterviewAI supports PDF (.pdf) format resumes. For best results, ensure your PDF contains searchable text rather than scanned images, as our AI parser reads the text structure to customize your interview experience.",
  },
  {
    category: "general",
    question: "Is my personal data and resume secure?",
    answer: "Absolutely. We value your privacy. All uploaded resumes and recorded audio files are parsed securely and stored in an isolated environment. Your data is never used to train public AI models.",
  },
  {
    category: "audio",
    question: "Can I review my past mock interview answers?",
    answer: "Yes, you can access all completed interviews, detailed scores, and feedback for every single question from the History tab in your dashboard sidebar.",
  },
];

const quickCards = [
  {
    icon: "microphone",
    title: "Audio Troubleshooting",
    desc: "Fix common issues with microphone permissions, audio lag, or speech-to-text detection.",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-400",
    borderHover: "hover:border-indigo-500/40",
    glow: "hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)]",
  },
  {
    icon: "file",
    title: "Resume Guidelines",
    desc: "Learn how to optimize your PDF formatting to help the AI tailor your questions.",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    borderHover: "hover:border-violet-500/40",
    glow: "hover:shadow-[0_8px_32px_rgba(139,92,246,0.12)]",
  },
  {
    icon: "trend-up",
    title: "Scoring Methodology",
    desc: "Understand how our AI evaluates communication, technical accuracy, and readiness.",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/40",
    glow: "hover:shadow-[0_8px_32px_rgba(16,185,129,0.12)]",
  },
];

const categories = ["all", "general", "audio", "resumes"] as const;

export default function SupportPage() {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "audio" | "resumes">("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ticketCategory, setTicketCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const filteredFaqs = faqs.filter(
    (faq) => activeCategory === "all" || faq.category === activeCategory
  );

  const handleToggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast("Please fill out both the subject and message fields.", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      showToast("Support ticket submitted! We'll reply within 24 hours.", "success");
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <AuthenticatedShell active="support">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-indigo-500/10 bg-[#04060e]/90 px-6 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.25rem] font-extrabold tracking-tight text-white">Help &amp; Support</h1>
            <p className="text-[0.78rem] text-slate-500">Find answers and get assistance</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-[0.82rem] font-semibold text-emerald-400 sm:flex">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Support online
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8 space-y-8">

        {/* Quick Help Cards */}
        <div className="grid gap-5 sm:grid-cols-3 animate-fade-up">
          {quickCards.map((card) => (
            <div
              key={card.title}
              className={cn(
                "group flex flex-col items-center text-center rounded-2xl border border-slate-800/70 bg-[#090d16] p-6 transition-all duration-300 cursor-default",
                card.borderHover,
                card.glow,
              )}
            >
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110", card.iconBg)}>
                <Icon name={card.icon} className={cn("h-6 w-6", card.iconColor)} />
              </div>
              <h3 className="text-[0.95rem] font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-[0.8rem] leading-6 text-slate-500">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* FAQ Accordion */}
          <div className="space-y-5 animate-fade-up delay-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[1.05rem] font-extrabold text-white">Frequently Asked Questions</h2>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-[0.78rem] font-semibold self-start sm:self-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setExpandedFaq(null);
                    }}
                    className={cn(
                      "rounded-lg px-3 py-1.5 capitalize transition-all duration-150",
                      activeCategory === cat
                        ? "bg-indigo-500/20 text-indigo-300 shadow-sm"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-2.5">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "overflow-hidden rounded-xl border transition-all duration-200",
                      isOpen
                        ? "border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.08)]"
                        : "border-slate-800/70 bg-[#090d16] hover:border-slate-700 hover:bg-[#0d1120]",
                    )}
                  >
                    <button
                      onClick={() => handleToggleFaq(idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className={cn("text-[0.88rem] font-semibold leading-5 transition-colors", isOpen ? "text-indigo-300" : "text-slate-200")}>
                        {faq.question}
                      </span>
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                          isOpen
                            ? "rotate-180 border-indigo-500/40 bg-indigo-500/15 text-indigo-400"
                            : "border-slate-700 bg-slate-800/50 text-slate-500",
                        )}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={cn(
                        "transition-all duration-300 ease-in-out overflow-hidden",
                        isOpen ? "max-h-[300px]" : "max-h-0",
                      )}
                    >
                      <div className="border-t border-indigo-500/10 px-5 py-4">
                        <p className="text-[0.85rem] leading-7 text-slate-400">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-500 mb-4">
                    <Icon name="search" className="h-6 w-6" />
                  </div>
                  <p className="text-[0.88rem] text-slate-500">No questions in this category yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Support Ticket Form */}
          <div className="animate-fade-up delay-200">
            <Card className="p-6 h-fit border-slate-800/70 bg-[#090d16]">
              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-indigo-500/15">
                  <Icon name="mail" className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-[0.98rem] font-bold text-white">Submit a Ticket</h2>
                  <p className="text-[0.72rem] text-slate-500">We reply within 24 hours</p>
                </div>
              </div>

              <p className="text-[0.78rem] leading-5 text-slate-500 mb-5">
                Can&apos;t find what you need? Describe your problem and our team will get back to you directly.
              </p>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-[0.78rem] font-bold text-slate-400 mb-1.5">Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-[0.85rem] text-slate-200 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 appearance-none"
                  >
                    <option value="general">General Question</option>
                    <option value="audio">Audio / Microphone Issue</option>
                    <option value="resumes">Resume Upload Problem</option>
                    <option value="billing">Billing / Membership</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[0.78rem] font-bold text-slate-400 mb-1.5">Subject</label>
                  <input
                    type="text"
                    placeholder="Summarize your issue..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-[0.85rem] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="block text-[0.78rem] font-bold text-slate-400 mb-1.5">Details</label>
                  <textarea
                    rows={4}
                    placeholder="Explain details of the issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-[0.85rem] text-slate-200 placeholder:text-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 leading-6"
                  />
                </div>

                <button
                  id="submit-ticket-btn"
                  type="submit"
                  disabled={submitting}
                  className="btn-shimmer w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4338ca] px-4 py-3 text-[0.88rem] font-bold text-white shadow-[0_4px_16px_rgba(99,102,241,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(99,102,241,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Icon name="mail" className="h-4 w-4" />
                      Send Ticket
                    </>
                  )}
                </button>
              </form>
            </Card>

            {/* Extra contact info card */}
            <div className="mt-4 rounded-2xl border border-slate-800/70 bg-[#090d16] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-amber-500/15">
                  <Icon name="lightbulb" className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-[0.82rem] font-bold text-slate-300">Quick tip</p>
                  <p className="mt-1 text-[0.78rem] leading-5 text-slate-500">
                    Check our FAQ section first — most common questions are answered there instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedShell>
  );
}
