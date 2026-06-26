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

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<AuthResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
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
