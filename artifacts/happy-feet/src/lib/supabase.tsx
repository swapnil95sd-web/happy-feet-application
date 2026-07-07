import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type StudioRole = "admin" | "instructor" | "student";

export type StudioProfile = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: StudioRole;
};

type AuthContextValue = {
  supabase: SupabaseClient | null;
  isSupabaseConfigured: boolean;
  session: Session | null;
  user: User | null;
  profile: StudioProfile | null;
  role: StudioRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const bootstrapAdminEmail = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
const studioSlug = (import.meta.env.VITE_STUDIO_SLUG as string | undefined) || "happy-feet";

function isValidHttpUrl(value: string | undefined) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(isValidHttpUrl(supabaseUrl) && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeRole(value: unknown): StudioRole {
  return value === "admin" || value === "instructor" || value === "student" ? value : "student";
}

function normalizeStudioMemberRole(value: unknown): StudioRole | null {
  if (value === "owner" || value === "admin") return "admin";
  if (value === "instructor") return "instructor";
  if (value === "student") return "student";
  return null;
}

function fullNameFromUser(user: User | null) {
  const metadata = user?.user_metadata ?? {};
  return (
    metadata.full_name ??
    metadata.name ??
    [metadata.first_name, metadata.last_name].filter(Boolean).join(" ") ??
    null
  );
}

async function loadProfile(client: SupabaseClient, user: User): Promise<StudioProfile> {
  const { data } = await client
    .from("profiles")
    .select("id,email,full_name,first_name,last_name,role")
    .eq("id", user.id)
    .maybeSingle();

  const email = (data?.email as string | null | undefined) ?? user.email ?? null;
  const profileRole = normalizeRole(data?.role);
  let studioMemberRole: StudioRole | null = null;
  if (email) {
    try {
      const { data: studio } = await client
        .from("studios")
        .select("id")
        .eq("slug", studioSlug)
        .maybeSingle();
      const studioId = (studio?.id as string | null | undefined) ?? null;
      if (studioId) {
        const { data: member } = await client
          .from("studio_members")
          .select("role,status")
          .eq("studio_id", studioId)
          .eq("email", email)
          .eq("status", "active")
          .maybeSingle();
        studioMemberRole = normalizeStudioMemberRole(member?.role);
      }
    } catch {
      studioMemberRole = null;
    }
  }
  const fallbackRole =
    studioMemberRole ??
    (!data?.role && bootstrapAdminEmail && email?.toLowerCase() === bootstrapAdminEmail.toLowerCase()
      ? "admin"
      : profileRole);

  return {
    id: user.id,
    email,
    fullName:
      (data?.full_name as string | null | undefined) ??
      [data?.first_name, data?.last_name].filter(Boolean).join(" ") ??
      fullNameFromUser(user),
    role: fallbackRole,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StudioProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);
    if (!supabase || !nextSession?.user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setProfile(await loadProfile(supabase, nextSession.user));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => refreshProfile(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void refreshProfile(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [refreshProfile]);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      supabase,
      isSupabaseConfigured,
      session,
      user: session?.user ?? null,
      profile,
      role: profile?.role ?? null,
      isLoading,
      isAuthenticated: Boolean(session?.user),
      signInWithEmail,
      logout,
    }),
    [isLoading, logout, profile, session, signInWithEmail],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
