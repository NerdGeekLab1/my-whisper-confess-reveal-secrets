import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  is_anonymous: boolean;
}

interface Props {
  postId: string;
  userId?: string | null;
  isAdmin?: boolean;
  onRequireAuth?: () => void;
  onCountChange?: (n: number) => void;
}

const CommentSection = ({ postId, userId, isAdmin, onRequireAuth, onCountChange }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase
      .from("post_comments")
      .select("id, content, user_id, created_at, is_anonymous")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!error && data) {
      setComments(data as any);
      onCountChange?.(data.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const submit = async () => {
    if (!userId) return onRequireAuth?.();
    if (!text.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: userId,
      content: text.trim(),
      is_anonymous: true,
    });
    setPosting(false);
    if (error) {
      toast({ title: "Comment failed", description: error.message, variant: "destructive" });
      return;
    }
    setText("");
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("post_comments").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  return (
    <div className="mt-4 space-y-3 border-t border-slate-800 pt-4">
      {loading ? (
        <div className="flex justify-center py-2"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {comments.length === 0 && <p className="text-slate-500 text-sm">No comments yet. Be the first.</p>}
          {comments.map((c) => (
            <div key={c.id} className="bg-slate-800/60 rounded-md p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Anonymous · {new Date(c.created_at).toLocaleString()}</p>
                  <p className="text-slate-200 text-sm mt-1 whitespace-pre-wrap">{c.content}</p>
                </div>
                {(userId === c.user_id || isAdmin) && (
                  <Button size="sm" variant="ghost" className="text-red-400 h-7 px-2" onClick={() => remove(c.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={userId ? "Write an anonymous comment…" : "Login to comment"}
          disabled={!userId || posting}
          className="bg-slate-800 border-slate-600 text-white min-h-[60px]"
        />
        <Button onClick={submit} disabled={!text.trim() || posting} className="bg-blue-600 hover:bg-blue-700 self-end">
          {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
