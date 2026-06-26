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
        <div className="space-y-3">
          {bottomSlot}

          {/* User card */}
          <div className="rounded-[16px] bg-[var(--surface-soft)] p-3 ring-1 ring-[var(--line)]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand-soft),var(--brand-mid))] text-[0.72rem] font-bold text-[var(--brand)]">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.85rem] font-semibold text-[var(--foreground)]">{displayName}</p>
                <p className="text-[0.75rem] text-[var(--muted-soft)]">Pro Plan</p>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className={cn(
              "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-[0.88rem] font-medium text-[var(--muted)] transition-all duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400",
              signingOut && "cursor-not-allowed opacity-60",
            )}
          >
            <Icon name="logout" className="h-5 w-5 shrink-0" />
            <span>{signingOut ? "Signing out…" : "Log out"}</span>
          </button>

          {logoutError ? (
            <p className="px-1 text-[0.78rem] text-red-500">{logoutError}</p>
          ) : null}
        </div>
      }
    >
      {children}
    </SidebarShell>
  );
}
