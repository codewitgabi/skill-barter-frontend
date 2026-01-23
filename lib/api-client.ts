import type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
} from "@/types/api-response";

const API_BASE_URL = "/api/v1";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok) {
    return data as ErrorResponse;
  }

  return data as SuccessResponse<T>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(
  endpoint: string,
  body: unknown,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiGet<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "GET",
  });
}

export async function apiPatch<T>(
  endpoint: string,
  body: unknown,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "DELETE",
  });
}
