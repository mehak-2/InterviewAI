import { apiSlice } from "./apiSlice";

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

type AuthResponse = {
  success: boolean;
  user: {
    id?: string;
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string | null;
    role?: string;
  };
};

// Helper: build an absolute URL to the Next.js proxy routes (same origin as the app)
const proxyUrl = (path: string) =>
  typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<AuthResponse, void>({
      // Hits the real backend — cookie is forwarded by the browser
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    login: builder.mutation<AuthResponse, LoginPayload>({
      // Proxy through Next.js so the cookie is set on the frontend domain
      queryFn: async (credentials) => {
        try {
          const res = await fetch(proxyUrl("/api/auth/login"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) return { error: { status: res.status, data } };
          return { data };
        } catch (e: any) {
          return { error: { status: "FETCH_ERROR", error: String(e) } };
        }
      },
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<AuthResponse, RegisterPayload>({
      // Proxy through Next.js so the cookie is set on the frontend domain
      queryFn: async (payload) => {
        try {
          const res = await fetch(proxyUrl("/api/auth/register"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) return { error: { status: res.status, data } };
          return { data };
        } catch (e: any) {
          return { error: { status: "FETCH_ERROR", error: String(e) } };
        }
      },
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      // Proxy through Next.js to clear the frontend-domain cookie
      queryFn: async () => {
        try {
          const res = await fetch(proxyUrl("/api/auth/logout"), {
            method: "POST",
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) return { error: { status: res.status, data } };
          return { data };
        } catch (e: any) {
          return { error: { status: "FETCH_ERROR", error: String(e) } };
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
