"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Icon } from "./interview-ai";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-2xl bg-white border border-slate-100 p-4 shadow-lg animate-slide-in-right pointer-events-auto"
            style={{ animation: "fade-in 0.3s ease-out forwards" }}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              t.type === "success" 
                ? "bg-emerald-50 text-emerald-600" 
                : t.type === "error" 
                ? "bg-rose-50 text-rose-600" 
                : t.type === "warning"
                ? "bg-amber-50 text-amber-600"
                : "bg-blue-50 text-blue-600"
            }`}>
              <Icon name={t.type === "success" ? "check" : t.type === "error" ? "x" : t.type === "warning" ? "sparkles" : "bell"} className="h-4.5 w-4.5" />
            </div>
            <p className="text-[0.88rem] font-medium text-slate-800">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
