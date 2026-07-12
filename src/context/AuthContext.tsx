import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AppUser, OnboardingProfile } from "../types";
import * as api from "../lib/api";
import { clearToken, getToken, mergeUser, setToken } from "../lib/storage";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  authError: string | null;
  signup: (input: {
    firstName: string;
    email: string;
    password: string;
    fitnessLevel: string;
    goal: string;
    profile?: OnboardingProfile;
  }) => Promise<AppUser>;
  login: (input: { email: string; password: string }) => Promise<AppUser>;
  refreshUser: () => void;
  setUser: (u: AppUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me(token)
      .then(({ user }) => setUserState(mergeUser(user)))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const signup: AuthContextValue["signup"] = async (input) => {
    setAuthError(null);
    try {
      const { token, user } = await api.signup(input);
      setToken(token);
      const merged = mergeUser(user);
      setUserState(merged);
      return merged;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed.";
      setAuthError(message);
      throw err;
    }
  };

  const login: AuthContextValue["login"] = async (input) => {
    setAuthError(null);
    try {
      const { token, user } = await api.login(input);
      setToken(token);
      const merged = mergeUser(user);
      setUserState(merged);
      return merged;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setAuthError(message);
      throw err;
    }
  };

  const refreshUser = () => {
    const token = getToken();
    if (!token) return;
    api
      .me(token)
      .then(({ user }) => setUserState(mergeUser(user)))
      .catch(() => {});
  };

  const setUser = (u: AppUser | null) => setUserState(u);

  const logout = () => {
    clearToken();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, signup, login, refreshUser, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
