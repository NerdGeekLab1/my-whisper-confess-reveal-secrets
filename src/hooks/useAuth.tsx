
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (userData: any) => {
    // This is now handled by the auth state change listener
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You've been safely logged out. Your anonymity remains protected.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
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

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username || `user_${Date.now()}`
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Fetch user profile to get role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const welcomeMessage = profile?.role === 'admin' 
        ? "Welcome Admin! You have full access to all platform features."
        : "Welcome to TruthSpace! You can now access all features including posting and your private diary.";
      
      toast({
        title: profile?.role === 'admin' ? "Admin Access Granted" : "Welcome to TruthSpace!",
        description: welcomeMessage,
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    loading,
    showAuthModal,
    setShowAuthModal,
    handleAuth,
    handleLogout,
    handleRestrictedAction,
    signUp,
    signIn
  };
};
