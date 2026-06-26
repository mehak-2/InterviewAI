import axios from "axios";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

type ApiErrorBody = {
  message?: string;
  errors?: Array<{
    field?: string;
    message?: string;
  }>;
};

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined;

    if (body?.errors?.length) {
      return body.errors
        .map((item) => (item.field ? `${item.field}: ${item.message}` : item.message))
        .filter(Boolean)
        .join(" • ");
    }

    if (body?.message) {
      return body.message;
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}
