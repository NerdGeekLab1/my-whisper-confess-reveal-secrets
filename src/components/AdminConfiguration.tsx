import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Save, Loader2, Settings, Key, CreditCard, Mail, MessageSquare, Brain, Plus, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/lib/adminAudit";
import HeadScriptsEditor from "./HeadScriptsEditor";

interface AppSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string | null;
  is_secret: boolean;
}

const CATEGORY_META: Record<string, { label: string; icon: any; color: string }> = {
  ai: { label: "AI Models", icon: Brain, color: "text-purple-400" },
  payment: { label: "Payments", icon: CreditCard, color: "text-green-400" },
  email: { label: "Email", icon: Mail, color: "text-blue-400" },
  messaging: { label: "Messaging", icon: MessageSquare, color: "text-cyan-400" },
  general: { label: "General", icon: Settings, color: "text-slate-300" },
  moderation: { label: "Moderation", icon: Key, color: "text-orange-400" },
};

const AdminConfiguration = () => {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [edited, setEdited] = useState<Record<string, any>>({});
  const [newKey, setNewKey] = useState({ key: "", value: "", category: "general", description: "", is_secret: false });
  const [resetState, setResetState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [resetSummary, setResetSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleResetDemo = async () => {
    if (!confirm("Reset demo data?\n\nThis will:\n• Re-create user@demo.com / admin@demo.com\n• Wipe demo-user posts & diary\n• Reseed sample confessions\n\nReal user data is NOT touched.")) return;
    setResetState("running");
    setResetSummary(null);
    try {
      const { data, error } = await supabase.functions.invoke("seed-demo", { body: { reset: true } });
      if (error) throw error;

      // Verify reseed via current admin session (RLS lets admin see all posts)
      const { count } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved");
      const postCount = count ?? 0;
      const verifyOk = postCount >= 3;

      const summary = `Demo reset complete. Approved posts visible: ${postCount}. Demo creds resynced.`;
      setResetSummary(summary);
      setResetState(verifyOk ? "success" : "error");

      await logAdminAction({
        actionType: "demo_reset",
        targetTable: "posts",
        summary,
        metadata: { ...(data || {}), verifyOk, postCount },
      });

      toast({ title: "Demo data reset", description: summary });
    } catch (e: any) {
      setResetState("error");
      setResetSummary(e?.message || "Reset failed");
      toast({ title: "Reset failed", description: e?.message, variant: "destructive" });
    }
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_settings")
      .select("*")
      .order("category", { ascending: true })
      .order("key", { ascending: true });
    if (error) {
      toast({ title: "Failed to load settings", description: error.message, variant: "destructive" });
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (setting: AppSetting) => {
    setSaving(setting.id);
    const newValue = edited[setting.id] !== undefined ? edited[setting.id] : setting.value?.value;
    const { error } = await supabase
      .from("app_settings")
      .update({ value: { value: newValue } })
      .eq("id", setting.id);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      await logAdminAction({
        actionType: "config_update",
        targetTable: "app_settings",
        targetId: setting.id,
        summary: `Updated ${setting.key}`,
        metadata: { key: setting.key, category: setting.category },
      });
      toast({ title: "Saved", description: `${setting.key} updated` });
      setEdited(prev => { const c = { ...prev }; delete c[setting.id]; return c; });
      load();
    }
    setSaving(null);
  };

  const handleDelete = async (id: string, key: string) => {
    if (!confirm(`Delete setting "${key}"?`)) return;
    const { error } = await supabase.from("app_settings").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      await logAdminAction({
        actionType: "config_delete",
        targetTable: "app_settings",
        targetId: id,
        summary: `Deleted ${key}`,
        metadata: { key },
      });
      toast({ title: "Deleted", description: key });
      load();
    }
  };

  const handleAdd = async () => {
    if (!newKey.key) return;
    const { error } = await supabase.from("app_settings").insert({
      key: newKey.key.toUpperCase().replace(/\s+/g, "_"),
      value: { value: newKey.value },
      category: newKey.category,
      description: newKey.description || null,
      is_secret: newKey.is_secret,
    });
    if (error) {
      toast({ title: "Add failed", description: error.message, variant: "destructive" });
    } else {
      await logAdminAction({
        actionType: "config_create",
        targetTable: "app_settings",
        summary: `Added ${newKey.key.toUpperCase().replace(/\s+/g, "_")}`,
        metadata: { key: newKey.key, category: newKey.category, is_secret: newKey.is_secret },
      });
      toast({ title: "Setting added", description: newKey.key });
      setNewKey({ key: "", value: "", category: "general", description: "", is_secret: false });
      load();
    }
  };

  const grouped = settings.reduce<Record<string, AppSetting[]>>((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});
  const categories = Object.keys(grouped);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  const renderSetting = (s: AppSetting) => {
    const currentValue = edited[s.id] !== undefined ? edited[s.id] : s.value?.value ?? "";
    const isBoolean = typeof s.value?.value === "boolean";
    const isReveal = revealed[s.id];
    const isDirty = edited[s.id] !== undefined && edited[s.id] !== s.value?.value;

    return (
      <div key={s.id} className="p-4 border border-slate-700 rounded-lg space-y-2 bg-slate-800/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Label className="text-white font-mono text-sm">{s.key}</Label>
              {s.is_secret && <Badge className="bg-orange-500/20 text-orange-400 text-xs">SECRET</Badge>}
            </div>
            {s.description && <p className="text-xs text-slate-400 mt-1">{s.description}</p>}
          </div>
          <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDelete(s.id, s.key)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {isBoolean ? (
            <Switch
              checked={!!currentValue}
              onCheckedChange={(v) => setEdited(prev => ({ ...prev, [s.id]: v }))}
            />
          ) : (
            <>
              <Input
                type={s.is_secret && !isReveal ? "password" : "text"}
                value={currentValue}
                placeholder={s.is_secret ? "Enter API key..." : "Enter value..."}
                onChange={(e) => setEdited(prev => ({ ...prev, [s.id]: e.target.value }))}
                className="bg-slate-900 border-slate-600 text-white font-mono text-sm"
              />
              {s.is_secret && (
                <Button size="sm" variant="outline" className="border-slate-600"
                  onClick={() => setRevealed(prev => ({ ...prev, [s.id]: !prev[s.id] }))}>
                  {isReveal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              )}
            </>
          )}
          <Button
            size="sm"
            disabled={!isDirty || saving === s.id}
            onClick={() => handleSave(s)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-400" />
          Configuration & API Keys
        </CardTitle>
        <p className="text-sm text-slate-400">
          Manage API keys for AI, payments, email, messaging and global app settings. Secret values are visible only to admins.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg border border-amber-700/40 bg-amber-950/30 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-amber-200 font-medium flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Reset demo data
            </p>
            <p className="text-xs text-amber-300/80 mt-1">
              Recreates demo accounts, wipes demo-user posts &amp; diary, and reseeds sample confessions. Real user data is untouched.
            </p>
            {resetSummary && (
              <p className={`text-xs mt-2 flex items-center gap-1 ${resetState === "success" ? "text-green-400" : resetState === "error" ? "text-red-400" : "text-slate-300"}`}>
                {resetState === "success" && <CheckCircle2 className="w-3 h-3" />}
                {resetSummary}
              </p>
            )}
          </div>
          <Button
            onClick={handleResetDemo}
            disabled={resetState === "running"}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {resetState === "running" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Reset demo data
          </Button>
        </div>

        <Tabs defaultValue={categories[0] || "general"}>
          <TabsList className="bg-slate-800 flex flex-wrap h-auto">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat] || CATEGORY_META.general;
              const Icon = meta.icon;
              return (
                <TabsTrigger key={cat} value={cat} className="text-slate-300 data-[state=active]:text-white">
                  <Icon className={`w-4 h-4 mr-2 ${meta.color}`} />
                  {meta.label}
                </TabsTrigger>
              );
            })}
            <TabsTrigger value="__new" className="text-slate-300 data-[state=active]:text-white">
              <Plus className="w-4 h-4 mr-2" />Add New
            </TabsTrigger>
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-4 space-y-3">
              {grouped[cat].map(renderSetting)}
            </TabsContent>
          ))}

          <TabsContent value="__new" className="mt-4 space-y-3">
            <div className="p-4 border border-slate-700 rounded-lg space-y-3 bg-slate-800/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white">Key (e.g. STRIPE_WEBHOOK_SECRET)</Label>
                  <Input value={newKey.key} onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                    className="bg-slate-900 border-slate-600 text-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-white">Category</Label>
                  <select value={newKey.category} onChange={(e) => setNewKey({ ...newKey, category: e.target.value })}
                    className="w-full h-10 rounded-md bg-slate-900 border border-slate-600 text-white px-3">
                    {Object.entries(CATEGORY_META).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-white">Description</Label>
                <Textarea value={newKey.description} onChange={(e) => setNewKey({ ...newKey, description: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-white" rows={2} />
              </div>
              <div className="space-y-1">
                <Label className="text-white">Initial value</Label>
                <Input value={newKey.value} onChange={(e) => setNewKey({ ...newKey, value: e.target.value })}
                  className="bg-slate-900 border-slate-600 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={newKey.is_secret} onCheckedChange={(v) => setNewKey({ ...newKey, is_secret: v })} />
                <Label className="text-slate-300">Mark as secret (hide value by default)</Label>
              </div>
              <Button onClick={handleAdd} disabled={!newKey.key} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />Add Setting
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminConfiguration;
