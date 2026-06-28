import Link from "next/link";
import {
  Badge,
  BrandMark,
  ButtonLink,
  Card,
  Icon,
  SectionHeading,
} from "@/components/interview-ai";
import { cn } from "@/lib/cn";

const features = [
  {
    title: "Realistic Simulations",
    body: "Practice with company-style prompts, live behavioral scenarios, and role-aware drills that feel close to the real thing.",
    icon: "interviews",
    accent: "#ede9fe",
    iconColor: "#4f46e5",
  },
  {
    title: "Instant AI Feedback",
    body: "Receive a full performance breakdown across tone, clarity, pacing, and structure—delivered in under 10 seconds.",
    icon: "sparkles",
    accent: "#d1fae5",
    iconColor: "#059669",
    highlight: true,
  },
  {
    title: "Communication Coaching",
    body: "Eliminate filler words, build confident delivery, and present technical ideas with crystal clarity.",
    icon: "microphone",
    accent: "#fef3c7",
    iconColor: "#b45309",
  },
  {
    title: "Custom Role Tailoring",
    body: "Match interview content to frontend, backend, product, design, or leadership roles with a single prompt.",
    icon: "briefcase",
    accent: "#fce7f3",
    iconColor: "#be185d",
  },
];

const steps = [
  {
    num: "01",
    title: "Choose your role",
    body: "Pick the target job title or paste a JD to shape the interview set.",
    color: "#4f46e5",
    bg: "#ede9fe",
  },
  {
    num: "02",
    title: "Record your answers",
    body: "Answer naturally while the AI mock interviewer keeps the session moving.",
    color: "#059669",
    bg: "#d1fae5",
  },
  {
    num: "03",
    title: "Review your analysis",
    body: "Get a detailed scorecard with concrete actions to apply immediately.",
    color: "#b45309",
    bg: "#fef3c7",
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Frontend Engineer · Google",
    avatar: "SK",
    quote: "The simulations were remarkably close to real interviews. After just two sessions I felt 10x calmer in the real thing.",
    stars: 5,
    tone: "violet" as const,
  },
  {
    name: "Michael T.",
    role: "Product Manager · Stripe",
    avatar: "MT",
    quote: "The behavioral prompts were razor-sharp and the AI feedback was specific enough to improve my storytelling fast.",
    stars: 5,
    tone: "mint" as const,
  },
  {
    name: "Priya S.",
    role: "Staff Engineer · Airbnb",
    avatar: "PS",
    quote: "I went from bombing system design rounds to getting an offer at my dream company. InterviewAI was the difference.",
    stars: 5,
    tone: "rose" as const,
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Get started with no commitment.",
    features: ["2 mock interviews / month", "Basic AI feedback", "50+ common questions", "Score tracking"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    desc: "Everything you need to land the job.",
    features: ["Unlimited AI interviews", "Deep communication analysis", "Video recording & playback", "AI-generated model answers", "Role-specific question banks", "Priority support"],
    cta: "Start 7-Day Free Trial",
    highlight: true,
  },
];

const stats = [
  { value: "5,000+", label: "Professionals trained" },
  { value: "92%",    label: "Reported more confidence" },
  { value: "3.4×",  label: "Faster offer rate" },
  { value: "4.9★",  label: "Average rating" },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#faf9ff] text-slate-900">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-[#e8e6f0] bg-[#faf9ff]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-8">
          <BrandMark />
          <nav className="hidden items-center gap-7 text-[0.86rem] font-semibold text-[#64748b] md:flex">
            <Link href="#features" className="transition-colors duration-150 hover:text-[#6366f1]">Features</Link>
            <Link href="#how-it-works" className="transition-colors duration-150 hover:text-[#6366f1]">How it works</Link>
            <Link href="#testimonials" className="transition-colors duration-150 hover:text-[#6366f1]">Stories</Link>
            <Link href="#pricing" className="transition-colors duration-150 hover:text-[#6366f1]">Pricing</Link>
          </nav>
          <details className="group relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-[12px] border border-[#e8e6f0] bg-white text-slate-600 transition hover:bg-[#f4f3ff] [&::-webkit-details-marker]:hidden">
              <Icon name="dots" className="h-5 w-5" />
            </summary>
            <nav className="absolute right-0 top-12 z-50 min-w-[180px] rounded-[16px] border border-[#e8e6f0] bg-white p-2 shadow-[0_12px_32px_rgba(99,102,241,0.10)]">
              <Link href="#features" className="block rounded-[10px] px-4 py-2.5 text-[0.88rem] font-semibold text-slate-600 transition hover:bg-[#f4f3ff] hover:text-[#6366f1]">Features</Link>
              <Link href="#how-it-works" className="block rounded-[10px] px-4 py-2.5 text-[0.88rem] font-semibold text-slate-600 transition hover:bg-[#f4f3ff] hover:text-[#6366f1]">How it works</Link>
              <Link href="#testimonials" className="block rounded-[10px] px-4 py-2.5 text-[0.88rem] font-semibold text-slate-600 transition hover:bg-[#f4f3ff] hover:text-[#6366f1]">Stories</Link>
              <Link href="#pricing" className="block rounded-[10px] px-4 py-2.5 text-[0.88rem] font-semibold text-slate-600 transition hover:bg-[#f4f3ff] hover:text-[#6366f1]">Pricing</Link>
            </nav>
          </details>
          <div className="flex items-center gap-3">
            <ButtonLink href="/login"  variant="ghost"   className="px-4 py-2 text-[0.86rem]">Log in</ButtonLink>
            <ButtonLink href="/signup" className="px-4 py-2 text-[0.86rem]">Get Started Free</ButtonLink>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 md:px-8 md:pb-32 md:pt-28">
          {/* BG blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-blob absolute -top-40 left-1/2 -translate-x-1/2 h-[640px] w-[640px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)" }} />
            <div className="animate-blob delay-300 absolute top-1/3 -right-32 h-[440px] w-[440px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 65%)" }} />
            <div className="animate-blob delay-500 absolute bottom-0 -left-24 h-[360px] w-[360px] rounded-full" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 65%)" }} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <Badge tone="violet" className="mb-4">
                <Icon name="sparkles" className="h-3 w-3" />
                AI-Powered Career Transformation
              </Badge>

              <h1 className="mt-6 text-balance text-[3.2rem] font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-[4rem] lg:text-[4.5rem]">
                Master Your Next{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Interview
                </span>{" "}
                with AI
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-[1.02rem] leading-7 text-slate-500">
                The most realistic AI-powered interview prep platform. Get personalized mock interviews, instant feedback, and land your dream job faster.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="/signup" className="px-7 py-3.5 text-[0.97rem]">
                  Start Free Trial
                  <Icon name="arrow-right" className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="#demo" variant="secondary" className="px-7 py-3.5 text-[0.97rem] border border-[#e8e6f0] shadow-[var(--shadow-sm)]">
                  <Icon name="play" className="h-4 w-4" />
                  Watch Demo
                </ButtonLink>
              </div>

              <p className="mt-5 text-[0.8rem] text-slate-400">
                No credit card required &middot; 5 free sessions &middot; Cancel anytime
              </p>
            </div>

            {/* Hero preview card */}
            <div id="demo" className="mx-auto mt-16 max-w-5xl">
              <div className="overflow-hidden rounded-[28px] bg-[#0f172a] p-1 shadow-[0_32px_80px_rgba(13,15,26,0.22)]">
                <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#1e293b,#0f172a)]">
                  {/* Fake browser bar */}
                  <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="mx-auto flex h-7 w-64 items-center justify-center rounded-lg bg-white/[0.06] px-3 text-[0.72rem] text-white/40">
                      app.interviewai.com · Session Live
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1 text-[0.72rem] font-medium text-[#34d399]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34d399]" />
                      Recording
                    </div>
                  </div>

                  {/* Preview content */}
                  <div className="grid gap-4 p-5 lg:grid-cols-2">
                    {/* Left – video */}
                    <div className="rounded-[20px] bg-[linear-gradient(180deg,#1a3550,#0d1f33)] p-5">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-24 rounded-full bg-white/10" />
                        <div className="flex items-center gap-1.5 rounded-full bg-[#4f46e5]/30 px-3 py-1 text-[0.7rem] font-medium text-[#a5b4fc]">
                          <Icon name="microphone" className="h-3 w-3" />
                          Live
                        </div>
                      </div>

                      {/* Camera preview */}
                      <div className="mt-4 grid grid-cols-[80px_1fr] gap-3">
                        <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#f0c5a0,#7a5640)] aspect-square" />
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-[#34d399]" />
                            <div className="h-3 w-20 rounded-full bg-white/10" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-[14px] bg-white/[0.06] p-3 ring-1 ring-white/10">
                              <div className="h-14 rounded-lg bg-[linear-gradient(180deg,#1f4566,#102035)]" />
                              <div className="mt-2 h-2.5 w-16 rounded-full bg-white/10" />
                            </div>
                            <div className="rounded-[14px] bg-white/[0.06] p-3 ring-1 ring-white/10">
                              <div className="space-y-1.5">
                                {[20, 16, 22].map((w, i) => (
                                  <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${w * 4}px` }} />
                                ))}
                              </div>
                              <div className="mt-3 grid grid-cols-3 gap-1.5">
                                {["#5d54ff", "#2f7cc8", "#1d3147"].map((c, i) => (
                                  <div key={i} className="h-8 rounded-[8px]" style={{ backgroundColor: c }} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right – AI feedback */}
                    <div className="rounded-[20px] bg-[linear-gradient(180deg,#1e3148,#101825)] p-5">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 rounded-full bg-white/10" />
                        <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[0.7rem] font-medium text-white/70">
                          <Icon name="sparkles" className="h-3 w-3" />
                          AI Review
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-[1fr_1.15fr] gap-3">
                        <div className="space-y-2.5 rounded-[16px] bg-white/[0.06] p-4 ring-1 ring-white/10">
                          <div className="h-3.5 w-20 rounded-full bg-white/10" />
                          <div className="space-y-1.5">
                            {[100, 85, 70].map((w, i) => (
                              <div key={i} className="h-2 rounded-full bg-white/10" style={{ width: `${w}%` }} />
                            ))}
                          </div>
                          <div className="mt-2 h-20 rounded-[12px] bg-[linear-gradient(180deg,#274268,#18263e)]" />
                        </div>

                        <div className="space-y-3">
                          <div className="rounded-[16px] bg-[#29395e] p-4 ring-1 ring-white/10">
                            <div className="flex items-center justify-between text-white/70">
                              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">Score</span>
                              <span className="text-[0.88rem] font-bold text-[#34d399]">92 / 100</span>
                            </div>
                            <div className="mt-3 flex items-end gap-1">
                              {[46, 72, 55, 88, 68, 96].map((h, i) => (
                                <div
                                  key={i}
                                  className="flex-1 rounded-full bg-[#4f46e5]"
                                  style={{ height: `${h * 0.5}px`, opacity: i === 5 ? 1 : 0.35 + i * 0.08 }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="rounded-[16px] bg-white/[0.06] p-4 text-[0.78rem] leading-5 text-white/75 ring-1 ring-white/10">
                            Strong structure, confident delivery. Tighten the final summary.
                            <div className="mt-2 h-2 w-32 rounded-full bg-white/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-[#e8e6f0] bg-[#f4f3ff]/60 px-6 py-10 md:px-8">
          <div className="mx-auto max-w-4xl grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-[2.1rem] font-bold tracking-tight text-[#3730a3]">{s.value}</p>
                <p className="mt-1 text-[0.83rem] font-medium text-[#64748b]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-6 py-24 md:px-8 bg-[#faf9ff]">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Top Features"
              title="Everything you need to land the role"
              description="From realistic simulations to instant AI coaching — we've built the toolkit that serious candidates use."
            />

            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {features.map((f) => (
                <Card
                  key={f.title}
                  className={cn(
                    "group p-6 md:p-8 transition-all duration-300",
                    f.highlight
                      ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/10 hover:-translate-y-0.5"
                      : "hover:shadow-lg hover:border-slate-200/50 hover:-translate-y-0.5",
                  )}
                >
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[16px]"
                    style={{
                      backgroundColor: f.highlight ? "rgba(255,255,255,0.15)" : f.accent,
                    }}
                  >
                    <Icon
                      name={f.icon}
                      className="h-6 w-6"
                      style={{ color: f.highlight ? "#ffffff" : f.iconColor } as React.CSSProperties}
                    />
                  </div>
                  <h3 className={cn("mt-5 text-[1.15rem] font-bold tracking-tight", f.highlight ? "text-white" : "text-slate-900")}>
                    {f.title}
                  </h3>
                  <p className={cn("mt-2.5 text-[0.92rem] leading-7", f.highlight ? "text-white/80" : "text-slate-500")}>
                    {f.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="bg-[#f4f3ff]/40 border-y border-[#e8e6f0] px-6 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Process"
              title="Go from nervous to confident in 3 steps"
              description="Simple setup, powerful results. Your first session takes less than 5 minutes."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {steps.map((step) => (
                <Card key={step.num} className="relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(13,15,26,0.10)]">
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] text-[0.9rem] font-bold"
                    style={{ backgroundColor: step.bg, color: step.color }}
                  >
                    {step.num}
                  </div>
                  <h3 className="mt-5 text-[1.1rem] font-bold text-[#0d0f1a]">{step.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-6 text-[#6b7280]">{step.body}</p>
                  <div
                    className="absolute bottom-0 right-0 h-20 w-20 rounded-tl-[32px] opacity-[0.08]"
                    style={{ backgroundColor: step.bg }}
                  />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="px-6 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Success Stories"
              title="Trusted by ambitious candidates"
              description="Join thousands of professionals who leveled up with InterviewAI."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => {
                const avatarColors = {
                  violet: "bg-[linear-gradient(135deg,#ede9fe,#c4b5fd)] text-[#4f46e5]",
                  mint:   "bg-[linear-gradient(135deg,#d1fae5,#6ee7b7)] text-[#059669]",
                  rose:   "bg-[linear-gradient(135deg,#fce7f3,#f9a8d4)] text-[#be185d]",
                };
                return (
                  <Card key={t.name} className="flex flex-col gap-5 p-6 md:p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(13,15,26,0.10)]">
                    {/* Stars */}
                    <div className="flex gap-1 text-[#fbbf24]">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Icon key={i} name="star" className="h-4 w-4" />
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-[0.95rem] leading-7 text-[#374151]">"{t.quote}"</p>
                    {/* Author */}
                    <div className="mt-auto flex items-center gap-3">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[0.78rem] font-bold", avatarColors[t.tone])}>
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-[0.88rem] font-bold text-[#0d0f1a]">{t.name}</p>
                        <p className="text-[0.78rem] text-[#9ca3af]">{t.role}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="bg-[#f5f6fb] px-6 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Pricing"
              title="Invest in your career"
              description="Transparent pricing. No hidden fees. Upgrade or cancel anytime."
            />

            <div className="mt-14 grid gap-5 lg:grid-cols-2 max-w-3xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    "flex flex-col p-7",
                    plan.highlight
                      ? "bg-[linear-gradient(135deg,#4f46e5,#3730a3)] text-white ring-white/10 shadow-[0_20px_48px_rgba(79,70,229,0.28)]"
                      : "",
                  )}
                >
                  {plan.highlight && (
                    <div className="mb-4">
                      <Badge tone="dark" className="bg-white/20 text-white ring-white/20">Most Popular</Badge>
                    </div>
                  )}
                  <p className={cn("text-[1.1rem] font-bold", plan.highlight ? "text-white" : "text-[#0d0f1a]")}>
                    {plan.name}
                  </p>
                  <p className={cn("mt-1 text-[0.85rem]", plan.highlight ? "text-white/65" : "text-[#9ca3af]")}>
                    {plan.desc}
                  </p>
                  <div className="mt-5 flex items-end gap-1.5">
                    <span className={cn("text-[3rem] font-bold leading-none tracking-tight", plan.highlight ? "text-white" : "text-[#0d0f1a]")}>
                      {plan.price}
                    </span>
                    <span className={cn("pb-1.5 text-[0.88rem]", plan.highlight ? "text-white/65" : "text-[#9ca3af]")}>
                      /month
                    </span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full", plan.highlight ? "bg-white/20" : "bg-[#ede9fe]")}>
                          <svg className={cn("h-3 w-3", plan.highlight ? "text-white" : "text-[#4f46e5]")} viewBox="0 0 12 12" fill="currentColor">
                            <path d="M10.28 2.28 3.989 8.575 1.695 6.28A1 1 0 0 0 .28 7.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28 2.28Z" />
                          </svg>
                        </div>
                        <span className={cn("text-[0.88rem]", plan.highlight ? "text-white/85" : "text-[#374151]")}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <ButtonLink
                      href="/signup"
                      variant={plan.highlight ? "dark" : "outline"}
                      className="w-full justify-center py-3"
                    >
                      {plan.cta}
                    </ButtonLink>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-6 pb-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0f172a,#1e293b)] px-8 py-16 text-center text-white shadow-[0_24px_56px_rgba(13,15,26,0.24)] md:px-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.35),transparent_55%)]" />
              <div className="relative">
                <Badge tone="violet" className="mx-auto">
                  <Icon name="sparkles" className="h-3 w-3" />
                  Start Today
                </Badge>
                <h2 className="mt-5 text-balance text-[2.2rem] font-bold tracking-tight md:text-[2.8rem]">
                  Ready to ace your interview?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[1rem] leading-8 text-white/65">
                  Start practicing today and join thousands of people who landed their dream jobs with InterviewAI.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <ButtonLink href="/signup" variant="dark" className="px-7 py-3.5 text-[1rem]">
                    Start Free Trial
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </ButtonLink>
                  <ButtonLink href="/login" className="bg-white/[0.08] px-7 py-3.5 text-[1rem] text-white ring-1 ring-white/20 hover:bg-white/[0.15]">
                    Sign In
                  </ButtonLink>
                </div>
                <p className="mt-5 text-[0.8rem] text-white/45">No credit card required</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e8e6f0] bg-[#faf9ff] px-6 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 text-[#6b7280] md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 max-w-xs">
            <BrandMark />
            <p className="text-[0.85rem] leading-6">
              Empowering candidates with the world&apos;s most advanced AI-driven interview preparation platform.
            </p>
          </div>
          <div className="flex flex-wrap gap-12 text-[0.85rem]">
            <div className="space-y-3">
              <p className="font-semibold text-[#0d0f1a]">Product</p>
              <div className="space-y-2">
                <Link href="#features" className="block hover:text-[#4f46e5] transition-colors">Features</Link>
                <Link href="#pricing" className="block hover:text-[#4f46e5] transition-colors">Pricing</Link>
                <Link href="#how-it-works" className="block hover:text-[#4f46e5] transition-colors">How it works</Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-[#0d0f1a]">Company</p>
              <div className="space-y-2">
                <Link href="#about" className="block hover:text-[#4f46e5] transition-colors">About</Link>
                <Link href="#blog" className="block hover:text-[#4f46e5] transition-colors">Blog</Link>
                <Link href="#careers" className="block hover:text-[#4f46e5] transition-colors">Careers</Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-[#0d0f1a]">Legal</p>
              <div className="space-y-2">
                <Link href="#privacy" className="block hover:text-[#4f46e5] transition-colors">Privacy</Link>
                <Link href="#terms" className="block hover:text-[#4f46e5] transition-colors">Terms</Link>
                <Link href="#security" className="block hover:text-[#4f46e5] transition-colors">Security</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl items-center justify-between border-t border-slate-200/60 pt-6 text-[0.8rem] text-[#9ca3af]">
          <p>© 2026 InterviewAI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#059669]" />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
