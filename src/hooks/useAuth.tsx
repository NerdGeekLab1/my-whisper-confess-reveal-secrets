
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Demo accounts
const DEMO_ACCOUNTS = {
  user: {
    email: "user@demo.com",
    password: "demo123",
    userData: {
      id: 1,
      username: "demo_user",
      email: "user@demo.com",
      role: "user",
      isVerified: true,
      joinedDate: "2024-01-15",
      lastActive: "2024-06-16"
    }
  },
  admin: {
    email: "admin@demo.com",
    password: "admin123",
    userData: {
      id: 2,
      username: "admin_user",
      email: "admin@demo.com",
      role: "admin",
      isVerified: true,
      joinedDate: "2024-01-01",
      lastActive: "2024-06-16"
    }
  }
};

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  const handleAuth = (userData: any) => {
    setUser(userData);
    const welcomeMessage = userData.role === 'admin' 
      ? "Welcome Admin! You have full access to all platform features."
      : "Welcome to TruthSpace! You can now access all features including posting and your private diary.";
    
    toast({
      title: userData.role === 'admin' ? "Admin Access Granted" : "Welcome to TruthSpace!",
      description: welcomeMessage,
    });
  };

  const handleLogout = () => {
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

  const handleDemoLogin = (accountType: 'user' | 'admin') => {
    const demoAccount = DEMO_ACCOUNTS[accountType];
    handleAuth(demoAccount.userData);
    setShowAuthModal(false);
  };

  const validateDemoCredentials = (email: string, password: string) => {
    if (email === DEMO_ACCOUNTS.user.email && password === DEMO_ACCOUNTS.user.password) {
      return DEMO_ACCOUNTS.user.userData;
    }
    if (email === DEMO_ACCOUNTS.admin.email && password === DEMO_ACCOUNTS.admin.password) {
      return DEMO_ACCOUNTS.admin.userData;
    }
    return null;
  };

  return {
    user,
    showAuthModal,
    setShowAuthModal,
    handleAuth,
    handleLogout,
    handleRestrictedAction,
    handleDemoLogin,
    validateDemoCredentials
  };
};
