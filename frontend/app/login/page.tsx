"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useAuth } from "@/components/auth-provider";
import { BrandMark, Icon } from "@/components/interview-ai";

type LoginFormState = { email: string; password: string };

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const redirectTo = useMemo(() => searchParams.get("redirect") || "/dashboard", [searchParams]);

  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const handle = (k: keyof LoginFormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(form);
      router.replace(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#04060e] text-slate-100">
      {/* ── Left panel ── */}
      <div
        className="relative hidden lg:flex lg:w-[480px] xl:w-[560px] shrink-0 flex-col justify-between overflow-hidden p-12 border-r border-indigo-500/10 bg-[#02040a]"
      >
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="animate-blob absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 65%)" }}
          />
          <div
            className="animate-blob delay-300 absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 65%)" }}
          />
        </div>

        <div className="relative">
          <BrandMark variant="sidebar" />
        </div>

        <div className="relative space-y-10">
          <div>
            <h2 className="text-[2rem] font-black leading-tight text-white">
              Nail every interview<br />with AI coaching.
            </h2>
            <p className="mt-3 text-[0.95rem] leading-7 text-slate-400">
              Practice realistic mock interviews, get instant AI feedback, and track your progress to land the job you deserve.
            </p>
          </div>

          {/* Social proof */}
          <div className="space-y-4">
            {[
              { text: "5,000+ professionals trained", icon: "✓" },
              { text: "92% reported higher confidence", icon: "✓" },
              { text: "AI feedback in under 10 seconds", icon: "✓" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[0.68rem] font-bold text-indigo-300">
                  {item.icon}
                </span>
                <span className="text-[0.88rem] text-slate-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="relative text-[0.75rem] text-slate-500">
          &copy; 2026 InterviewAI. All rights reserved.
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 lg:hidden">
          <BrandMark variant="sidebar" />
        </div>

        <div className="w-full max-w-[400px] animate-fade-up">
          <div className="mb-8">
            <h1 className="text-[1.8rem] font-extrabold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="mt-1.5 text-[0.9rem] text-slate-400">
              Sign in to your account to continue
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3" role="alert">
                <div className="h-4 w-4 shrink-0 text-red-400">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/></svg>
                </div>
                <p className="text-[0.84rem] text-red-400">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[0.8rem] font-bold text-slate-300">Email address</label>
              <div className="flex items-center gap-2.5 rounded-xl border border-indigo-500/10 bg-slate-900/60 px-4 py-3 transition-all duration-150 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10">
                <Icon name="mail" className="h-4 w-4 shrink-0 text-slate-500" />
                <input
                  type="email" name="email" autoComplete="email" required
                  placeholder="name@company.com"
                  disabled={submitting} value={form.email} onChange={handle("email")}
                  className="w-full bg-transparent text-[0.9rem] font-medium text-white placeholder:font-normal placeholder:text-slate-600 outline-none disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[0.8rem] font-bold text-slate-300">Password</label>
                <Link href="#reset" className="text-[0.78rem] font-semibold text-indigo-400 hover:opacity-75">
                  Forgot password?
                </Link>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-indigo-500/10 bg-slate-900/60 px-4 py-3 transition-all duration-150 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10">
                <Icon name="lock" className="h-4 w-4 shrink-0 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"} name="password" autoComplete="current-password" required
                  placeholder="Enter your password"
                  disabled={submitting} value={form.password} onChange={handle("password")}
                  className="w-full bg-transparent text-[0.9rem] font-medium text-white placeholder:font-normal placeholder:text-slate-600 outline-none disabled:opacity-60"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                  className="shrink-0 text-slate-500 transition-colors hover:text-indigo-400">
                  <Icon name="eye" className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit" type="submit" disabled={submitting}
              className="btn-shimmer mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4338ca] px-5 py-3.5 text-[0.9rem] font-semibold text-white shadow-[0_4px_16px_rgba(99,102,241,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(99,102,241,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-slate-900" />
              <span className="text-[0.78rem] text-slate-600 font-bold uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-slate-900" />
            </div>

            {/* Google */}
            <button type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-3 text-[0.88rem] font-semibold text-slate-300 hover:text-white transition-all duration-150 hover:bg-slate-800/80"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-[0.85rem] text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-indigo-400 hover:opacity-75">
                Create one free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#04060e]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#4338ca] animate-pulse" />
          <p className="text-[0.72rem] font-bold uppercase tracking-widest text-slate-500">Loading…</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
