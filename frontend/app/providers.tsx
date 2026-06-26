"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { AuthProvider } from "@/components/auth-provider";
import { ToastProvider } from "@/components/toast";
import { OfflineDetector } from "@/components/offline-detector";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ToastProvider>
          {children}
          <OfflineDetector />
        </ToastProvider>
      </AuthProvider>
    </Provider>
  );
}
