import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User, MessageCircle, BookOpen, Heart, TrendingUp, Calendar,
  Shield, Settings, Bell, Star, History as HistoryIcon, KeyRound,
  AlertCircle, CheckCircle2, Sparkles, Flag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import UserSettingsModal from "@/components/UserSettingsModal";

interface UserDashboardProps {
  user: any;
  setCurrentPage?: (page: string) => void;
  setShowPostCreator?: (show: boolean) => void;
}

type Alert = { id: string; type: "report" | "comment" | "reaction"; text: string; at: string; status?: string };

const UserDashboard = ({ user, setCurrentPage, setShowPostCreator }: UserDashboardProps) => {
  const [stats, setStats] = useState({ storiesPosted: 0, supportGiven: 0, diaryEntries: 0, daysActive: 0 });
  const [activity, setActivity] = useState<{ title: string; time: string }[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "security" | "notif" | "history">("profile");

  useEffect(() => {
    (async () => {
      const [posts, reactions, diary, myPostIds] = await Promise.all([
        supabase.from("posts").select("id,title,created_at,status", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("post_reactions").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("diary_entries").select("id,title,created_at", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("posts").select("id").eq("user_id", user.id),
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
      ].slice(0, 6);
      setActivity(items);

      // Build alerts: recent comments/reactions on my posts + report decisions
      const ids = (myPostIds.data || []).map((p: any) => p.id);
      const alertsBucket: Alert[] = [];
      if (ids.length) {
        const [comments, newReactions, reports] = await Promise.all([
          supabase.from("post_comments").select("id,content,created_at,post_id").in("post_id", ids).neq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
          supabase.from("post_reactions").select("id,type,created_at,post_id").in("post_id", ids).neq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
          supabase.from("reports").select("id,status,created_at,post_id,reason").in("post_id", ids).order("created_at", { ascending: false }).limit(5),
        ]);
        (comments.data || []).forEach((c: any) => alertsBucket.push({ id: `c-${c.id}`, type: "comment", text: `New comment: "${(c.content || "").slice(0, 60)}"`, at: c.created_at }));
        (newReactions.data || []).forEach((r: any) => alertsBucket.push({ id: `r-${r.id}`, type: "reaction", text: `Someone reacted with ${r.type} to your post`, at: r.created_at }));
        (reports.data || []).forEach((rp: any) => alertsBucket.push({ id: `rp-${rp.id}`, type: "report", text: `Report on your post: ${rp.reason?.slice(0, 60) || "flagged"}`, at: rp.created_at, status: rp.status }));
      }
      alertsBucket.sort((a, b) => (b.at || "").localeCompare(a.at || ""));
      setAlerts(alertsBucket.slice(0, 6));
    })();
  }, [user.id, user.joinedDate]);

  const openSettings = (tab: "profile" | "security" | "notif" | "history") => {
    setSettingsTab(tab);
    setSettingsOpen(true);
  };

  const handleShareStory = () => setShowPostCreator?.(true);
  const handleWriteDiary = () => setCurrentPage?.("diary");
  const handleGetSupport = () => setCurrentPage?.("helpline");
  const handleLoyaltyScore = () => setCurrentPage?.("loyalty-score");
  const handleSoulConnect = () => window.location.assign("/soul-connect");

  const alertIcon = (t: Alert["type"]) => t === "comment" ? MessageCircle : t === "reaction" ? Heart : Flag;
  const alertColor = (t: Alert["type"]) => t === "comment" ? "text-blue-400" : t === "reaction" ? "text-pink-400" : "text-amber-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome back, {user.username}</h1>
            <p className="text-slate-400 text-sm">Your safe space for healing and truth</p>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800" onClick={() => openSettings("notif")}>
              <Bell className="w-4 h-4 mr-2" />Notifications
              {alerts.length > 0 && <Badge className="ml-2 bg-red-500/80 text-white text-[10px] px-1.5 py-0">{alerts.length}</Badge>}
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800" onClick={() => openSettings("history")}>
              <HistoryIcon className="w-4 h-4 mr-2" />History
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800" onClick={() => openSettings("security")}>
              <KeyRound className="w-4 h-4 mr-2" />Password
            </Button>
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800" onClick={() => openSettings("profile")}>
              <Settings className="w-4 h-4 mr-2" />Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {[
            { label: "Stories Posted", value: stats.storiesPosted, Icon: MessageCircle, color: "text-blue-400" },
            { label: "Support Given", value: stats.supportGiven, Icon: Heart, color: "text-pink-400" },
            { label: "Diary Entries", value: stats.diaryEntries, Icon: BookOpen, color: "text-green-400" },
            { label: "Days Active", value: stats.daysActive, Icon: Calendar, color: "text-purple-400" },
          ].map(({ label, value, Icon, color }) => (
            <Card key={label} className="bg-slate-900 border-slate-700">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs md:text-sm">{label}</p>
                    <p className="text-xl md:text-2xl font-bold text-white">{value}</p>
                  </div>
                  <Icon className={`w-6 h-6 md:w-8 md:h-8 ${color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts */}
          <Card className="bg-slate-900 border-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-amber-400" />Alerts &amp; Notifications</span>
                <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">{alerts.length} new</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.length === 0 && (
                <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />You're all caught up.
                </div>
              )}
              {alerts.map((a) => {
                const Icon = alertIcon(a.type);
                return (
                  <div key={a.id} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg">
                    <Icon className={`w-4 h-4 mt-0.5 ${alertColor(a.type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm truncate">{a.text}</p>
                      <p className="text-xs text-slate-500">{new Date(a.at).toLocaleString()}</p>
                    </div>
                    {a.status && <Badge className="bg-slate-700 text-slate-200 text-[10px]">{a.status}</Badge>}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick actions */}
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
              <Button onClick={handleSoulConnect} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                <Sparkles className="w-4 h-4 mr-2" />Soul Connect
              </Button>
              <Button onClick={handleGetSupport} variant="outline" className="w-full border-slate-600 text-slate-200 hover:bg-slate-800">
                <Heart className="w-4 h-4 mr-2" />Get Support
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Recent activity */}
          <Card className="bg-slate-900 border-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.length === 0 && <p className="text-slate-400 text-sm">No activity yet — try sharing a story or writing in your diary.</p>}
              {activity.map((a, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-slate-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-slate-300 text-sm">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account snapshot */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader><CardTitle className="text-white flex items-center"><User className="w-5 h-5 mr-2 text-purple-400" />Account</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-slate-400">Username</span><span className="text-slate-200">{user.username}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Email</span><span className="text-slate-200 truncate max-w-[160px]">{user.email}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Role</span><Badge className="bg-slate-700 text-slate-200">{user.role}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Verified</span>{user.isVerified ? <Badge className="bg-green-500/20 text-green-400">Yes</Badge> : <Badge className="bg-slate-700 text-slate-300">No</Badge>}</div>
              <div className="border-t border-slate-800 pt-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">Your activity stays anonymous to the community.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UserSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        initialTab={settingsTab}
      />
    </div>
  );
};

export default UserDashboard;
