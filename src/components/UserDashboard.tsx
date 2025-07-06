
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  MessageCircle, 
  BookOpen, 
  Heart, 
  Eye, 
  TrendingUp, 
  Calendar,
  Shield,
  Settings,
  Bell,
  Star
} from "lucide-react";

interface UserDashboardProps {
  user: any;
  setCurrentPage?: (page: string) => void;
  setShowPostCreator?: (show: boolean) => void;
}

const UserDashboard = ({ user, setCurrentPage, setShowPostCreator }: UserDashboardProps) => {
  const [notifications, setNotifications] = useState(3);

  const userStats = {
    storiesPosted: 5,
    supportGiven: 23,
    diaryEntries: 12,
    daysActive: 28
  };

  const recentActivity = [
    { type: "confession", title: "Your confession received 15 new support reactions", time: "2 hours ago" },
    { type: "diary", title: "Daily reflection entry saved", time: "1 day ago" },
    { type: "support", title: "You supported 3 community members", time: "2 days ago" },
  ];

  const handleShareStory = () => {
    if (setShowPostCreator) {
      setShowPostCreator(true);
    }
  };

  const handleWriteDiary = () => {
    if (setCurrentPage) {
      setCurrentPage("diary");
    }
  };

  const handleGetSupport = () => {
    if (setCurrentPage) {
      setCurrentPage("helpline");
    }
  };

  const handleLoyaltyScore = () => {
    if (setCurrentPage) {
      setCurrentPage("loyalty-score");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.username}
              </h1>
              <p className="text-slate-400">Your safe space for healing and truth</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Bell className="w-4 h-4 mr-2" />
                {notifications} New
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Stories Posted</p>
                  <p className="text-2xl font-bold text-white">{userStats.storiesPosted}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Support Given</p>
                  <p className="text-2xl font-bold text-white">{userStats.supportGiven}</p>
                </div>
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Diary Entries</p>
                  <p className="text-2xl font-bold text-white">{userStats.diaryEntries}</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Days Active</p>
                  <p className="text-2xl font-bold text-white">{userStats.daysActive}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-slate-300">{activity.title}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleShareStory}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Share New Story
                </Button>
                <Button 
                  onClick={handleWriteDiary}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Write in Diary
                </Button>
                <Button 
                  onClick={handleLoyaltyScore}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Test Loyalty Score
                </Button>
                <Button 
                  onClick={handleGetSupport}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Get Support
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Reminder */}
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
    </div>
  );
};

export default UserDashboard;
