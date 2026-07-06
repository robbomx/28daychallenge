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
