import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MessageCircle, Share2, Shield, MoreHorizontal, Flag, Link as LinkIcon, Trash2 } from "lucide-react";
import PostReactions from "@/components/PostReactions";
import CommentSection from "@/components/CommentSection";
import ReportModal from "@/components/ReportModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Confession {
  id: string;
  title: string;
  content: string;
  category: string;
  timeAgo: string;
  isVerified: boolean;
  tags: string[];
  user_id?: string | null;
  status?: string;
}

interface ConfessionCardProps {
  confession: Confession;
  onDeleted?: (id: string) => void;
}

const ConfessionCard = ({ confession, onDeleted }: ConfessionCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const { user, setShowAuthModal } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { count } = await supabase
        .from("post_comments")
        .select("id", { count: "exact", head: true })
        .eq("post_id", confession.id);
      if (count !== null) setCommentCount(count ?? 0);
    })();
  }, [confession.id]);

  const shareUrl = `${window.location.origin}/?post=${confession.id}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: confession.title,
          text: confession.content.slice(0, 140),
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copied", description: "Post link copied to clipboard." });
      }
    } catch {
      /* user cancelled */
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied" });
  };

  const canDelete = user && (user.role === "admin" || user.id === confession.user_id);

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", confession.id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Post deleted" });
    onDeleted?.(confession.id);
  };

  return (
    <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
            <span className="text-sm text-slate-400">Anonymous • {confession.timeAgo}</span>
            {confession.isVerified && (
              <Badge className="bg-green-500/20 text-green-400 text-xs">
                <Shield className="w-3 h-3 mr-1" />Verified
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
              <DropdownMenuItem onClick={copyLink}>
                <LinkIcon className="w-4 h-4 mr-2" /> Copy link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" /> Share…
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={() => (user ? setShowReport(true) : setShowAuthModal(true))}
                className="text-red-400 focus:text-red-300"
              >
                <Flag className="w-4 h-4 mr-2" /> Report to admin
              </DropdownMenuItem>
              {canDelete && (
                <DropdownMenuItem onClick={handleDelete} className="text-red-400 focus:text-red-300">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete post
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="text-lg font-semibold text-white mt-2">{confession.title}</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-slate-300 leading-relaxed">
          {expanded || confession.content.length <= 200
            ? confession.content
            : `${confession.content.substring(0, 200)}…`}
          {confession.content.length > 200 && (
            <Button
              variant="link"
              className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? " Show less" : " Read more"}
            </Button>
          )}
        </div>

        {confession.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {confession.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <PostReactions
          postId={confession.id}
          userId={user?.id}
          onRequireAuth={() => setShowAuthModal(true)}
        />

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            <span className="text-sm">{commentCount} Comments</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-1" />
            <span className="text-sm">Share</span>
          </Button>
        </div>

        {showComments && (
          <CommentSection
            postId={confession.id}
            userId={user?.id}
            isAdmin={user?.role === "admin"}
            onRequireAuth={() => setShowAuthModal(true)}
            onCountChange={setCommentCount}
          />
        )}

        <ReportModal
          open={showReport}
          onClose={() => setShowReport(false)}
          postId={confession.id}
          userId={user?.id}
        />
      </CardContent>
    </Card>
  );
};

export default ConfessionCard;
