import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code2, Save, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { sanitizeHeadScripts } from "@/lib/sanitizeHeadScripts";
import { logAdminAction } from "@/lib/adminAudit";

const KEY = "CUSTOM_HEAD_SCRIPTS";

const PLACEHOLDER = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>

<!-- Facebook Pixel -->
<script>!function(f,b,e,v,n,t,s){/* ... */}(window,document,'script');</script>

<!-- Meta tags -->
<meta name="google-site-verification" content="..." />`;

const HeadScriptsEditor = () => {
  const [value, setValue] = useState("");
  const [original, setOriginal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingId, setSettingId] = useState<string | null>(null);
  const { toast } = useToast();

  const preview = sanitizeHeadScripts(value);
  const dirty = value !== original;

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("id,value")
        .eq("key", KEY)
        .maybeSingle();
      const v = (data?.value as any)?.value ?? "";
      setValue(v);
      setOriginal(v);
      setSettingId(data?.id ?? null);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    // Persist the sanitized HTML so nothing unsafe ever reaches the public site
    const safe = preview.html;
    let error: any;
    if (settingId) {
      ({ error } = await supabase
        .from("app_settings")
        .update({ value: { value: safe } })
        .eq("id", settingId));
    } else {
      const res = await supabase
        .from("app_settings")
        .insert({
          key: KEY,
          value: { value: safe },
          category: "general",
          description: "Custom <head> tags (analytics, pixels, meta).",
          is_secret: false,
        })
        .select("id")
        .single();
      error = res.error;
      if (res.data) setSettingId(res.data.id);
    }

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      setValue(safe);
      setOriginal(safe);
      await logAdminAction({
        actionType: "config_update",
        targetTable: "app_settings",
        summary: `Updated ${KEY}`,
        metadata: {
          key: KEY,
          warnings: preview.warnings.length,
          removedTags: preview.removedTags,
        },
      });
      toast({
        title: "Head scripts saved",
        description: preview.warnings.length
          ? `Saved with ${preview.warnings.length} sanitization warning(s).`
          : "Sanitized and live on next page load.",
      });
    }
    setSaving(false);
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Code2 className="w-5 h-5 mr-2 text-cyan-400" />
          Custom Head Scripts
          <Badge className="ml-2 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
            <ShieldCheck className="w-3 h-3 mr-1" /> Sanitized
          </Badge>
        </CardTitle>
        <p className="text-sm text-slate-400">
          Paste Google Analytics, Facebook Pixel, or other meta tags. Only{" "}
          <code className="text-cyan-300">script</code>,{" "}
          <code className="text-cyan-300">noscript</code>,{" "}
          <code className="text-cyan-300">meta</code>,{" "}
          <code className="text-cyan-300">link</code>, and{" "}
          <code className="text-cyan-300">style</code> tags are allowed. Inline
          event handlers (onclick, onload…) and unsafe URL schemes are stripped.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        ) : (
          <>
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={12}
              className="bg-slate-950 border-slate-700 text-slate-100 font-mono text-xs"
            />

            {(preview.warnings.length > 0 || preview.removedTags.length > 0) && (
              <div className="rounded-md border border-amber-700/40 bg-amber-950/30 p-3 space-y-1">
                <p className="text-amber-300 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Sanitization will modify this input:
                </p>
                {preview.removedTags.length > 0 && (
                  <p className="text-xs text-amber-200">
                    Removed disallowed tags: {preview.removedTags.join(", ")}
                  </p>
                )}
                {preview.warnings.slice(0, 6).map((w, i) => (
                  <p key={i} className="text-xs text-amber-200">• {w}</p>
                ))}
                {preview.warnings.length > 6 && (
                  <p className="text-xs text-amber-200">
                    …and {preview.warnings.length - 6} more.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Sanitized preview (what gets saved):</p>
              <pre className="bg-slate-950 border border-slate-700 rounded-md p-3 text-xs text-emerald-300 overflow-x-auto max-h-48">
                {preview.html || "(empty)"}
              </pre>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={save}
                disabled={!dirty || saving}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save head scripts
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HeadScriptsEditor;
