"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useAuth } from "@/components/auth-provider";
import { BrandMark, Icon } from "@/components/interview-ai";

type LoginFormState = {
  email: string;
  password: string;
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const redirectTo = useMemo(() => searchParams.get("redirect") || "/dashboard", [searchParams]);

  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (field: keyof LoginFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setError(null);
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(form);
      router.replace(redirectTo);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f6fb]">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12),transparent_70%)]" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.08),transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.04),transparent_65%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        <BrandMark />
        <nav className="flex items-center gap-6 text-[0.9rem] font-medium text-[#6b7280]">
          <Link href="#support" className="transition-colors duration-150 hover:text-[#4f46e5]">Support</Link>
          <Link href="#careers" className="transition-colors duration-150 hover:text-[#4f46e5]">Careers</Link>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px] animate-fade-in-up">
          {/* Card */}
          <div className="rounded-[28px] bg-white p-8 shadow-[0_8px_32px_rgba(13,15,26,0.08),0_1px_2px_rgba(13,15,26,0.04)] ring-1 ring-slate-200/60 sm:p-10">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#6366f1,#4f46e5)] shadow-[0_8px_20px_rgba(99,102,241,0.35)]">
                <Icon name="brand" className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-[1.9rem] font-bold tracking-tight text-[#0d0f1a]">Welcome back</h1>
              <p className="mt-2 text-[0.92rem] text-[#6b7280]">Sign in to your InterviewAI account</p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {/* Error */}
              {error ? (
                <div className="flex items-start gap-3 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3" role="alert">
                  <div className="mt-0.5 h-4 w-4 shrink-0 text-red-500">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-[0.875rem] text-red-700">{error}</p>
                </div>
              ) : null}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[0.82rem] font-semibold text-[#374151]">Email address</label>
                <div className="flex items-center gap-3 rounded-[14px] bg-[#f8f9fc] px-4 py-3.5 ring-1 ring-[#e5e7eb] transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6366f1]/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]">
                  <Icon name="mail" className="h-[18px] w-[18px] shrink-0 text-[#9ca3af]" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    name="email"
                    autoComplete="email"
                    required
                    disabled={submitting}
                    value={form.email}
                    onChange={handleChange("email")}
                    className="w-full bg-transparent text-[0.95rem] font-medium text-[#1a1d2e] placeholder:font-normal placeholder:text-[#9ca3af] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[0.82rem] font-semibold text-[#374151]">Password</label>
                  <Link href="#reset" className="text-[0.82rem] font-semibold text-[#4f46e5] transition-opacity hover:opacity-75">
                    Forgot password?
                  </Link>
                </div>
                <div className="flex items-center gap-3 rounded-[14px] bg-[#f8f9fc] px-4 py-3.5 ring-1 ring-[#e5e7eb] transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6366f1]/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]">
                  <Icon name="lock" className="h-[18px] w-[18px] shrink-0 text-[#9ca3af]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    autoComplete="current-password"
                    required
                    disabled={submitting}
                    value={form.password}
                    onChange={handleChange("password")}
                    className="w-full bg-transparent text-[0.95rem] font-medium text-[#1a1d2e] placeholder:font-normal placeholder:text-[#9ca3af] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-[#9ca3af] transition-colors hover:text-[#6b7280]"
                    tabIndex={-1}
                  >
                    <Icon name="eye" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#6366f1,#4f46e5)] px-5 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(79,70,229,0.38)] disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </>
                ) : "Sign in"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e5e7eb]" />
                <span className="text-[0.8rem] font-medium text-[#9ca3af]">or</span>
                <div className="h-px flex-1 bg-[#e5e7eb]" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#e5e7eb] bg-white px-5 py-3.5 text-[0.92rem] font-semibold text-[#374151] shadow-[0_1px_3px_rgba(13,15,26,0.06)] transition-all duration-200 hover:bg-slate-50 hover:border-[#d1d5db]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Sign up link */}
              <p className="text-center text-[0.88rem] text-[#6b7280]">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-[#4f46e5] transition-opacity hover:opacity-75">
                  Create one free
                </Link>
              </p>
            </form>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-[0.78rem] text-[#9ca3af]">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-[#059669]" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm11.78-1.72a.75.75 0 0 0-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5Z" clipRule="evenodd" /></svg>
              256-bit encryption
            </span>
            <span className="h-3 w-px bg-[#e5e7eb]" />
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-[#059669]" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm11.78-1.72a.75.75 0 0 0-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5Z" clipRule="evenodd" /></svg>
              GDPR compliant
            </span>
            <span className="h-3 w-px bg-[#e5e7eb]" />
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-[#059669]" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm11.78-1.72a.75.75 0 0 0-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5Z" clipRule="evenodd" /></svg>
              SOC 2 certified
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <div className="mx-auto flex max-w-sm items-center justify-center gap-6 text-[0.8rem] text-[#9ca3af]">
          <Link href="#privacy" className="transition-colors hover:text-[#4f46e5]">Privacy</Link>
          <span className="h-3 w-px bg-[#e5e7eb]" />
          <Link href="#terms" className="transition-colors hover:text-[#4f46e5]">Terms</Link>
          <span className="h-3 w-px bg-[#e5e7eb]" />
          <Link href="#security" className="transition-colors hover:text-[#4f46e5]">Security</Link>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden bg-[#f5f6fb] flex items-center justify-center">
        <div className="text-slate-400 font-semibold tracking-wider">LOADING...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
