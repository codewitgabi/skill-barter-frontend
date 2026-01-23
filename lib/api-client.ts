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

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0,
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

  if (response.status === 401 && retryCount === 0) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return apiRequest<T>(endpoint, options, 1);
    }
  }

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
