"use client";

import React from "react";
import { Card, Icon } from "@/components/interview-ai";

type ApiErrorCardProps = {
  message: string;
  onRetry?: () => void | Promise<void>;
  title?: string;
};

export function ApiErrorCard({
  message,
  onRetry,
  title = "Failed to load data",
}: ApiErrorCardProps) {
  const [retrying, setRetrying] = React.useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Card className="border border-red-200 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
          <Icon name="x" className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1.5">
          <h3 className="text-[1.05rem] font-bold text-red-900 dark:text-red-200">{title}</h3>
          <p className="text-[0.88rem] leading-6 text-red-700 dark:text-red-300">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="mt-2 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-400 px-4 py-2 text-[0.82rem] font-bold text-white transition-all shadow-sm shrink-0"
          >
            <Icon
              name="history"
              className={`h-4 w-4 text-white ${retrying ? "animate-spin" : ""}`}
            />
            {retrying ? "Retrying…" : "Retry"}
          </button>
        )}
      </div>
    </Card>
  );
}
