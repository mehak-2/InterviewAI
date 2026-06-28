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
        <div className="space-y-2">
          {bottomSlot}

          {/* User card */}
          <div className="rounded-[14px] bg-gradient-to-br from-[var(--brand-xsoft)] to-[var(--brand-soft)] p-3 ring-1 ring-[var(--brand-soft)]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-[0.72rem] font-bold text-white shadow-[0_4px_10px_rgba(99,102,241,0.35)]">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.82rem] font-bold text-[var(--foreground)]">{displayName}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-soft)] px-1.5 py-0.5 text-[0.6rem] font-bold text-[var(--brand)] uppercase tracking-wider">
                  Pro
                </span>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[0.82rem] font-semibold text-[var(--muted)] transition-all duration-150 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400",
              signingOut && "cursor-not-allowed opacity-60",
            )}
          >
            <Icon name="logout" className="h-4 w-4 shrink-0" />
            <span>{signingOut ? "Signing out…" : "Log out"}</span>
          </button>

          {logoutError ? (
            <p className="px-1 text-[0.75rem] text-red-500">{logoutError}</p>
          ) : null}
        </div>
      }
    >
      {children}
    </SidebarShell>
  );
}
