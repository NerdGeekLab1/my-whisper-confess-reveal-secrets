
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Shield, UserCheck, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { signupSchema, loginSchema } from "@/lib/validation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: any) => void;
  onDemoLogin?: (accountType: 'user' | 'admin') => void;
  validateDemoCredentials?: (email: string, password: string) => any;
}

const AuthModal = ({ isOpen, onClose, onAuth, onDemoLogin }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse(loginForm);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast({ title: "Check your details", description: first.message, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      onClose();
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = signupSchema.safeParse(signupForm);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast({ title: "Check your details", description: first.message, variant: "destructive" });
      return;
    }
    const { username, email, password } = parsed.data;

    setIsLoading(true);

    // Rate-limit pre-flight (fail-open on network errors).
    try {
      const { data: rl, error: rlErr } = await supabase.functions.invoke("signup-rate-limit", {
        body: { email },
      });
      if (!rlErr && rl && rl.allowed === false) {
        toast({
          title: "Too many attempts",
          description: rl.message ?? "Please wait a while before trying again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    } catch (_) {
      // fail-open
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: window.location.origin,
      },
    });

    // Record outcome so repeated failures still count against the limit.
    supabase.functions
      .invoke("signup-rate-limit", { body: { email, record: true, success: !error } })
      .catch(() => {});

    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "You can now log in with your credentials." });
      onClose();
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Secure Authentication</span>
          </DialogTitle>
        </DialogHeader>

        {/* Demo Login Section */}
        <div className="space-y-3 p-4 bg-slate-800 rounded-lg">
          <h3 className="text-sm font-medium text-slate-300 text-center">Quick Demo Access</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onDemoLogin?.('user')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-sm"
              size="sm"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Demo User
            </Button>
            <Button
              onClick={() => onDemoLogin?.('admin')}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-sm"
              size="sm"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Demo Admin
            </Button>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <p><strong>User Demo:</strong> user@demo.com / demo123</p>
            <p><strong>Admin Demo:</strong> admin@demo.com / admin123</p>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="login" className="text-slate-300 data-[state=active]:text-white">Login</TabsTrigger>
            <TabsTrigger value="signup" className="text-slate-300 data-[state=active]:text-white">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input id="login-email" type="email" placeholder="Enter your email" value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    className="pl-10 bg-slate-800 border-slate-600 text-white" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
                    value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="pl-10 pr-10 bg-slate-800 border-slate-600 text-white" required />
                  <Button type="button" variant="ghost" size="sm"
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username" className="text-slate-300">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input id="signup-username" type="text" placeholder="Choose a username" value={signupForm.username}
                    onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                    className="pl-10 bg-slate-800 border-slate-600 text-white" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input id="signup-email" type="email" placeholder="Enter your email" value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    className="pl-10 bg-slate-800 border-slate-600 text-white" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Min 8 chars, letters + numbers"
                    value={signupForm.password} onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                    className="pl-10 pr-10 bg-slate-800 border-slate-600 text-white" required minLength={8} maxLength={128}
                    autoComplete="new-password" />
                  <Button type="button" variant="ghost" size="sm"
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm" className="text-slate-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input id="signup-confirm" type="password" placeholder="Confirm your password" value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                    className="pl-10 bg-slate-800 border-slate-600 text-white" required />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-slate-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Privacy Protected</span>
          </div>
          <p className="text-xs text-slate-400">
            Your data is encrypted and anonymized. We never share personal information.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
