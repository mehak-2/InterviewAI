"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} from "@/lib/authApi";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  initializing: boolean;
  refreshSession: () => Promise<AuthUser | null>;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeUser = (user: {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string | null;
  role?: string;
}) => ({
  id: String(user.id ?? user._id ?? ""),
  firstName: user.firstName ?? "",
  lastName: user.lastName ?? "",
  email: user.email ?? "",
  avatar: user.avatar ?? null,
  role: user.role ?? "candidate",
});

function getRtkQueryErrorMessage(error: any, fallback = "Something went wrong") {
  if (error && typeof error === "object") {
    if ("data" in error && error.data && typeof error.data === "object") {
      const data = error.data as any;
      if (data.message) return data.message;
      if (Array.isArray(data.errors) && data.errors.length) {
        return data.errors
          .map((item: any) => (item.field ? `${item.field}: ${item.message}` : item.message))
          .filter(Boolean)
          .join(" • ");
      }
    }
    if ("message" in error) {
      return error.message || fallback;
    }
  }
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  const { data, isLoading, refetch } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    if (!isLoading) {
      if (data?.success && data.user) {
        setUser(normalizeUser(data.user));
      } else {
        setUser(null);
      }
      setInitializing(false);
    }
  }, [data, isLoading]);

  const refreshSession = useCallback(async () => {
    try {
      const res = await refetch().unwrap();
      if (res?.success && res.user) {
        const nextUser = normalizeUser(res.user);
        setUser(nextUser);
        return nextUser;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setInitializing(false);
    }
  }, [refetch]);

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      const res = await loginMutation(payload).unwrap();
      const nextUser = normalizeUser(res.user);
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      throw new Error(getRtkQueryErrorMessage(error, "Unable to sign in"));
    }
  }, [loginMutation]);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const res = await registerMutation(payload).unwrap();
      const nextUser = normalizeUser(res.user);
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      throw new Error(getRtkQueryErrorMessage(error, "Unable to create your account"));
    }
  }, [registerMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
      setUser(null);
    } catch (error) {
      throw new Error(getRtkQueryErrorMessage(error, "Unable to log out right now"));
    }
  }, [logoutMutation]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initializing,
      refreshSession,
      login,
      register,
      logout,
    }),
    [user, initializing, refreshSession, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
