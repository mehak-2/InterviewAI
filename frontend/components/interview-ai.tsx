"use client";

import Link from "next/link";
import type { ChangeEventHandler, CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ───────────────────────────── Icon ───────────────────────────── */
type IconProps = { name: string; className?: string; style?: CSSProperties };

export function Icon({ name, className, style }: IconProps) {
  switch (name) {
    case "brand":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10v4" />
          <path d="M12 8v8" />
          <path d="M16 11v2" />
        </svg>
      );
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <rect x="3" y="4" width="7" height="7" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="4" width="7" height="4" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
          <rect x="14" y="11" width="7" height="9" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
          <rect x="3" y="14" width="7" height="6" rx="1.8" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "interviews":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M4 5.5h16v10H9l-5 4v-4H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "history":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M4.5 8A8.5 8.5 0 1 1 7 17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M4 4.5V9h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5.5 19c1.6-3.3 4.1-5 6.5-5s4.9 1.7 6.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M10.3 4.6h3.4l.6 2.1c.4.2.8.4 1.2.7l2.1-.6 1.7 3-1.6 1.5c0 .5.1 1 .1 1.5s0 1-.1 1.5l1.6 1.5-1.7 3-2.1-.6c-.4.3-.8.5-1.2.7l-.6 2.1h-3.4l-.6-2.1a5.9 5.9 0 0 1-1.2-.7l-2.1.6-1.7-3 1.6-1.5c0-.5-.1-1-.1-1.5s0-1 .1-1.5L4.7 10l1.7-3 2.1.6c.4-.3.8-.5 1.2-.7l.6-2.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "help":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9.8 9.2a2.6 2.6 0 1 1 4.3 2c-.8.6-1.6 1.1-1.6 2.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1.1" fill="currentColor" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="5.8" stroke="currentColor" strokeWidth="1.8" />
          <path d="M15.2 15.2 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M12 4.5A4.5 4.5 0 0 0 7.5 9v2.3c0 .8-.3 1.6-.9 2.1L5.5 14h13l-1.1-.6c-.6-.5-.9-1.3-.9-2.1V9A4.5 4.5 0 0 0 12 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9.7 16.8a2.7 2.7 0 0 0 4.6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="18.3" cy="5.7" r="2.1" fill="#ef4444" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="m6.5 9.5 5.5 5.5 5.5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "chevron-left":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="m14.5 6.5-5.5 5.5 5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "chevron-right":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="m9.5 6.5 5.5 5.5-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m13 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M19 12H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m11 6-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "logout":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M13.5 5.5h-4A2.5 2.5 0 0 0 7 8v8a2.5 2.5 0 0 0 2.5 2.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m17 9 3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="m10 8.5 6 3.5-6 3.5z" fill="currentColor" />
        </svg>
      );
    case "stop":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
        </svg>
      );
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M12 3.5c.4 2.1 1.8 3.5 3.9 3.9-2.1.4-3.5 1.8-3.9 3.9-.4-2.1-1.8-3.5-3.9-3.9 2.1-.4 3.5-1.8 3.9-3.9Z" fill="currentColor" />
          <path d="M18.5 13.3c.3 1.4 1.2 2.3 2.7 2.7-1.5.4-2.4 1.3-2.7 2.7-.3-1.4-1.2-2.3-2.7-2.7 1.5-.4 2.4-1.3 2.7-2.7Z" fill="currentColor" opacity="0.8" />
          <path d="M5.2 13.6c.2 1.1.9 1.8 2 2-1.1.2-1.8.9-2 2-.2-1.1-.9-1.8-2-2 1.1-.2 1.8-.9 2-2Z" fill="currentColor" opacity="0.72" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="m12 3.8 2.4 4.9 5.5.8-4 3.9.9 5.5-4.8-2.5-4.8 2.5.9-5.5-4-3.9 5.5-.8L12 3.8Z" fill="currentColor" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8.5 12.3 2.4 2.4 4.6-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="m8.5 8.5 7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "download":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M12 4v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m8.5 10.5 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 17.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "share":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7.8 11.2 16 7.2M7.8 12.8 16 16.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "copy":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <rect x="8" y="8" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" opacity="0.55" />
        </svg>
      );
    case "filter":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <rect x="4" y="5.5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 3.5v4M17 3.5v4M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <rect x="5.5" y="10.5" width="13" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.5 10.5V8.4a3.5 3.5 0 0 1 7 0v2.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M2.8 12s3.1-5.5 9.2-5.5S21.2 12 21.2 12s-3.1 5.5-9.2 5.5S2.8 12 2.8 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.9" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6 19.2c1.5-2.7 3.8-4.2 6-4.2s4.5 1.5 6 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "upload":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M12 15V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m8.5 9.5 3.5-3.5 3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 17.5h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "file":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M7 3.5h6.5L18.5 8v12.5H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M13.5 3.5V8H18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "briefcase":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M5.5 8.5h13v10h-13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 8.5V7a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 7v1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "medal":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="11" r="5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m9.6 14.4-.9 4.1 3.3-1.8 3.3 1.8-.9-4.1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M5 18.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="6" y="11.5" width="2.6" height="7" rx="1.1" fill="currentColor" />
          <rect x="10.7" y="8.5" width="2.6" height="10" rx="1.1" fill="currentColor" opacity="0.8" />
          <rect x="15.4" y="5.5" width="2.6" height="13" rx="1.1" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "trend-up":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M5 15.5 10.2 10l3.1 3L19 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m16.8 7.5h2.2v2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <path d="M9.5 18h5M10.5 20h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 4.5a6 6 0 0 1 3.7 10.7c-.7.6-1.2 1.3-1.5 2.1h-4.4c-.3-.8-.8-1.5-1.5-2.1A6 6 0 0 1 12 4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "microphone":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <rect x="8.3" y="4.8" width="7.4" height="9.8" rx="3.7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6.5 12.2a5.5 5.5 0 0 0 11 0M12 17v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "question":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9.8 9.2a2.6 2.6 0 0 1 4.4 1.8c0 1.7-2.1 1.9-2.1 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1.1" fill="currentColor" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 3.5v2M12 18.5v2M4.7 4.7l1.4 1.4M17.9 17.9l1.4 1.4M3.5 12h2M18.5 12h2M4.7 19.3l1.4-1.4M17.9 6.1l1.4-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "record":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
        </svg>
      );
    case "dots":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden="true">
          <circle cx="6" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="18" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─────────────────────────────────── BrandMark ─────────────────────────────────── */
