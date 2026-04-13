import { api } from "./api";

// Helper to set cookies on the client side
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

// Helper to remove cookies
function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export interface User {
  id: string;
  mobile: string;
  email: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  identity: string;
  approvalStatus: string;
  createdAt: string;
  roles: string[];
}

export interface MeResponse {
  success: boolean;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  identity: string;
  roles: string[];
  redirectTo: string;
}

export const authService = {
  async getMe(): Promise<MeResponse> {
    return api.get("/auth/me");
  },

  async login(mobile: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", { mobile, password });

    if (response.success) {
      setCookie("token", response.accessToken);
      setCookie("role", response.identity);
    }

    return response;
  },

  async sendOtp(mobile: string): Promise<{ success: boolean; message?: string }> {
    return api.post("/auth/send-otp", { mobile });
  },

  async verifyOtp(mobile: string, otp: string): Promise<{ success: boolean; message?: string }> {
    return api.post("/auth/verify-otp", { mobile, otp });
  },

  async register(data: {
    mobile: string;
    fullName: string;
    gender: string;
    dateOfBirth: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);

    if (response.success) {
      setCookie("token", response.accessToken);
      setCookie("role", response.identity);
    }

    return response;
  },

  logout() {
    removeCookie("token");
    removeCookie("role");
    localStorage.removeItem('job_profile_draft');
    window.location.href = "/login";
  }
};
