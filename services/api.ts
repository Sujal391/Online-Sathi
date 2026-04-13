import { API_URL } from "@/lib/config";
import { getAuthToken } from "@/lib/auth";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}

async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const baseUrl = API_URL || "";
  const url = `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const token = getAuthToken();
  const authHeaders: Record<string, string> = {};
  
  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiFetch<T>(endpoint, { method: "GET", headers }),

  post: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
    apiFetch<T>(endpoint, { method: "POST", body, headers }),

  put: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
    apiFetch<T>(endpoint, { method: "PUT", body, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    apiFetch<T>(endpoint, { method: "DELETE", headers }),

  patch: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
    apiFetch<T>(endpoint, { method: "PATCH", body, headers }),
};
