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

function InputField({
  type = "text",
  placeholder,
  name,
  autoComplete,
  required,
  disabled,
  value,
  onChange,
  icon,
  rightSlot,
}: {
  type?: string;
  placeholder: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-[14px] bg-[#f4f3ff] px-4 py-3.5 ring-1 ring-[#e8e6f0] transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6366f1]/40 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.07)]">
      <Icon name={icon} className="h-[17px] w-[17px] shrink-0 text-[#a5b4fc]" />
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-[0.93rem] font-medium text-[#1a1d2e] placeholder:font-normal placeholder:text-[#a5b4c8] outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
      {rightSlot}
    </div>
  );
}

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
    <div className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #faf9ff 0%, #f0eefb 50%, #faf9ff 100%)" }}>
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -top-32 -right-32 h-[560px] w-[560px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 68%)" }} />
        <div className="animate-blob delay-300 absolute -bottom-24 -left-24 h-[440px] w-[440px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 68%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 62%)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        <BrandMark />
        <nav className="flex items-center gap-6 text-[0.88rem] font-semibold text-[#64748b]">
          <Link href="/signup" className="transition-colors duration-150 hover:text-[#4f46e5]">Create account</Link>
        </nav>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px] animate-fade-in-up">

          {/* Card */}
          <div className="rounded-[28px] bg-white/90 p-8 shadow-[0_20px_60px_rgba(99,102,241,0.10),0_4px_16px_rgba(99,102,241,0.06)] ring-1 ring-[#e8e6f0] backdrop-blur-sm sm:p-10">

            {/* Icon + header */}
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#6366f1] to-[#4f46e5] shadow-[0_10px_28px_rgba(99,102,241,0.32)]">
                <Icon name="brand" className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-[1.8rem] font-bold tracking-tight text-[#0f172a]">Welcome back</h1>
              <p className="mt-2 text-[0.88rem] text-[#64748b]">Sign in to your InterviewAI account</p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {/* Error */}
              {error ? (
                <div className="flex items-center gap-3 rounded-[14px] border border-red-200/80 bg-red-50 px-4 py-3" role="alert">
                  <div className="h-4 w-4 shrink-0 text-red-500 flex-none">
                    <svg viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.5Zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" /></svg>
                  </div>
                  <p className="text-[0.85rem] text-red-700">{error}</p>
                </div>
              ) : null}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[0.8rem] font-semibold text-[#374151]">Email address</label>
                <InputField
                  type="email"
                  placeholder="name@company.com"
                  name="email"
                  autoComplete="email"
                  required
                  disabled={submitting}
                  value={form.email}
                  onChange={handleChange("email")}
                  icon="mail"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[0.8rem] font-semibold text-[#374151]">Password</label>
                  <Link href="#reset" className="text-[0.78rem] font-semibold text-[#6366f1] transition-opacity hover:opacity-70">
                    Forgot password?
                  </Link>
                </div>
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  autoComplete="current-password"
                  required
                  disabled={submitting}
                  value={form.password}
                  onChange={handleChange("password")}
                  icon="lock"
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 text-[#a5b4c8] transition-colors hover:text-[#6366f1]"
                      tabIndex={-1}
                    >
                      <Icon name="eye" className="h-[17px] w-[17px]" />
                    </button>
                  }
                />
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={submitting}
                className="btn-shine mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] px-5 py-3.5 text-[0.93rem] font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.26)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(79,70,229,0.35)] disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </>
                ) : "Sign in"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e8e6f0]" />
                <span className="text-[0.78rem] font-medium text-[#a5b4c8]">or</span>
                <div className="h-px flex-1 bg-[#e8e6f0]" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-full border border-[#e8e6f0] bg-white px-5 py-3.5 text-[0.9rem] font-semibold text-[#374151] shadow-[0_1px_4px_rgba(99,102,241,0.06)] transition-all duration-200 hover:bg-[#faf9ff] hover:border-[#c4b5fd]/60 hover:shadow-[0_2px_8px_rgba(99,102,241,0.08)]"
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
              <p className="text-center text-[0.85rem] text-[#64748b]">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-bold text-[#6366f1] transition-opacity hover:opacity-70">
                  Create one free
                </Link>
              </p>
            </form>
          </div>

          {/* Trust row */}
          <div className="mt-6 flex items-center justify-center gap-5 text-[0.74rem] text-[#94a3b8]">
            {[
              { icon: "check", label: "256-bit encryption" },
              { icon: "check", label: "GDPR compliant" },
              { icon: "check", label: "SOC 2 certified" },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon name={icon} className="h-3.5 w-3.5 text-emerald-500" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <div className="mx-auto flex max-w-sm items-center justify-center gap-5 text-[0.78rem] text-[#94a3b8]">
          <Link href="#privacy" className="transition-colors hover:text-[#6366f1]">Privacy</Link>
          <span className="h-3 w-px bg-[#e8e6f0]" />
          <Link href="#terms" className="transition-colors hover:text-[#6366f1]">Terms</Link>
          <span className="h-3 w-px bg-[#e8e6f0]" />
          <Link href="#security" className="transition-colors hover:text-[#6366f1]">Security</Link>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center" style={{ background: "linear-gradient(160deg, #faf9ff 0%, #f0eefb 50%, #faf9ff 100%)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-[14px] bg-gradient-to-br from-[#6366f1] to-[#4f46e5] animate-pulse" />
          <p className="text-[0.8rem] font-semibold text-[#94a3b8] tracking-widest uppercase">Loading…</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
