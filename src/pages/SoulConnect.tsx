import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Sparkles, Lock, Send, Star, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GenderPrompt from "@/components/GenderPrompt";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type SoulPost = {
  id: string;
  author_id: string;
  author_gender: string;
  target_gender: string;
  title: string | null;
  content: string;
  mood: string | null;
  status: string;
  matched_user_id: string | null;
  soul_score: number;
  ai_soul_score: number;
  participant_score: number;
  reply_count: number;
  created_at: string;
};

type SoulReply = { id: string; soul_post_id: string; author_id: string; content: string; created_at: string };

const oppositeOf = (g: string) => (g === "male" ? "female" : g === "female" ? "male" : "other");

const SoulConnect = () => {
  const navigate = useNavigate();
  const { user, showAuthModal, setShowAuthModal, handleLogout, handleRestrictedAction } = useAuth();
  const setShowPostCreator = (_: boolean) => {};
  const { toast } = useToast();

  const [gender, setGender] = useState<string | null>(null);
  const [showGenderPrompt, setShowGenderPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  const [feed, setFeed] = useState<SoulPost[]>([]);
  const [myThreads, setMyThreads] = useState<SoulPost[]>([]);
  const [tab, setTab] = useState<"feed" | "mine">("feed");

  const [newTitle, setNewTitle] = useState("");
  const [newMood, setNewMood] = useState("");
  const [newContent, setNewContent] = useState("");
  const [posting, setPosting] = useState(false);

  const [openThread, setOpenThread] = useState<SoulPost | null>(null);
  const [replies, setReplies] = useState<SoulReply[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [myRating, setMyRating] = useState<number>(0);

  // load profile gender
  useEffect(() => {
    const init = async () => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("gender").eq("id", user.id).maybeSingle();
      const g = (data as any)?.gender || null;
      if (!g || g === "undisclosed") {
        setShowGenderPrompt(true);
      } else {
        setGender(g);
      }
      setLoading(false);
    };
    init();
  }, [user]);

  // fetch feeds
  const refresh = async () => {
    if (!user) return;
    const { data: feedData } = await supabase
      .from("soul_posts")
      .select("*")
      .eq("status", "open")
      .neq("author_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setFeed((feedData as any) || []);

    const { data: mineData } = await supabase
      .from("soul_posts")
      .select("*")
      .or(`author_id.eq.${user.id},matched_user_id.eq.${user.id}`)
      .order("updated_at", { ascending: false })
      .limit(50);
    setMyThreads((mineData as any) || []);
  };

  useEffect(() => { if (gender) refresh(); }, [gender, user?.id]);

  // realtime
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("soul-posts-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "soul_posts" }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id, gender]);

  // create post
  const submitPost = async () => {
    if (!user || !gender) return;
    if (!newContent.trim()) {
      toast({ title: "Say something from the heart 💭", variant: "destructive" });
      return;
    }
    setPosting(true);
    const { error } = await supabase.from("soul_posts").insert({
      author_id: user.id,
      author_gender: gender as any,
      target_gender: oppositeOf(gender) as any,
      title: newTitle.trim() || null,
      content: newContent.trim(),
      mood: newMood.trim() || null,
      status: "open",
    });
    setPosting(false);
    if (error) {
      toast({ title: "Couldn't post", description: error.message, variant: "destructive" });
      return;
    }
    setNewTitle(""); setNewContent(""); setNewMood("");
    toast({ title: "Posted anonymously 🌙", description: "Waiting for a soul on the other side..." });
    refresh();
  };

  // open a thread
  const openPost = async (p: SoulPost) => {
    setOpenThread(p);
    setReplies([]);
    setReplyText("");
    const { data } = await supabase.from("soul_replies").select("*").eq("soul_post_id", p.id).order("created_at");
    setReplies((data as any) || []);

    if (user) {
      const { data: r } = await supabase.from("soul_ratings").select("rating").eq("soul_post_id", p.id).eq("rater_id", user.id).maybeSingle();
      setMyRating((r as any)?.rating || 0);
    }
  };

  // reply (also locks the thread on first reply by the opposite gender)
  const sendReply = async () => {
    if (!openThread || !user || !gender || !replyText.trim()) return;
    setSending(true);

    const isAuthor = openThread.author_id === user.id;
    const isMatched = openThread.matched_user_id === user.id;

    // First opposite-gender reply locks the thread to those two
    if (!isAuthor && !isMatched) {
      if (openThread.status !== "open" || gender !== openThread.target_gender) {
        toast({ title: "This thread isn't open to you", variant: "destructive" });
        setSending(false);
        return;
      }
      const { error: lockErr } = await supabase
        .from("soul_posts")
        .update({ status: "locked", matched_user_id: user.id, matched_user_gender: gender as any, matched_at: new Date().toISOString() })
        .eq("id", openThread.id)
        .eq("status", "open");
      if (lockErr) {
        toast({ title: "Someone else just connected first 💔", variant: "destructive" });
        setSending(false);
        await refresh();
        setOpenThread(null);
        return;
      }
    }

    const { error } = await supabase.from("soul_replies").insert({
      soul_post_id: openThread.id,
      author_id: user.id,
      content: replyText.trim(),
    });
    if (error) {
      toast({ title: "Couldn't send", description: error.message, variant: "destructive" });
      setSending(false);
      return;
    }
    setReplyText("");
    const { data: latest } = await supabase.from("soul_replies").select("*").eq("soul_post_id", openThread.id).order("created_at");
    const updatedReplies = (latest as any) || [];
    setReplies(updatedReplies);

    // Update reply_count and ask AI to score
    const newCount = updatedReplies.length;
    let aiScore = openThread.ai_soul_score || 0;
    try {
      const { data: scoreData } = await supabase.functions.invoke("soul-score", {
        body: { thread: updatedReplies.map((r: any) => ({ content: r.content })) },
      });
      if (typeof (scoreData as any)?.score === "number") aiScore = (scoreData as any).score;
    } catch (e) { console.warn("score failed", e); }

    const combined = computeCombined(aiScore, openThread.participant_score);
    await supabase.from("soul_posts").update({
      reply_count: newCount,
      ai_soul_score: aiScore,
      soul_score: combined,
      status: "locked",
    }).eq("id", openThread.id);

    setOpenThread({ ...openThread, reply_count: newCount, ai_soul_score: aiScore, soul_score: combined, status: "locked", matched_user_id: openThread.matched_user_id || user.id });
    setSending(false);
    refresh();
  };

  const computeCombined = (ai: number, participantPct: number) => {
    // 60% AI empathy + 40% participant resonance
    const score = Math.round(ai * 0.6 + (participantPct || 0) * 0.4);
    return Math.max(0, Math.min(100, score));
  };

  const submitRating = async (stars: number) => {
    if (!openThread || !user) return;
    setMyRating(stars);
    await supabase.from("soul_ratings").upsert(
      { soul_post_id: openThread.id, rater_id: user.id, rating: stars },
      { onConflict: "soul_post_id,rater_id" }
    );
    const { data: ratings } = await supabase.from("soul_ratings").select("rating").eq("soul_post_id", openThread.id);
    const arr = (ratings as any[]) || [];
    const avg = arr.length ? arr.reduce((s, r) => s + r.rating, 0) / arr.length : 0;
    const participantPct = Math.round((avg / 5) * 100);
    const combined = computeCombined(openThread.ai_soul_score, participantPct);
    await supabase.from("soul_posts").update({ participant_score: participantPct, soul_score: combined }).eq("id", openThread.id);
    setOpenThread({ ...openThread, participant_score: participantPct, soul_score: combined });
    refresh();
  };

  const list = tab === "feed" ? feed : myThreads;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header currentPage="soul-connect" setCurrentPage={(p: string) => { if (p === "confessions") navigate("/"); }} user={user} handleLogout={handleLogout} handleRestrictedAction={handleRestrictedAction} setShowAuthModal={setShowAuthModal} setShowPostCreator={setShowPostCreator} />
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-pink-400" />
          <h1 className="text-3xl font-bold mb-2">Anonymous Soul Connect</h1>
          <p className="text-slate-400 mb-6">Sign in to share what you're feeling and connect with someone on the other side.</p>
          <Button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-pink-500 to-purple-500">Sign in</Button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuth={() => {}} />
        <Footer setCurrentPage={(p) => navigate(p === "confessions" ? "/" : `/${p}`)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header currentPage="soul-connect" setCurrentPage={(p) => p === "confessions" ? navigate("/") : null} user={user} handleLogout={handleLogout} handleRestrictedAction={handleRestrictedAction} setShowAuthModal={setShowAuthModal} setShowPostCreator={setShowPostCreator} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-slate-400 mb-3">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-pink-400" />
            <h1 className="text-3xl font-bold text-white">Anonymous Soul Connect</h1>
            <Badge className="bg-pink-500/20 text-pink-300 border border-pink-500/30 ml-2">BETA</Badge>
          </div>
          <p className="text-slate-400 text-sm">
            Share a feeling. Your post stays hidden until someone of the opposite gender replies — then it's just the two of you.
          </p>
        </div>

        <GenderPrompt
          userId={user.id}
          open={showGenderPrompt}
          onClose={(g) => {
            setShowGenderPrompt(false);
            if (g && g !== "undisclosed") setGender(g);
          }}
        />

        {!gender && !loading && (
          <Card className="bg-slate-900 border-slate-700 mb-6">
            <CardContent className="p-6 text-center">
              <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 mb-3">Set your gender to use Soul Connect.</p>
              <Button onClick={() => setShowGenderPrompt(true)} className="bg-gradient-to-r from-pink-500 to-purple-500">Set now</Button>
            </CardContent>
          </Card>
        )}

        {gender && (
          <Card className="bg-slate-900 border-slate-700 mb-6">
            <CardHeader><CardTitle className="text-white text-lg flex items-center gap-2"><Heart className="w-4 h-4 text-pink-400" /> Pour your heart out</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="A line that captures it (optional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} maxLength={120} className="bg-slate-800 border-slate-600 text-white" />
              <Input placeholder="Mood — e.g. lonely, anxious, hopeful (optional)" value={newMood} onChange={(e) => setNewMood(e.target.value)} maxLength={40} className="bg-slate-800 border-slate-600 text-white" />
              <Textarea placeholder="What's actually going on inside? Be real — it's anonymous." value={newContent} onChange={(e) => setNewContent(e.target.value)} maxLength={2000} className="bg-slate-800 border-slate-600 text-white min-h-[120px]" />
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{newContent.length}/2000 · visible only to {oppositeOf(gender)}s until someone replies</span>
                <Button onClick={submitPost} disabled={posting || !newContent.trim()} className="bg-gradient-to-r from-pink-500 to-purple-500">
                  {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-1" />Send into the void</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2 mb-4">
          <Button variant={tab === "feed" ? "default" : "outline"} size="sm" onClick={() => setTab("feed")} className={tab === "feed" ? "bg-pink-500 hover:bg-pink-600" : "border-slate-600 text-slate-300"}>For you</Button>
          <Button variant={tab === "mine" ? "default" : "outline"} size="sm" onClick={() => setTab("mine")} className={tab === "mine" ? "bg-pink-500 hover:bg-pink-600" : "border-slate-600 text-slate-300"}>My threads</Button>
        </div>

        <div className="space-y-3">
          {list.length === 0 && (
            <Card className="bg-slate-900 border-slate-700"><CardContent className="p-8 text-center text-slate-500">
              {tab === "feed" ? "No open hearts right now. Check back in a bit. 💭" : "You haven't started or joined a thread yet."}
            </CardContent></Card>
          )}
          {list.map((p) => (
            <Card key={p.id} className="bg-slate-900 border-slate-700 hover:border-pink-500/40 cursor-pointer transition-colors" onClick={() => openPost(p)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    {p.title && <h3 className="text-white font-semibold mb-1 truncate">{p.title}</h3>}
                    <p className="text-slate-300 text-sm line-clamp-3 whitespace-pre-wrap">{p.content}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 ${p.status === "locked" ? "border-purple-500/40 text-purple-300" : "border-pink-500/40 text-pink-300"}`}>
                    {p.status === "locked" ? <><Lock className="w-3 h-3 mr-1" />Connected</> : "Open"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                  <span>{p.mood ? `feeling: ${p.mood}` : "anonymous"} · {p.reply_count} {p.reply_count === 1 ? "reply" : "replies"}</span>
                  {p.status === "locked" && (
                    <div className="flex items-center gap-2 w-32">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      <Progress value={p.soul_score} className="h-1.5 flex-1" />
                      <span className="text-pink-300">{p.soul_score}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Thread dialog */}
      <Dialog open={!!openThread} onOpenChange={(o) => !o && setOpenThread(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              {openThread?.title || "Anonymous thread"}
            </DialogTitle>
          </DialogHeader>

          {openThread && (
            <>
              <div className="bg-slate-800/60 rounded-lg p-3 text-sm text-slate-200 whitespace-pre-wrap">{openThread.content}</div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">Soul Score</span>
                <Progress value={openThread.soul_score} className="h-2 flex-1" />
                <span className="text-pink-300 font-semibold">{openThread.soul_score}/100</span>
              </div>
              <p className="text-[10px] text-slate-500 -mt-2">AI empathy {openThread.ai_soul_score} · participant resonance {openThread.participant_score}</p>

              <ScrollArea className="flex-1 max-h-[40vh] pr-3">
                <div className="space-y-2">
                  {replies.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No replies yet. Be the first soul to respond. 🌙</p>}
                  {replies.map((r) => {
                    const mine = r.author_id === user.id;
                    return (
                      <div key={r.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${mine ? "bg-pink-500/20 border border-pink-500/30 text-pink-100" : "bg-slate-800 border border-slate-700 text-slate-200"}`}>
                          {r.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {(openThread.status === "open" || openThread.author_id === user.id || openThread.matched_user_id === user.id) ? (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  {openThread.status === "locked" && (openThread.author_id === user.id || openThread.matched_user_id === user.id) && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Did this resonate?</span>
                      {[1,2,3,4,5].map((s) => (
                        <button key={s} onClick={() => submitRating(s)} className="hover:scale-110 transition-transform">
                          <Star className={`w-4 h-4 ${s <= myRating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={openThread.status === "open" && openThread.author_id !== user.id ? "Be the first to connect..." : "Reply from the heart..."}
                      className="bg-slate-800 border-slate-600 text-white min-h-[60px]"
                      maxLength={1000}
                    />
                    <Button onClick={sendReply} disabled={sending || !replyText.trim()} className="bg-gradient-to-r from-pink-500 to-purple-500 self-end">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-sm py-3 border-t border-slate-800">
                  <Lock className="w-4 h-4 inline mr-1" />This thread is a private connection between two souls.
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuth={() => {}} />
      <Footer setCurrentPage={(p) => navigate(p === "confessions" ? "/" : `/${p}`)} />
    </div>
  );
};

export default SoulConnect;