export function BrandMark({
  compact = false,
  variant = "default",
}: {
  compact?: boolean;
  variant?: "default" | "sidebar";
}) {
  const isSidebar = variant === "sidebar";
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
    >
      <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#6366f1,#4338ca)] text-white shadow-[0_6px_18px_rgba(99,102,241,0.38)]">
        <Icon name="brand" className="h-5 w-5" />
      </span>
      <span
        style={{ color: isSidebar ? "#ffffff" : "var(--foreground)" }}
        className="text-[1.2rem] font-bold tracking-tight"
      >
        Interview<span style={{ color: isSidebar ? "#a5b4fc" : "#6366f1" }}>AI</span>
      </span>
    </Link>
  );
}

/* ─────────────────────────────────── Badge ─────────────────────────────────── */
export function Badge({
  children,
  tone = "violet",
  className,
}: {
  children: ReactNode;
  tone?: "violet" | "mint" | "slate" | "dark" | "amber" | "rose";
  className?: string;
}) {
  const tones: Record<string, string> = {
    violet: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    mint:   "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    slate:  "bg-slate-500/10 text-slate-300 border-slate-500/20",
    dark:   "bg-slate-950 text-white border-slate-800",
    amber:  "bg-amber-500/10 text-amber-300 border-amber-500/20",
    rose:   "bg-rose-500/10 text-rose-300 border-rose-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.15em]",
        tones[tone] ?? tones.violet,
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────── Card ─────────────────────────────────── */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-[#090d16]/80 border border-[var(--line)] shadow-[var(--shadow-sm)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────── ButtonLink ─────────────────────────────────── */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "dark" | "outline";
  className?: string;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 select-none";
  const styles: Record<string, string> = {
    primary:
      "btn-shimmer bg-gradient-to-r from-[#6366f1] to-[#4338ca] text-white shadow-[var(--shadow-brand-sm)] hover:shadow-[var(--shadow-brand)] hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--line)] shadow-[var(--shadow-xs)] hover:bg-[var(--surface-soft)] hover:shadow-[var(--shadow-sm)]",
    ghost:
      "bg-transparent text-[var(--muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-strong)]",
    dark:
      "bg-white/12 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm",
    outline:
      "bg-transparent text-[var(--brand)] border border-[var(--brand)] hover:bg-[var(--brand-soft)]",
  };
  return (
    <Link
      href={href}
      className={cn(base, styles[variant] ?? styles.primary, className)}
    >
      {children}
    </Link>
  );
}

/* ───────────────────────────── SectionHeading ───────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("space-y-4", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-[2rem] font-bold tracking-tight text-[var(--foreground)] md:text-[2.4rem]">
        {title}
      </h2>
      {description ? (
        <p className={cn("max-w-2xl text-[1rem] leading-7 text-[var(--muted)]", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* ───────────────────────────── Field ───────────────────────────── */
export function Field({
  label,
  placeholder,
  icon,
  rightIcon,
  className,
  type = "text",
  value,
  defaultValue,
  onChange,
  name,
  autoComplete,
  required,
  disabled,
  readOnly,
}: {
  label: string;
  placeholder: string;
  icon?: string;
  rightIcon?: string;
  className?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  const isControlled = typeof value !== "undefined" && typeof onChange !== "undefined";

  return (
    <label className={cn("block space-y-2", className)}>
      <span className="text-[0.85rem] font-semibold text-[var(--foreground)]">{label}</span>
      <span
        className={cn(
          "flex items-center gap-3 rounded-[14px] bg-[var(--surface-soft)] px-4 py-3.5",
          "ring-1 ring-[var(--line)] transition-all duration-200",
          "focus-within:bg-[var(--surface)] focus-within:ring-2 focus-within:ring-[var(--brand)]/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]",
        )}
      >
        {icon ? <Icon name={icon} className="h-[18px] w-[18px] shrink-0 text-[var(--muted-soft)]" /> : null}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          value={isControlled ? value : undefined}
          defaultValue={!isControlled ? defaultValue ?? value : undefined}
          onChange={onChange}
          className={cn(
            "w-full bg-transparent text-[0.95rem] font-medium text-[var(--foreground)] placeholder:text-[var(--muted-soft)] placeholder:font-normal outline-none",
            disabled && "cursor-not-allowed opacity-60",
          )}
        />
        {rightIcon ? <Icon name={rightIcon} className="h-[18px] w-[18px] shrink-0 text-[var(--muted-soft)]" /> : null}
      </span>
    </label>
  );
}

/* ───────────────────────────── ProgressBar ───────────────────────────── */
export function ProgressBar({
  value,
  color = "var(--brand)",
  className,
  barClassName,
}: {
  value: number;
  color?: string;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("h-2 rounded-full bg-[var(--line)]", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", barClassName)}
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

/* ───────────────────────────── CircularScore ───────────────────────────── */
export function CircularScore({
  value,
  size = 220,
  label = "OVERALL SCORE",
  accent = "#4f46e5",
}: {
  value: number;
  size?: number;
  label?: string;
  accent?: string;
}) {
  return (
    <div
      className="relative grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${accent} ${value * 3.6}deg, var(--line) ${value * 3.6}deg 360deg)`,
      }}
    >
      <div className="grid h-[calc(100%-16px)] w-[calc(100%-16px)] place-items-center rounded-full bg-[var(--surface)] shadow-inner">
        <div className="text-center">
          <div className="text-[3rem] font-bold leading-none" style={{ color: accent }}>{value}</div>
          <div className="mt-1 text-[0.75rem] font-semibold tracking-[0.24em] text-[var(--muted)]">{label}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────── StatCard ─────────────────────────────────── */
export function StatCard({
  label,
  value,
  accent,
  icon,
  note,
  className,
}: {
  label: string;
  value: string;
  accent?: string;
  icon: string;
  note?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-5 card-lift cursor-default bg-[#090d16]/90 border border-slate-800/80 shadow-[0_4px_24px_rgba(99,102,241,0.04)]", className)}>
      <div className="flex items-start justify-between gap-3">
        <div
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10"
        >
          <Icon name={icon} className="h-5 w-5 text-indigo-400" />
        </div>
        {note ? (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[0.62rem] font-bold text-emerald-400 uppercase tracking-wider">
            {note}
          </span>
        ) : null}
      </div>
      <div className="mt-4">
        <p className="text-[0.72rem] font-bold text-slate-500 uppercase tracking-[0.16em]">{label}</p>
        <p className="mt-1.5 text-[2.1rem] font-extrabold leading-none tracking-tight text-white">{value}</p>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────── Avatar ─────────────────────────────────── */
export function Avatar({
  name,
  size = 44,
  tone = "violet",
  className,
}: {
  name: string;
  size?: number;
  tone?: "violet" | "mint" | "rose" | "indigo" | "slate";
  className?: string;
}) {
  const colors: Record<string, string> = {
    violet: "bg-indigo-950 text-indigo-300 border-indigo-500/20",
    mint:   "bg-emerald-950 text-emerald-300 border-emerald-500/20",
    rose:   "bg-rose-950 text-rose-300 border-rose-500/20",
    indigo: "bg-indigo-950 text-indigo-300 border-indigo-500/20",
    slate:  "bg-slate-900 text-slate-300 border-slate-800",
  };
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold border ring-2 ring-slate-950",
        colors[tone] ?? colors.violet,
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
    </div>
  );
}

/* ─────────────────────────────────── SidebarShell ─────────────────────────────────── */
export function SidebarShell({
  active,
  children,
  topSlot,
  bottomSlot,
}: {
  active: "dashboard" | "interviews" | "history" | "profile" | "support" | "settings";
  children: ReactNode;
  topSlot?: ReactNode;
  bottomSlot?: ReactNode;
}) {
  const navItems = [
    { key: "dashboard",  label: "Dashboard",  href: "/dashboard",  icon: "dashboard"  },
    { key: "interviews", label: "Interviews", href: "/interviews", icon: "interviews" },
    { key: "history",    label: "History",    href: "/history",    icon: "history"    },
    { key: "profile",    label: "Profile",    href: "/profile",    icon: "profile"    },
  ] as const;

  const secondaryItems = [
    { key: "settings", label: "Settings",     href: "/settings", icon: "settings" },
    { key: "support",  label: "Help & Support", href: "/support",  icon: "help"     },
  ] as const;  return (
    <div className="flex min-h-screen bg-[#04060e]">
      {/* ── Dark Sidebar ── */}
      <aside
        className="hidden w-[260px] shrink-0 flex-col lg:flex sticky top-0 h-screen overflow-y-auto border-r border-slate-800 bg-slate-900"
      >
        <div className="flex h-full flex-col px-4 py-6">
          {/* Logo */}
          <div className="mb-6 px-2">
            <BrandMark variant="sidebar" />
          </div>

          {topSlot ? <div className="mb-4">{topSlot}</div> : null}

          {/* Primary nav */}
          <nav className="flex-1 space-y-0.5">
            <p className="mb-2 px-3 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500">
              Main
            </p>
            {navItems.map((item) => {
              const isActive = item.key === active;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.875rem] font-semibold transition-all duration-150",
                    isActive
                      ? "bg-indigo-600/20 border-l-2 border-indigo-500"
                      : "hover:bg-slate-800",
                  )}
                  style={{ color: isActive ? "#a5b4fc" : "#cbd5e1" }}
                >
                  <Icon
                    name={item.icon}
                    style={{ color: isActive ? "#a5b4fc" : "#64748b" }}
                    className="h-4.5 w-4.5 shrink-0 transition-colors group-hover:text-white"
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="my-4 h-px bg-slate-800" />

          {/* Secondary nav */}
          <div className="space-y-0.5">
            <p className="mb-2 px-3 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500">
              General
            </p>
            {secondaryItems.map((item) => {
              const isActive = item.key === active;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.875rem] font-semibold transition-all duration-150",
                    isActive
                      ? "bg-indigo-600/20 border-l-2 border-indigo-500"
                      : "hover:bg-slate-800",
                  )}
                  style={{ color: isActive ? "#a5b4fc" : "#cbd5e1" }}
                >
                  <Icon
                    name={item.icon}
                    style={{ color: isActive ? "#a5b4fc" : "#64748b" }}
                    className="h-4.5 w-4.5 shrink-0 group-hover:text-white"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Bottom slot */}
          {bottomSlot ? (
            <div className="mt-auto pt-4">{bottomSlot}</div>
          ) : (
            <div className="mt-auto" />
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

/* ───────────────────────────── FooterLinks ───────────────────────────── */
export function FooterLinks({
  left,
  right,
  className,
}: {
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-[var(--line)] px-6 py-5 text-[0.82rem] text-[var(--muted-soft)] md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div>{left}</div>
      <div className="flex flex-wrap items-center gap-6">{right}</div>
    </div>
  );
}
