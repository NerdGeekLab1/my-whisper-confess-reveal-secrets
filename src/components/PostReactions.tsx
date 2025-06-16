
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Eye, MessageCircle, HandHeart, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reaction {
  type: 'support' | 'relate' | 'encourage' | 'insightful' | 'healing';
  count: number;
  icon: React.ComponentType<any>;
  label: string;
  color: string;
}

interface PostReactionsProps {
  postId: string;
  initialReactions?: { [key: string]: number };
  onReactionChange?: (postId: string, reactions: { [key: string]: number }) => void;
}

const PostReactions = ({ postId, initialReactions = {}, onReactionChange }: PostReactionsProps) => {
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    support: 0,
    relate: 0,
    encourage: 0,
    insightful: 0,
    healing: 0,
    ...initialReactions
  });

  const reactionTypes: Reaction[] = [
    {
      type: 'support',
      count: reactions.support,
      icon: Heart,
      label: 'Support',
      color: 'text-pink-400 hover:text-pink-300'
    },
    {
      type: 'relate',
      count: reactions.relate,
      icon: Eye,
      label: 'I Relate',
      color: 'text-blue-400 hover:text-blue-300'
    },
    {
      type: 'encourage',
      count: reactions.encourage,
      icon: HandHeart,
      label: 'Encourage',
      color: 'text-green-400 hover:text-green-300'
    },
    {
      type: 'insightful',
      count: reactions.insightful,
      icon: Lightbulb,
      label: 'Insightful',
      color: 'text-yellow-400 hover:text-yellow-300'
    },
    {
      type: 'healing',
      count: reactions.healing,
      icon: MessageCircle,
      label: 'Healing',
      color: 'text-purple-400 hover:text-purple-300'
    }
  ];

  const handleReaction = (reactionType: string) => {
    const newUserReactions = new Set(userReactions);
    const newReactions = { ...reactions };

    if (userReactions.has(reactionType)) {
      // Remove reaction
      newUserReactions.delete(reactionType);
      newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
    } else {
      // Add reaction
      newUserReactions.add(reactionType);
      newReactions[reactionType] = newReactions[reactionType] + 1;
    }

    setUserReactions(newUserReactions);
    setReactions(newReactions);
    
    if (onReactionChange) {
      onReactionChange(postId, newReactions);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
      {reactionTypes.map((reaction) => {
        const Icon = reaction.icon;
        const isActive = userReactions.has(reaction.type);
        
        return (
          <Button
            key={reaction.type}
            variant="ghost"
            size="sm"
            onClick={() => handleReaction(reaction.type)}
            className={cn(
              "flex items-center space-x-1 text-slate-400 hover:bg-slate-800 transition-colors",
              isActive && reaction.color
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{reaction.count}</span>
            <span className="text-xs hidden sm:inline">{reaction.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default PostReactions;
