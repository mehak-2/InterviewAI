"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/interview-ai";

export function OfflineDetector() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOffline(!window.navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 animate-fade-in-up">
      <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 dark:bg-amber-950/40 px-5 py-3 text-amber-700 dark:text-amber-300 shadow-[0_8px_32px_rgba(217,119,6,0.15)] backdrop-blur-md ring-1 ring-white/10">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
          <Icon name="x" className="h-3.5 w-3.5" />
        </div>
        <div className="text-[0.88rem] font-semibold tracking-wide">
          You are offline. Please check your connection.
        </div>
      </div>
    </div>
  );
}
