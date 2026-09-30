export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

export type ApiError = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

export async function apiGet<T>(path: string, init?: RequestInit): Promise<ApiSuccess<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiError;

  if (!response.ok || !payload.success) {
    const message = "message" in payload ? payload.message : "Request failed";
    throw new Error(message);
  }

  return payload;
}
