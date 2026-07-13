const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

import type { FitnessLevel, Goal, ProgressRecord } from "../types";

export interface BackendUser {
  id: string;
  firstName: string;
  email: string;
  fitnessLevel: FitnessLevel;
  goal: Goal;
  paid: boolean;
  createdAt: string;
  // Present once at least one sync has happened — the server-side source of
  // truth for cross-device progress. Absent (undefined) for brand new
  // accounts or accounts created before this synced, in which case the
  // browser's local copy is used instead until the next sync.
  progress?: ProgressRecord;
  startDate?: string;
  notifications?: {
    dailyReminder: boolean;
    weeklyMilestone: boolean;
    streakAlerts: boolean;
  };
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

export function updateProfile(token: string, updates: { fitnessLevel?: string; goal?: string }) {
  return request<{ user: BackendUser }>("/api/auth/profile", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates),
  });
}

// Pushes the full progress state (day-by-day record, start date,
// notification prefs) plus the summary numbers the admin dashboard shows.
// Fire-and-forget from the UI's perspective — never awaited, never blocks a
// person's own experience of the app if it fails.
export function syncProgress(
  token: string,
  payload: {
    progress: ProgressRecord;
    startDate: string;
    notifications: { dailyReminder: boolean; weeklyMilestone: boolean; streakAlerts: boolean };
    currentDay: number;
    totalCompleted: number;
    streak: number;
    lastCompletedDay: number | null;
  }
) {
  return request<{ ok: true; user: BackendUser }>("/api/progress", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Silently ignore — a failed sync shouldn't interrupt the person using
    // the app. Local storage still has their data; the next successful
    // action will retry the push.
    return undefined;
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
