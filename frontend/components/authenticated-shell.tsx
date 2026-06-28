"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth-provider";
import { Icon, SidebarShell } from "@/components/interview-ai";
import { cn } from "@/lib/cn";

type AuthenticatedShellProps = {
  active: "dashboard" | "interviews" | "history" | "profile" | "support" | "settings";
  children: ReactNode;
  topSlot?: ReactNode;
  bottomSlot?: ReactNode;
};

export function AuthenticatedShell({
  active,
  children,
  topSlot,
  bottomSlot,
}: AuthenticatedShellProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const displayName =
    `${user?.firstName || "Alex"} ${user?.lastName || "Rivera"}`.trim();
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    setSigningOut(true);
    setLogoutError(null);
    try {
      await logout();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to log out right now",
      );
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <SidebarShell
      active={active}
      topSlot={topSlot}
      bottomSlot={
        <div className="space-y-1">
          {bottomSlot}

          {/* User card */}
          <div
            className="mb-2 rounded-xl p-3"
            style={{ background: "var(--sb-surface)", border: "1px solid var(--sb-border)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#4338ca] text-[0.65rem] font-bold text-white shadow-[0_4px_10px_rgba(99,102,241,0.40)]">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8rem] font-semibold" style={{ color: "var(--sb-text)" }}>
                  {displayName}
                </p>
                <span
                  className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(99,102,241,0.18)", color: "var(--sb-active-text)" }}
                >
                  Pro
                </span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.82rem] font-semibold transition-all duration-150",
              signingOut ? "cursor-not-allowed opacity-50" : "",
            )}
            style={{ color: "var(--sb-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)";
              (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--sb-muted)";
            }}
          >
            <Icon name="logout" className="h-4 w-4 shrink-0" />
            <span>{signingOut ? "Signing out…" : "Log out"}</span>
          </button>

          {logoutError ? (
            <p className="px-1 text-[0.72rem] text-red-400">{logoutError}</p>
          ) : null}
        </div>
      }
    >
      {children}
    </SidebarShell>
  );
}
