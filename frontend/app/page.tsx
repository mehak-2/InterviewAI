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
    border: "border-indigo-500/20",
    bg: "rgba(99,102,241,0.04)",
  },
  {
    title: "Instant AI Feedback",
    body: "Receive a full performance breakdown across tone, clarity, pacing, and structure—delivered in under 10 seconds.",
    icon: "sparkles",
    border: "border-purple-500/30",
    bg: "rgba(168,85,247,0.06)",
    highlight: true,
  },
  {
    title: "Communication Coaching",
    body: "Eliminate filler words, build confident delivery, and present technical ideas with crystal clarity.",
    icon: "microphone",
    border: "border-emerald-500/20",
    bg: "rgba(16,185,129,0.04)",
  },
  {
    title: "Custom Role Tailoring",
    body: "Match interview content to frontend, backend, product, design, or leadership roles with a single prompt.",
    icon: "briefcase",
    border: "border-rose-500/20",
    bg: "rgba(244,63,94,0.04)",
  },
];

const steps = [
  {
    num: "01",
    title: "Choose your role",
    body: "Pick the target job title or paste a JD to shape the interview set.",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.1)",
  },
  {
    num: "02",
    title: "Record your answers",
    body: "Answer naturally while the AI mock interviewer keeps the session moving.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
  {
    num: "03",
    title: "Review your analysis",
    body: "Get a detailed scorecard with concrete actions to apply immediately.",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
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
  { value: "5,000+", label: "Professionals trained", glow: "rgba(99,102,241,0.15)" },
  { value: "92%",    label: "Reported more confidence", glow: "rgba(16,185,129,0.15)" },
  { value: "3.4×",  label: "Faster offer rate", glow: "rgba(245,158,11,0.15)" },
  { value: "4.9★",  label: "Average rating", glow: "rgba(244,63,94,0.15)" },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#04060e] text-slate-100 font-sans antialiased">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-indigo-500/10 bg-[#04060e]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-8">
          <BrandMark variant="sidebar" />
          <nav className="hidden items-center gap-7 text-[0.85rem] font-semibold text-slate-400 md:flex">
            <Link href="#features" className="transition-colors duration-150 hover:text-indigo-400">Features</Link>
            <Link href="#how-it-works" className="transition-colors duration-150 hover:text-indigo-400">How it works</Link>
            <Link href="#testimonials" className="transition-colors duration-150 hover:text-indigo-400">Stories</Link>
            <Link href="#pricing" className="transition-colors duration-150 hover:text-indigo-400">Pricing</Link>
          </nav>
          <details className="group relative md:hidden">
            <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-xl border border-indigo-500/10 bg-slate-900/60 text-slate-400 transition hover:bg-slate-800/80 [&::-webkit-details-marker]:hidden">
              <Icon name="dots" className="h-4.5 w-4.5" />
            </summary>
            <nav className="absolute right-0 top-11 z-50 min-w-[170px] rounded-[16px] border border-indigo-500/20 bg-slate-950 p-2 shadow-[0_12px_32px_rgba(99,102,241,0.25)]">
              <Link href="#features" className="block rounded-[10px] px-4 py-2.5 text-[0.85rem] font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-indigo-400">Features</Link>
              <Link href="#how-it-works" className="block rounded-[10px] px-4 py-2.5 text-[0.85rem] font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-indigo-400">How it works</Link>
              <Link href="#testimonials" className="block rounded-[10px] px-4 py-2.5 text-[0.85rem] font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-indigo-400">Stories</Link>
              <Link href="#pricing" className="block rounded-[10px] px-4 py-2.5 text-[0.85rem] font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-indigo-400">Pricing</Link>
            </nav>
          </details>
          <div className="flex items-center gap-3">
            <ButtonLink href="/login" variant="ghost" className="px-4 py-2 text-[0.85rem] text-slate-300 hover:text-white">Log in</ButtonLink>
            <ButtonLink href="/signup" className="px-4.5 py-2 text-[0.85rem]">Get Started</ButtonLink>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 cyber-grid md:px-8 md:pb-32 md:pt-28">
          {/* Neon BG glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-blob absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full opacity-40" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)" }} />
            <div className="animate-blob delay-200 absolute top-1/4 -right-32 h-[500px] w-[500px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 65%)" }} />
            <div className="animate-blob delay-300 absolute bottom-0 -left-24 h-[400px] w-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)" }} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="cyber-glow-pill inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-[0.72rem] font-bold uppercase tracking-wider text-indigo-300">
                <Icon name="sparkles" className="h-3.5 w-3.5" />
                AI-Powered Career Transformation
              </span>

              <h1 className="mt-7 text-balance text-[3.2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[4rem] lg:text-[4.6rem]">
                Master Your Next{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Interview
                </span>{" "}
                with AI
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-[0.98rem] leading-7 text-slate-400">
                The most realistic AI-powered interview prep platform. Get personalized mock interviews, instant speech breakdowns, and land your dream job.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
                <ButtonLink href="/signup" className="px-7.5 py-3.5 text-[0.95rem]">
                  Start Free Trial
                  <Icon name="arrow-right" className="h-4.5 w-4.5" />
                </ButtonLink>
                <ButtonLink href="#demo" variant="secondary" className="px-7.5 py-3.5 text-[0.95rem] border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white">
                  <Icon name="play" className="h-4.5 w-4.5" />
                  Watch Demo
                </ButtonLink>
              </div>

              <p className="mt-5 text-[0.78rem] text-slate-500">
                No credit card required &middot; 5 free sessions &middot; Cancel anytime
              </p>
            </div>

            {/* Hero preview card */}
            <div id="demo" className="mx-auto mt-20 max-w-4xl animate-fade-up">
              <div className="rounded-[24px] border border-indigo-500/20 bg-slate-950/80 p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_24px_rgba(99,102,241,0.06)] backdrop-blur-md">
                <div className="relative aspect-video overflow-hidden rounded-[16px] bg-[#0c1020]">
                  {/* Decorative AI dashboard mock elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 to-slate-950/60" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-rose-500" />
                        <span className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      </div>
                      <span className="rounded-full bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 text-[0.62rem] font-bold text-indigo-400 uppercase tracking-widest">
                        AI Coach Active
                      </span>
                    </div>

                    <div className="mx-auto text-center space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)] animate-pulse">
                        <Icon name="microphone" className="h-6 w-6" />
                      </div>
                      <p className="text-[0.9rem] font-bold tracking-wide text-indigo-300">"Explain a challenging technical project you worked on..."</p>
                      <p className="text-[0.75rem] text-slate-500">AI analysis: structure 88% | pacing 92% | tone confident</p>
                    </div>

                    <div className="flex justify-between items-center text-[0.72rem] text-slate-500">
                      <span>Recording... 01:24</span>
                      <span>Press SPACE to finish</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-slate-900 bg-slate-950/40 px-6 py-10 md:px-8">
          <div className="mx-auto max-w-4xl grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="text-[2.2rem] font-black tracking-tight text-white" style={{ textShadow: `0 0 16px ${s.glow}` }}>{s.value}</p>
                <p className="text-[0.8rem] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-6 py-24 md:px-8 bg-[#04060e]/50 border-b border-slate-900">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Key Features"
              title="Built for the modern candidate"
              description="Everything you need to master your speech, refine your technical answers, and walk in with maximum confidence."
            />

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={cn(
                    "relative overflow-hidden rounded-[20px] border p-6 card-lift cursor-default",
                    f.border
                  )}
                  style={{ background: f.bg }}
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 mb-4">
                    <Icon name={f.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="text-[1.05rem] font-extrabold text-white">{f.title}</h3>
                  <p className="mt-2.5 text-[0.82rem] leading-6 text-slate-400">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="px-6 py-24 md:px-8 bg-slate-950/20 border-b border-slate-900">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Process"
              title="Perfect your delivery in 3 steps"
              description="Learn to structure your answers correctly with instant speech feedback and adaptive questions."
            />

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((s, idx) => (
                <div key={s.title} className="relative p-6 rounded-2xl border border-slate-800 bg-[#090d16]/30">
                  <div
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[0.85rem] font-extrabold mb-4"
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    {s.num}
                  </div>
                  <h3 className="text-[1.05rem] font-bold text-white">{s.title}</h3>
                  <p className="mt-2.5 text-[0.85rem] leading-6 text-slate-400">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="px-6 py-24 md:px-8 bg-[#04060e]/50 border-b border-slate-900">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Reviews"
              title="Success Stories"
              description="See how developers and product leaders used InterviewAI to land offers at their dream companies."
            />

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.name} className="flex flex-col justify-between p-6 md:p-8 card-lift border-slate-800 bg-[#090d16]/50">
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(t.stars)].map((_, i) => (
                        <span key={i} className="text-[1.05rem]">★</span>
                      ))}
                    </div>
                    <p className="text-[0.86rem] leading-6 text-slate-300 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-3.5 pt-4 border-t border-slate-800/80">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/25 text-[0.72rem] font-bold text-indigo-400">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-[0.82rem] font-bold text-white">{t.name}</p>
                      <p className="text-[0.72rem] text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="px-6 py-24 md:px-8 bg-slate-950/20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Pricing Plans"
              title="Transparent, value-driven plans"
              description="Start practicing for free, then upgrade when you are ready to accelerate your prep."
            />

            <div className="mx-auto mt-16 max-w-3xl grid gap-6 sm:grid-cols-2">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={cn(
                    "flex flex-col justify-between p-8 rounded-3xl border transition-all duration-200",
                    p.highlight
                      ? "bg-slate-900 border-indigo-500/40 shadow-[0_16px_40px_rgba(99,102,241,0.12)]"
                      : "bg-[#090d16]/40 border-slate-800"
                  )}
                >
                  <div>
                    <h3 className="text-[1.2rem] font-extrabold text-white">{p.name}</h3>
                    <p className="mt-1 text-[0.8rem] text-slate-500">{p.desc}</p>
                    <div className="mt-4 flex items-baseline gap-1 text-white">
                      <span className="text-[2.2rem] font-black">{p.price}</span>
                      <span className="text-[0.8rem] text-slate-400">/ month</span>
                    </div>
                    {/* Features */}
                    <ul className="mt-6 space-y-3 border-t border-slate-800 pt-6">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[0.82rem] text-slate-300">
                          <span className="text-emerald-400">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8">
                    <ButtonLink
                      href="/signup"
                      variant={p.highlight ? "primary" : "secondary"}
                      className="w-full py-3 text-[0.88rem] border border-slate-800"
                    >
                      {p.cta}
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 bg-[#02040a] px-6 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 text-[#64748b] md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 max-w-xs">
            <BrandMark variant="sidebar" />
            <p className="text-[0.78rem] leading-6 text-slate-500">
              The AI-powered interview practice platform built for high-growth tech candidates.
            </p>
          </div>
          <div className="flex flex-wrap gap-10 text-[0.8rem]">
            <div className="space-y-3">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[0.72rem]">Product</p>
              <ul className="space-y-2">
                <li><Link href="#features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-slate-400 uppercase tracking-wider text-[0.72rem]">Company</p>
              <ul className="space-y-2">
                <li><Link href="#privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link></li>
                <li><Link href="#terms" className="hover:text-indigo-400 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl mt-8 pt-8 border-t border-slate-900/60 flex flex-col justify-between gap-4 md:flex-row text-[0.75rem] text-slate-600">
          <span>&copy; 2026 InterviewAI. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#twitter" className="hover:text-indigo-400">Twitter</Link>
            <Link href="#github" className="hover:text-indigo-400">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
