import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, User as UserIcon, Bell, History, BookOpen, MessageCircle, Star, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { AppUser } from "@/hooks/useAuth";

interface Props {
  open: boolean;
  onClose: () => void;
  user: AppUser;
  onUpdated?: (u: Partial<AppUser>) => void;
}

const defaultPrefs = {
  comments: true, reactions: true, reports: true, newsletter: false,
  email_comments: true, email_reactions: false, email_reports: true, email_newsletter: false,
  push_comments: true, push_reactions: true, push_reports: true,
};

const UserSettingsModal = ({ open, onClose, user, onUpdated }: Props) => {
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<string>("");
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("username, notification_prefs, bio, gender")
        .eq("id", user.id)
        .maybeSingle();
      if (data) {
        setUsername(data.username || user.username);
        setBio((data as any).bio || "");
        setGender((data as any).gender || "");
        setPrefs({ ...defaultPrefs, ...(data.notification_prefs as any) });
      }
      const [posts, diary, loyalty] = await Promise.all([
        supabase.from("posts").select("id,title,created_at,status").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("diary_entries").select("id,title,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
        supabase.from("loyalty_scores").select("id,partner_name,overall_score,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      ]);
      const items = [
        ...(posts.data || []).map((p: any) => ({ type: "post", id: p.id, label: p.title, at: p.created_at, meta: p.status })),
        ...(diary.data || []).map((d: any) => ({ type: "diary", id: d.id, label: d.title || "Untitled", at: d.created_at })),
        ...(loyalty.data || []).map((l: any) => ({ type: "loyalty", id: l.id, label: l.partner_name, at: l.created_at, meta: `${l.overall_score}/100` })),
      ].sort((a, b) => (b.at || "").localeCompare(a.at || ""));
      setHistory(items);
      setLoading(false);
    })();
  }, [open, user.id, user.username]);

  const saveProfile = async () => {
    setSaving(true);
    const payload: any = { username, notification_prefs: prefs, bio };
    if (gender) payload.gender = gender;
    const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Settings saved" });
    onUpdated?.({ username });
  };

  const changePassword = async () => {
    if (newPass.length < 8) return toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
    if (newPass !== confirmPass) return toast({ title: "Passwords don't match", variant: "destructive" });
    setChangingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setChangingPass(false);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    setNewPass(""); setConfirmPass("");
    toast({ title: "Password updated" });
  };

  const iconFor = (t: string) => t === "post" ? MessageCircle : t === "diary" ? BookOpen : Star;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Account & Settings</DialogTitle></DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : (
          <Tabs defaultValue="profile">
            <TabsList className="bg-slate-800 flex-wrap h-auto">
              <TabsTrigger value="profile"><UserIcon className="w-4 h-4 mr-1" />Profile</TabsTrigger>
              <TabsTrigger value="security"><KeyRound className="w-4 h-4 mr-1" />Security</TabsTrigger>
              <TabsTrigger value="notif"><Bell className="w-4 h-4 mr-1" />Notifications</TabsTrigger>
              <TabsTrigger value="history"><History className="w-4 h-4 mr-1" />History</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="space-y-1">
                <Label>Display name</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800 border-slate-600" />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input value={user.email} disabled className="bg-slate-800 border-slate-600" />
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <div><Badge className="bg-slate-700 text-slate-200">{user.role}</Badge></div>
              </div>
              <Button onClick={saveProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save profile"}
              </Button>
            </TabsContent>
            <TabsContent value="notif" className="space-y-4 mt-4">
              {[
                { k: "comments", label: "New comments on my posts" },
                { k: "reactions", label: "New reactions on my posts" },
                { k: "reports", label: "Admin decisions on reports" },
                { k: "newsletter", label: "Community newsletter" },
              ].map(({ k, label }) => (
                <div key={k} className="flex items-center justify-between bg-slate-800 rounded-md px-4 py-3">
                  <span className="text-slate-200 text-sm">{label}</span>
                  <Switch checked={(prefs as any)[k]} onCheckedChange={(v) => setPrefs((p) => ({ ...p, [k]: v }))} />
                </div>
              ))}
              <Button onClick={saveProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save preferences"}
              </Button>
            </TabsContent>
            <TabsContent value="history" className="mt-4 space-y-2 max-h-[50vh] overflow-y-auto">
              {history.length === 0 && <p className="text-slate-400 text-sm">No activity yet.</p>}
              {history.map((h) => {
                const Icon = iconFor(h.type);
                return (
                  <div key={`${h.type}-${h.id}`} className="flex items-center justify-between bg-slate-800 rounded-md px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-200 text-sm truncate">{h.label}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {h.meta && <Badge className="bg-slate-700 text-slate-200 text-xs">{h.meta}</Badge>}
                      <span className="text-slate-500 text-xs">{h.at ? new Date(h.at).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsModal;
