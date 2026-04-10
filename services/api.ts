const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://online-saathi-backend.onrender.com/api/";
const BASE_URL = rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}

async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
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
