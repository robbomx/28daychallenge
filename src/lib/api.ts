const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

import type { FitnessLevel, Goal } from "../types";

export interface BackendUser {
  id: string;
  firstName: string;
  email: string;
  fitnessLevel: FitnessLevel;
  goal: Goal;
  paid: boolean;
  createdAt: string;
}

interface AuthResponse {
  token: string;
  user: BackendUser;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong talking to the server.");
  }
  return data as T;
}

export function signup(input: {
  firstName: string;
  email: string;
  password: string;
  fitnessLevel: string;
  goal: string;
}) {
  return request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: { email: string; password: string }) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function me(token: string) {
  return request<{ user: BackendUser }>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getCheckoutLink(token: string) {
  return request<{ url: string }>("/api/checkout-link", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function changePassword(token: string, currentPassword: string, newPassword: string) {
  return request<{ ok: true }>("/api/auth/change-password", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// Fire-and-forget progress summary sync, purely so the admin dashboard has
// real numbers to show. Never awaited by the UI and never blocks a person's
// own experience of the app if it fails.
export function syncProgress(
  token: string,
  summary: { currentDay: number; totalCompleted: number; streak: number; lastCompletedDay: number | null }
) {
  return request("/api/progress", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(summary),
  }).catch(() => {
    // Silently ignore — this is a nice-to-have for the admin view, not
    // something that should ever interrupt the person using the app.
  });
}

export interface AdminUserRow extends BackendUser {
  lastActiveAt?: string;
  progressSummary?: {
    currentDay: number | null;
    totalCompleted: number;
    streak: number;
    lastCompletedDay: number | null;
    updatedAt: string;
  } | null;
}

export function adminLogin(password: string) {
  return request<{ token: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function adminGetUsers(adminToken: string) {
  return request<{ users: AdminUserRow[] }>("/api/admin/users", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
}

export function adminResetPassword(adminToken: string, email: string, newPassword: string) {
  return request<{ ok: true }>("/api/admin/reset-password", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ email, newPassword }),
  });
}
