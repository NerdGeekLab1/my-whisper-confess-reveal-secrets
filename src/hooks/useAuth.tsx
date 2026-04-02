
import { useState, useEffect } from "react";
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
}

export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  const fetchUserProfile = async (authUser: User): Promise<AppUser | null> => {
    try {
      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      // Get role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authUser.id);

      const isAdmin = roleData?.some((r: any) => r.role === "admin") ?? false;
      const role = isAdmin ? "admin" : "user";

      return {
        id: authUser.id,
        username: profile?.username || authUser.email?.split("@")[0] || "anonymous",
        email: authUser.email || "",
        role,
        isVerified: profile?.is_verified || false,
        joinedDate: profile?.joined_date || new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const appUser = await fetchUserProfile(session.user);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await fetchUserProfile(session.user);
        setUser(appUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (userData: AppUser) => {
    setUser(userData);
    const welcomeMessage = userData.role === 'admin'
      ? "Welcome Admin! You have full access to all platform features."
      : "Welcome to TruthSpace! You can now access all features.";
    toast({
      title: userData.role === 'admin' ? "Admin Access Granted" : "Welcome to TruthSpace!",
      description: welcomeMessage,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You've been safely logged out. Your anonymity remains protected.",
    });
  };

  const handleRestrictedAction = (action: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: `Please login to ${action}. All activities remain anonymous to the community.`,
        variant: "destructive"
      });
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const handleDemoLogin = async (accountType: 'user' | 'admin') => {
    const creds = accountType === 'admin'
      ? { email: "admin@demo.com", password: "admin123" }
      : { email: "user@demo.com", password: "demo123" };

    const { error } = await supabase.auth.signInWithPassword(creds);
    if (error) {
      // If sign-in fails, try sign-up first
      const { error: signUpError } = await supabase.auth.signUp({
        email: creds.email,
        password: creds.password,
        options: { data: { username: accountType === 'admin' ? 'admin_user' : 'demo_user' } }
      });
      if (signUpError) {
        toast({ title: "Login failed", description: signUpError.message, variant: "destructive" });
        return;
      }
      // Try sign in again after signup
      const { error: retryError } = await supabase.auth.signInWithPassword(creds);
      if (retryError) {
        toast({ title: "Login failed", description: "Please try again in a moment.", variant: "destructive" });
        return;
      }
    }
    setShowAuthModal(false);
  };

  const validateDemoCredentials = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return null;
    if (data.user) {
      return await fetchUserProfile(data.user);
    }
    return null;
  };

  return {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    handleAuth,
    handleLogout,
    handleRestrictedAction,
    handleDemoLogin,
    validateDemoCredentials
  };
};
