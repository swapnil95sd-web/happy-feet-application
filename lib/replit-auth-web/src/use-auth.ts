import { useState, useEffect, useCallback } from "react";
import type { AuthUser } from "@workspace/api-client-react";

export type { AuthUser };

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiBase = ((import.meta.env.VITE_API_URL as string) ?? "").replace(/\/+$/, "");

  useEffect(() => {
    let cancelled = false;

    fetch(`${apiBase}/api/auth/user`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<{ user: AuthUser | null }>;
      })
      .then((data) => {
        if (!cancelled) {
          setUser(data.user ?? null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const login = useCallback(() => {
    const returnTo = apiBase
      ? window.location.origin
      : (import.meta.env.BASE_URL.replace(/\/+$/, "") || "/");
    window.location.href = `${apiBase}/api/login?returnTo=${encodeURIComponent(returnTo)}`;
  }, [apiBase]);

  const logout = useCallback(() => {
    window.location.href = `${apiBase}/api/logout`;
  }, [apiBase]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
