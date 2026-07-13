import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  template_key: string;
  name: string;
  subject: string;
  body: string;
  enabled: boolean;
}

const EmailTemplatesEditor = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<Template>>>({});
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("email_templates").select("*").order("name");
    setTemplates(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (t: Template) => {
    setSaving(t.id);
    const patch = edits[t.id] || {};
    const { error } = await (supabase as any).from("email_templates").update(patch).eq("id", t.id);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Template saved", description: t.name }); setEdits(p => { const c = { ...p }; delete c[t.id]; return c; }); load(); }
    setSaving(null);
  };

  const field = (t: Template, k: keyof Template) => (edits[t.id]?.[k] as any) ?? t[k];
  const setField = (t: Template, k: keyof Template, v: any) =>
    setEdits(p => ({ ...p, [t.id]: { ...p[t.id], [k]: v } }));

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-white animate-spin" /></div>;

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Mail className="w-5 h-5 mr-2 text-blue-400" />Email Templates
        </CardTitle>
        <p className="text-sm text-slate-400">Customize transactional emails. Use variables like <code className="text-blue-300">{"{{username}}"}</code>, <code className="text-blue-300">{"{{reset_link}}"}</code>, <code className="text-blue-300">{"{{verify_link}}"}</code>.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map(t => {
          const dirty = !!edits[t.id];
          return (
            <div key={t.id} className="p-4 border border-slate-700 rounded-lg bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-white font-medium">{t.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{t.template_key}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={field(t, "enabled")} onCheckedChange={(v) => setField(t, "enabled", v)} />
                  <span className="text-xs text-slate-400">{field(t, "enabled") ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div>
                <Label className="text-slate-300 text-xs">Subject</Label>
                <Input value={field(t, "subject")} onChange={(e) => setField(t, "subject", e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white" />
              </div>
              <div>
                <Label className="text-slate-300 text-xs">Body</Label>
                <Textarea value={field(t, "body")} onChange={(e) => setField(t, "body", e.target.value)}
                  rows={6} className="bg-slate-900 border-slate-600 text-white font-mono text-sm" />
              </div>
              <div className="flex justify-end">
                <Button size="sm" disabled={!dirty || saving === t.id} onClick={() => save(t)} className="bg-blue-600 hover:bg-blue-700">
                  {saving === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Save</>}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EmailTemplatesEditor;
