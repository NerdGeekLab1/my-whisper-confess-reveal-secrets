
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Shield, Clock, Eye, AlertTriangle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Confession {
  id: number;
  title: string;
  content: string;
  category: string;
  timeAgo: string;
  reactions: {
    support: number;
    shocked: number;
    similar: number;
  };
  comments: number;
  isVerified: boolean;
  tags: string[];
}

interface ConfessionCardProps {
  confession: Confession;
}

const ConfessionCard = ({ confession }: ConfessionCardProps) => {
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReaction = (type: string) => {
    setUserReaction(userReaction === type ? null : type);
  };

  const reactionButtons = [
    { type: "support", icon: Heart, label: "Support", color: "text-pink-400", count: confession.reactions.support },
    { type: "shocked", icon: AlertTriangle, label: "Shocked", color: "text-orange-400", count: confession.reactions.shocked },
    { type: "similar", icon: Eye, label: "Similar Experience", color: "text-blue-400", count: confession.reactions.similar },
  ];

  return (
    <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
            <span className="text-sm text-slate-400">Anonymous • {confession.timeAgo}</span>
            {confession.isVerified && (
              <Badge className="bg-green-500/20 text-green-400 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <h3 className="text-lg font-semibold text-white mt-2">{confession.title}</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-slate-300 leading-relaxed">
          {isExpanded ? confession.content : `${confession.content.substring(0, 200)}...`}
          {confession.content.length > 200 && (
            <Button
              variant="link"
              className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? " Show less" : " Read more"}
            </Button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {confession.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400 text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex space-x-1">
            {reactionButtons.map(({ type, icon: Icon, label, color, count }) => (
              <Button
                key={type}
                variant="ghost"
                size="sm"
                onClick={() => handleReaction(type)}
                className={cn(
                  "flex items-center space-x-1 text-slate-400 hover:text-white transition-colors",
                  userReaction === type && color
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{count}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">{confession.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfessionCard;
