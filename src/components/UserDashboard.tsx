
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User, MessageCircle, BookOpen, Heart, TrendingUp, Calendar,
  Shield, Settings, Bell, Star, History as HistoryIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import UserSettingsModal from "@/components/UserSettingsModal";

interface UserDashboardProps {
  user: any;
  setCurrentPage?: (page: string) => void;
  setShowPostCreator?: (show: boolean) => void;
}

const UserDashboard = ({ user, setCurrentPage, setShowPostCreator }: UserDashboardProps) => {
  const [stats, setStats] = useState({ storiesPosted: 0, supportGiven: 0, diaryEntries: 0, daysActive: 0 });
  const [activity, setActivity] = useState<{ title: string; time: string }[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "notif" | "history">("profile");

  useEffect(() => {
    (async () => {
      const [posts, reactions, diary] = await Promise.all([
        supabase.from("posts").select("id,title,created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("post_reactions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("diary_entries").select("id,title,created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);
      const daysActive = user.joinedDate
        ? Math.max(1, Math.round((Date.now() - new Date(user.joinedDate).getTime()) / 86400000))
        : 1;
      setStats({
        storiesPosted: posts.count ?? posts.data?.length ?? 0,
        supportGiven: reactions.count ?? 0,
        diaryEntries: diary.count ?? diary.data?.length ?? 0,
        daysActive,
      });
      const items = [
        ...(posts.data || []).map((p: any) => ({ title: `You posted "${p.title}"`, time: new Date(p.created_at).toLocaleString() })),
        ...(diary.data || []).map((d: any) => ({ title: `Diary entry: ${d.title || "Untitled"}`, time: new Date(d.created_at).toLocaleString() })),
      ];
      setActivity(items.slice(0, 6));
    })();
  }, [user.id, user.joinedDate]);

  const openSettings = (tab: "profile" | "notif" | "history") => {
    setSettingsTab(tab);
    setSettingsOpen(true);
  };

  const handleShareStory = () => setShowPostCreator?.(true);
  const handleWriteDiary = () => setCurrentPage?.("diary");
  const handleGetSupport = () => setCurrentPage?.("helpline");
  const handleLoyaltyScore = () => setCurrentPage?.("loyalty-score");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.username}</h1>
            <p className="text-slate-400">Your safe space for healing and truth</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" onClick={() => openSettings("notif")}>
              <Bell className="w-4 h-4 mr-2" />Notifications
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" onClick={() => openSettings("history")}>
              <HistoryIcon className="w-4 h-4 mr-2" />History
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300" onClick={() => openSettings("profile")}>
              <Settings className="w-4 h-4 mr-2" />Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Stories Posted", value: stats.storiesPosted, Icon: MessageCircle, color: "text-blue-400" },
            { label: "Support Given", value: stats.supportGiven, Icon: Heart, color: "text-pink-400" },
            { label: "Diary Entries", value: stats.diaryEntries, Icon: BookOpen, color: "text-green-400" },
            { label: "Days Active", value: stats.daysActive, Icon: Calendar, color: "text-purple-400" },
          ].map(({ label, value, Icon, color }) => (
            <Card key={label} className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.length === 0 && <p className="text-slate-400 text-sm">No activity yet — try sharing a story or writing in your diary.</p>}
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-slate-800 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-slate-300">{a.title}</p>
                      <p className="text-xs text-slate-500">{a.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader><CardTitle className="text-white">Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleShareStory} className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                  <MessageCircle className="w-4 h-4 mr-2" />Share New Story
                </Button>
                <Button onClick={handleWriteDiary} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  <BookOpen className="w-4 h-4 mr-2" />Write in Diary
                </Button>
                <Button onClick={handleLoyaltyScore} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                  <Star className="w-4 h-4 mr-2" />Test Loyalty Score
                </Button>
                <Button onClick={handleGetSupport} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Heart className="w-4 h-4 mr-2" />Get Support
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 mt-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Your Privacy</span>
                </div>
                <p className="text-xs text-slate-400">
                  All your activities remain anonymous to the community while being securely stored in your account.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <UserSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onUpdated={() => {/* handled inside modal */}}
        key={settingsTab /* remount to jump tab */}
      />
    </div>
  );
};

export default UserDashboard;
