import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface AppUser {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin" | "moderator";
  isVerified: boolean;
  joinedDate: string;
  lastActive: string;
  gender: string | null;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  handleAuth: (userData: AppUser) => void;
  handleLogout: () => Promise<void>;
  handleRestrictedAction: (action: string) => boolean;
  handleDemoLogin: (accountType: "user" | "admin") => Promise<void>;
  validateDemoCredentials: (email: string, password: string) => Promise<AppUser | null>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<AppUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();
  const ensuredUsersRef = useRef<Set<string>>(new Set());

  const ensureCurrentUserSetup = useCallback((authUser: User) => {
    // Fire-and-forget — never block the UI on this. Trigger handle_new_user already
    // creates the profile on signup; this is just a safety net for legacy users.
    if (ensuredUsersRef.current.has(authUser.id)) return;
    ensuredUsersRef.current.add(authUser.id);
    const safeUsername = authUser.user_metadata?.username?.trim() || authUser.email?.split("@")[0] || "anonymous";
    supabase.from("profiles").upsert({
      id: authUser.id,
      email: authUser.email ?? null,
      username: safeUsername,
      is_verified: false,
      joined_date: new Date().toISOString(),
      last_active: new Date().toISOString(),
    }, { onConflict: "id", ignoreDuplicates: true }).then(({ error }) => {
      if (error) console.warn("ensureCurrentUserSetup failed", error);
    });
  }, []);

  const fetchUserProfile = useCallback(async (authUser: User, options?: { skipEnsure?: boolean }): Promise<AppUser | null> => {
    try {
      if (!options?.skipEnsure) {
        ensureCurrentUserSetup(authUser);
      }

      const [profileRes, roleRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("username, is_verified, joined_date, gender")
          .eq("id", authUser.id)
          .maybeSingle(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", authUser.id),
      ]);

      const profile = profileRes.data;
      const roleData = roleRes.data;
      const isAdmin = roleData?.some((r: { role: string }) => r.role === "admin") ?? false;
      const isModerator = roleData?.some((r: { role: string }) => r.role === "moderator") ?? false;
      const role = isAdmin ? "admin" : isModerator ? "moderator" : "user";

      return {
        id: authUser.id,
        username: profile?.username || authUser.email?.split("@")[0] || "anonymous",
        email: authUser.email || "",
        role,
        isVerified: profile?.is_verified || false,
        joinedDate: profile?.joined_date || new Date().toISOString(),
        lastActive: new Date().toISOString(),
        gender: profile?.gender ?? null,
      };
    } catch (error) {
      console.warn("fetchUserProfile failed", error);
      return null;
    }
  }, [ensureCurrentUserSetup]);

  const syncAuthUser = useCallback(async (authUser: User | null, options?: { skipEnsure?: boolean }) => {
    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const appUser = await fetchUserProfile(authUser, options);
    setUser(appUser);
    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    let mounted = true;
    let lastSyncedUserId: string | null = null;

    const sync = async (authUser: User | null, options?: { skipEnsure?: boolean }) => {
      if (!mounted) return;
      // Avoid duplicate fetch when bootstrap and INITIAL_SESSION/SIGNED_IN fire for the same user
      const nextId = authUser?.id ?? null;
      if (nextId === lastSyncedUserId && nextId !== null) {
        setLoading(false);
        return;
      }
      lastSyncedUserId = nextId;
      await syncAuthUser(authUser, options);
    };

    const bootstrap = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await sync(session?.user ?? null);
    };

    bootstrap();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "INITIAL_SESSION") return;
      // Reset dedupe on sign-out / user change so we re-fetch
      if (!session?.user || session.user.id !== lastSyncedUserId) {
        lastSyncedUserId = null;
      }
      sync(session?.user ?? null, { skipEnsure: event === "TOKEN_REFRESHED" });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [syncAuthUser]);

  const handleAuth = useCallback((userData: AppUser) => {
    setUser(userData);
    toast({
      title: userData.role === "admin" ? "Admin Access Granted" : "Welcome to TruthSpace!",
      description: userData.role === "admin"
        ? "Welcome Admin! You have full access to all platform features."
        : "Welcome to TruthSpace! You can now access all features.",
    });
  }, [toast]);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setUser(null);
      return;
    }

    const nextUser = await fetchUserProfile(session.user, { skipEnsure: true });
    if (nextUser) {
      setUser(nextUser);
    }
  }, [fetchUserProfile]);

  const updateUser = useCallback((updates: Partial<AppUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been safely logged out. Your anonymity remains protected.",
    });
  }, [toast]);

  const handleRestrictedAction = useCallback((action: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: `Please login to ${action}. All activities remain anonymous to the community.`,
        variant: "destructive",
      });
      setShowAuthModal(true);
      return false;
    }
    return true;
  }, [toast, user]);

  const handleDemoLogin = useCallback(async (accountType: "user" | "admin") => {
    const creds = accountType === "admin"
      ? { email: "admin@demo.com", password: "admin123" }
      : { email: "user@demo.com", password: "demo123" };

    let { data, error } = await supabase.auth.signInWithPassword(creds);

    // Only seed if the credentials are actually invalid (account missing / drift)
    if (error) {
      try {
        await supabase.functions.invoke("seed-demo");
      } catch (seedErr) {
        console.error("seed-demo failed", seedErr);
      }
      ({ data, error } = await supabase.auth.signInWithPassword(creds));
    }

    if (data?.user && !error) {
      ensuredUsersRef.current.add(data.user.id);
      setShowAuthModal(false);
      return;
    }

    toast({
      title: "Demo login failed",
      description: error?.message || "Please try again in a moment.",
      variant: "destructive",
    });
  }, [toast]);

  const validateDemoCredentials = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return null;
    return fetchUserProfile(data.user, { skipEnsure: true });
  }, [fetchUserProfile]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    handleAuth,
    handleLogout,
    handleRestrictedAction,
    handleDemoLogin,
    validateDemoCredentials,
    refreshUser,
    updateUser,
  }), [
    user,
    loading,
    showAuthModal,
    handleAuth,
    handleLogout,
    handleRestrictedAction,
    handleDemoLogin,
    validateDemoCredentials,
    refreshUser,
    updateUser,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
