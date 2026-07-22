import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, AlertTriangle, Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Filters {
  name: string;
  phone: string;
  email: string;
  location: string;
  college: string;
  company: string;
  dob: string;
}

const SOCIAL_PLATFORMS: { key: string; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "twitter", label: "X / Twitter" },
  { key: "tiktok", label: "TikTok" },
  { key: "snapchat", label: "Snapchat" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "reddit", label: "Reddit" },
  { key: "youtube", label: "YouTube" },
  { key: "telegram", label: "Telegram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "discord", label: "Discord" },
  { key: "tinder", label: "Tinder" },
  { key: "bumble", label: "Bumble" },
  { key: "hinge", label: "Hinge" },
];

interface MatchResult {
  source: "partner_check" | "confession";
  display_name: string;
  location: string | null;
  match_score: number;
  match_reasons: string[];
  category: string | null;
  concerns_count: number;
  created_at: string;
}

const CulpritSearch = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    name: "", phone: "", email: "", location: "", college: "", company: "", dob: "",
  });
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [total, setTotal] = useState<number | null>(null);

  const risk = (s: number): "high" | "medium" | "low" =>
    s >= 70 ? "high" : s >= 40 ? "medium" : "low";

  const riskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      default: return "bg-green-500/20 text-green-400 border-green-500/50";
    }
  };

  const handleSearch = async () => {
    const anyInput = Object.values(filters).some((v) => v.trim()) || Object.values(socials).some((v) => v.trim());
    if (!anyInput) {
      toast({ title: "Add at least one detail", description: "Enter a name, contact, or social handle to search." });
      return;
    }
    setIsSearching(true);
    setResults([]);
    setAiSummary("");
    try {
      const { data, error } = await supabase.functions.invoke("partner-background-check", {
        body: { ...filters, socials },
      });
      if (error) throw error;
      setResults(data?.results ?? []);
      setAiSummary(data?.ai_summary ?? "");
      setTotal(data?.total ?? 0);
    } catch (e: any) {
      toast({ title: "Search failed", description: e.message ?? "Try again", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Partner Background Check</h1>
          <p className="text-slate-400 flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            AI cross-matches your query against internal confessions & partner-check records. Results are anonymized.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5" /> Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="identity">
              <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger value="identity">Identity</TabsTrigger>
                <TabsTrigger value="social">Social Handles</TabsTrigger>
              </TabsList>

              <TabsContent value="identity" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {([
                    ["name", "Full Name", "Enter full name", "text"],
                    ["phone", "Phone Number", "e.g. +1 555 000 1234", "tel"],
                    ["email", "Email", "someone@example.com", "email"],
                    ["dob", "Date of Birth", "", "date"],
                    ["location", "Location", "City, State", "text"],
                    ["college", "College / University", "Institution", "text"],
                    ["company", "Company", "Workplace", "text"],
                  ] as const).map(([k, label, ph, type]) => (
                    <div key={k}>
                      <label className="text-sm text-slate-400 mb-2 block">{label}</label>
                      <Input
                        type={type}
                        placeholder={ph}
                        value={filters[k]}
                        onChange={(e) => setFilters({ ...filters, [k]: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="social" className="mt-4">
                <p className="text-xs text-slate-500 mb-3">Add every handle you know — the AI matcher uses them to weight identity confidence.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SOCIAL_PLATFORMS.map((p) => (
                    <div key={p.key}>
                      <label className="text-sm text-slate-400 mb-2 block">{p.label}</label>
                      <Input
                        placeholder={`@handle or profile URL`}
                        value={socials[p.key] ?? ""}
                        onChange={(e) => setSocials({ ...socials, [p.key]: e.target.value })}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex items-center gap-3">
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                {isSearching ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Matching…</> : <><Sparkles className="w-4 h-4 mr-2" /> Run AI Match</>}
              </Button>
              {total !== null && !isSearching && (
                <span className="text-xs text-slate-500">{total} internal record{total === 1 ? "" : "s"} scanned for overlap</span>
              )}
            </div>
          </CardContent>
        </Card>

        {aiSummary && (
          <Card className="bg-slate-900 border-purple-500/40 mb-6">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <div className="text-purple-300 text-sm font-semibold mb-1">AI Match Summary</div>
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{aiSummary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {results.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Potential Matches ({results.length})</h2>
            {results.map((r, i) => {
              const level = risk(r.match_score);
              return (
                <Card key={i} className="bg-slate-900 border-slate-700">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{r.display_name}</h3>
                        <p className="text-xs text-slate-500">
                          {r.source === "partner_check" ? "Previously submitted partner check" : "Referenced in a confession"}
                          {r.location ? ` · ${r.location}` : ""}
                        </p>
                      </div>
                      <Badge className={riskColor(level)}>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {level.toUpperCase()} · {r.match_score}%
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {r.match_reasons.slice(0, 6).map((rr, idx) => (
                        <Badge key={idx} variant="outline" className="border-slate-600 text-slate-300 text-xs">{rr}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500">
                      {r.category ? `Category: ${r.category} · ` : ""}
                      {r.concerns_count > 0 ? `${r.concerns_count} concern${r.concerns_count === 1 ? "" : "s"} on record · ` : ""}
                      Added {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          !isSearching && total !== null && (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-8 text-center text-slate-400">
                No matches found in our internal database. That's a good sign — but always trust your gut.
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default CulpritSearch;
