import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, AlertTriangle, Sparkles, Loader2, ShieldCheck, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

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

interface FieldBreakdown {
  field: string;
  label: string;
  weight: number;
  awarded: number;
  strength: "exact" | "partial";
  matched_value_masked: string;
}

interface MatchResult {
  source: "partner_check" | "confession";
  match_ref: string;
  display_name: string;
  location: string | null;
  match_score: number;
  confidence: number;
  breakdown: FieldBreakdown[];
  category: string | null;
  concerns_count: number;
  created_at: string;
}

const CulpritSearch = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    name: "", phone: "", email: "", location: "", college: "", company: "", dob: "",
  });
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [total, setTotal] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Record<string, "correct" | "incorrect">>({});
  const [savingFeedback, setSavingFeedback] = useState<string | null>(null);

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
              const key = `${r.source}:${r.match_ref}:${i}`;
              const level = risk(r.match_score);
              const isOpen = !!expanded[key];
              const fb = feedback[key];
              const totalPossible = r.breakdown.reduce((s, b) => s + b.weight, 0);
              return (
                <Card key={key} className="bg-slate-900 border-slate-700">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{r.display_name}</h3>
                        <p className="text-xs text-slate-500">
                          {r.source === "partner_check" ? "Previously submitted partner check" : "Referenced in a confession"}
                          {r.location ? ` · ${r.location}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={riskColor(level)}>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {level.toUpperCase()} · {r.match_score}%
                        </Badge>
                        <span className="text-[10px] text-slate-500">Confidence {r.confidence}%</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Overall match confidence</span>
                        <span>{r.confidence}%</span>
                      </div>
                      <Progress value={r.confidence} className="h-1.5" />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {r.breakdown.slice(0, 6).map((b) => (
                        <Badge
                          key={b.field}
                          variant="outline"
                          className={
                            b.strength === "exact"
                              ? "border-green-500/50 text-green-300 text-xs"
                              : "border-yellow-500/50 text-yellow-300 text-xs"
                          }
                        >
                          {b.label}: {b.strength}
                        </Badge>
                      ))}
                    </div>

                    <button
                      className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 mb-2"
                      onClick={() => setExpanded((s) => ({ ...s, [key]: !isOpen }))}
                    >
                      {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {isOpen ? "Hide" : "Show"} per-field breakdown
                    </button>

                    {isOpen && (
                      <div className="bg-slate-950/60 border border-slate-800 rounded p-3 mb-3 space-y-2">
                        {r.breakdown.map((b) => (
                          <div key={b.field} className="text-xs">
                            <div className="flex justify-between text-slate-300 mb-1">
                              <span className="font-medium">
                                {b.label}
                                <span className={`ml-2 ${b.strength === "exact" ? "text-green-400" : "text-yellow-400"}`}>
                                  {b.strength}
                                </span>
                              </span>
                              <span className="text-slate-500">{b.awarded} / {b.weight} pts</span>
                            </div>
                            <Progress value={(b.awarded / b.weight) * 100} className="h-1" />
                            <div className="text-[10px] text-slate-500 mt-1">Record value: {b.matched_value_masked || "—"}</div>
                          </div>
                        ))}
                        <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                          <span>Total points awarded</span>
                          <span>{r.match_score} / {totalPossible}</span>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 mb-3">
                      {r.category ? `Category: ${r.category} · ` : ""}
                      {r.concerns_count > 0 ? `${r.concerns_count} concern${r.concerns_count === 1 ? "" : "s"} on record · ` : ""}
                      Added {new Date(r.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                      <span className="text-xs text-slate-400 mr-1">Was this match accurate?</span>
                      {(["correct", "incorrect"] as const).map((kind) => {
                        const active = fb === kind;
                        const Icon = kind === "correct" ? ThumbsUp : ThumbsDown;
                        return (
                          <Button
                            key={kind}
                            size="sm"
                            variant="outline"
                            disabled={!!fb || savingFeedback === key}
                            onClick={async () => {
                              if (!user) {
                                toast({ title: "Sign in required", description: "Log in to submit feedback." });
                                return;
                              }
                              setSavingFeedback(key);
                              const { error } = await supabase.from("background_check_feedback").insert([{
                                user_id: user.id,
                                source: r.source,
                                match_ref: r.match_ref,
                                match_score: r.match_score,
                                is_correct: kind === "correct",
                                query_snapshot: { ...filters, socials } as any,
                                reasons: r.breakdown as any,
                              }]);
                              setSavingFeedback(null);
                              if (error) {
                                toast({ title: "Couldn't save feedback", description: error.message, variant: "destructive" });
                                return;
                              }
                              setFeedback((s) => ({ ...s, [key]: kind }));
                              toast({ title: "Thanks!", description: "Your feedback improves future AI matching." });
                            }}
                            className={
                              active
                                ? (kind === "correct"
                                    ? "border-green-500/70 text-green-300 bg-green-500/10"
                                    : "border-red-500/70 text-red-300 bg-red-500/10")
                                : "border-slate-600 text-slate-300"
                            }
                          >
                            {savingFeedback === key ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : active ? (
                              <Check className="w-3 h-3 mr-1" />
                            ) : (
                              <Icon className="w-3 h-3 mr-1" />
                            )}
                            {kind === "correct" ? "Correct" : "Incorrect"}
                          </Button>
                        );
                      })}
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
