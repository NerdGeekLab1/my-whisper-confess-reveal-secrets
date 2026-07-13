import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Eye, HandHeart, Lightbulb, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ReactionType = "support" | "relate" | "encourage" | "insightful" | "healing";

const REACTIONS: { type: ReactionType; icon: any; label: string; color: string }[] = [
  { type: "support", icon: Heart, label: "Support", color: "text-pink-400" },
  { type: "relate", icon: Eye, label: "I Relate", color: "text-blue-400" },
  { type: "encourage", icon: HandHeart, label: "Encourage", color: "text-green-400" },
  { type: "insightful", icon: Lightbulb, label: "Insightful", color: "text-yellow-400" },
  { type: "healing", icon: MessageCircle, label: "Healing", color: "text-purple-400" },
];

interface Props {
  postId: string;
  userId?: string | null;
  onRequireAuth?: () => void;
}

const PostReactions = ({ postId, userId, onRequireAuth }: Props) => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<ReactionType | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase
      .from("post_reactions")
      .select("reaction_type,user_id")
      .eq("post_id", postId);
    const c: Record<string, number> = {};
    let m: ReactionType | null = null;
    (data ?? []).forEach((r: any) => {
      c[r.reaction_type] = (c[r.reaction_type] ?? 0) + 1;
      if (userId && r.user_id === userId) m = r.reaction_type;
    });
    setCounts(c);
    setMine(m);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, userId]);

  const handleClick = async (type: ReactionType) => {
    if (!userId) {
      onRequireAuth?.();
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      if (mine === type) {
        // Toggle off
        await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", userId);
      } else {
        // Upsert single reaction per user per post (unique constraint)
        await supabase
          .from("post_reactions")
          .upsert(
            { post_id: postId, user_id: userId, reaction_type: type },
            { onConflict: "post_id,user_id" }
          );
      }
      await load();
    } catch (e: any) {
      toast({ title: "Reaction failed", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
      {REACTIONS.map((r) => {
        const Icon = r.icon;
        const active = mine === r.type;
        return (
          <Button
            key={r.type}
            variant="ghost"
            size="sm"
            disabled={busy}
            onClick={() => handleClick(r.type)}
            className={cn(
              "flex items-center space-x-1 hover:bg-slate-800",
              active ? r.color : "text-slate-400"
            )}
          >
            <Icon className={cn("w-4 h-4", active && "fill-current")} />
            <span className="text-sm">{counts[r.type] ?? 0}</span>
            <span className="text-xs hidden sm:inline">{r.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default PostReactions;
