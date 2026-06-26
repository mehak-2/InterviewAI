import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") || "http://localhost:5000/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers) => {
      // Cookies are sent automatically with credentials: "include"
      return headers;
    },
    // Ensure cookies are sent with all requests (for HTTP-only JWT token)
    credentials: "include",
  }),
  tagTypes: ["User", "Interview", "Response", "Resume"],
  endpoints: () => ({}),
});
