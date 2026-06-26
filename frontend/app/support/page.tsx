"use client";

import { useState } from "react";
import { Card, Icon } from "@/components/interview-ai";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { useToast } from "@/components/toast";

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

export default function SupportPage() {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "audio" | "resumes">("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Form State
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
      showToast("Support ticket submitted successfully! We'll reply within 24 hours.", "success");
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <AuthenticatedShell active="support">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 px-6 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.4rem] font-bold tracking-tight text-[#0d0f1a]">Help & Support</h1>
            <p className="text-[0.82rem] text-[#9ca3af]">Find answers and get assistance</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8 space-y-8">
        {/* Quick Help Cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-[var(--surface)] border border-indigo-100/40 dark:border-indigo-950/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
              <Icon name="microphone" className="h-6 w-6" />
            </div>
            <h3 className="text-[0.95rem] font-bold text-black dark:text-white">Audio Troubleshooting</h3>
            <p className="mt-2 text-[0.8rem] leading-6 text-slate-700 dark:text-slate-400">
              Fix common issues with microphone permissions, audio lag, or speech-to-text detection.
            </p>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-[var(--surface)] border border-violet-100/40 dark:border-violet-950/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 mb-4">
              <Icon name="file" className="h-6 w-6" />
            </div>
            <h3 className="text-[0.95rem] font-bold text-black dark:text-white">Resume Guidelines</h3>
            <p className="mt-2 text-[0.8rem] leading-6 text-slate-700 dark:text-slate-400">
              Learn how to optimize your PDF formatting to help the AI tailor your questions.
            </p>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-[var(--surface)] border border-emerald-100/40 dark:border-emerald-950/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
              <Icon name="trend-up" className="h-6 w-6" />
            </div>
            <h3 className="text-[0.95rem] font-bold text-black dark:text-white">Scoring Methodology</h3>
            <p className="mt-2 text-[0.8rem] leading-6 text-slate-700 dark:text-slate-400">
              Understand how our AI evaluates communication, technical accuracy, and readiness.
            </p>
          </Card>
        </div>

        {/* Content Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* FAQ Accordion */}
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[1.1rem] font-bold text-slate-800">Frequently Asked Questions</h2>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1 text-[0.8rem] font-semibold text-slate-600 self-start sm:self-auto">
                {(["all", "general", "audio", "resumes"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setExpandedFaq(null);
                    }}
                    className={`rounded-lg px-3 py-1.5 capitalize transition-all ${activeCategory === cat
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "hover:text-slate-900"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-[16px] border border-slate-100 bg-white shadow-sm transition-all duration-200"
                  >
                    <button
                      onClick={() => handleToggleFaq(idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50/50"
                    >
                      <span className="text-[0.88rem] leading-5">{faq.question}</span>
                      <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[200px] border-t border-slate-50 px-5 py-4" : "max-h-0"
                        } overflow-hidden`}
                    >
                      <p className="text-[0.85rem] leading-7 text-slate-500">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
              {filteredFaqs.length === 0 && (
                <p className="text-center text-slate-400 py-8 italic text-[0.85rem]">
                  No questions found in this category.
                </p>
              )}
            </div>
          </div>

          {/* Contact Support Ticket Form */}
          <Card className="p-6 h-fit">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-indigo-50">
                <Icon name="mail" className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-[1rem] font-bold text-slate-800">Submit a Ticket</h2>
            </div>
            <p className="text-[0.78rem] leading-5 text-slate-400 mb-4">
              Can't find what you need? Describe your problem and our team will get back to you directly.
            </p>

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-[0.78rem] font-bold text-slate-600 mb-1.5">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800 px-3.5 py-2.5 text-[0.85rem] text-slate-700 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  <option value="general">General Question</option>
                  <option value="audio">Audio / Microphone Issue</option>
                  <option value="resumes">Resume Upload Problem</option>
                  <option value="billing">Billing / Membership</option>
                </select>
              </div>

              <div>
                <label className="block text-[0.78rem] font-bold text-slate-600 mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="Summarize your issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800 px-3.5 py-2.5 text-[0.85rem] text-slate-700 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-[0.78rem] font-bold text-slate-600 mb-1.5">Details</label>
                <textarea
                  rows={4}
                  placeholder="Explain details of the issue..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-800 px-3.5 py-3 text-[0.85rem] text-slate-700 dark:text-white outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-6"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/60 px-4 py-3 text-[0.85rem] font-bold text-white transition-all shadow-sm"
              >
                {submitting ? "Submitting..." : "Send Ticket"}
              </button>
            </form>
          </Card>
        </div>
      </div>
    </AuthenticatedShell>
  );
}
