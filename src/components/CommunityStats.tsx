
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MessageCircle, Shield } from "lucide-react";

const CommunityStats = () => {
  const stats = [
    {
      title: "Stories Shared",
      value: "2,847",
      change: "+127 this week",
      icon: MessageCircle,
      color: "text-blue-400"
    },
    {
      title: "Support Given",
      value: "15,234",
      change: "+1,892 today",
      icon: Heart,
      color: "text-pink-400"
    },
    {
      title: "Anonymous Members",
      value: "12,456",
      change: "+234 this week",
      icon: Users,
      color: "text-green-400"
    },
    {
      title: "Safe Conversations",
      value: "98.7%",
      change: "Moderation success",
      icon: Shield,
      color: "text-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-slate-900 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommunityStats;
