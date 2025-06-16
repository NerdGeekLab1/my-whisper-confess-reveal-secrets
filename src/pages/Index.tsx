
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Shield, Users, Eye, Clock, TrendingUp, Search, BookOpen, User, LogOut, Lock } from "lucide-react";
import PostCreator from "@/components/PostCreator";
import ConfessionCard from "@/components/ConfessionCard";
import CategoryFilter from "@/components/CategoryFilter";
import CommunityStats from "@/components/CommunityStats";
import CulpritSearch from "@/components/CulpritSearch";
import AnonymousDiary from "@/components/AnonymousDiary";
import DepressionHelpline from "@/components/DepressionHelpline";
import DepressionAnalyzer from "@/components/DepressionAnalyzer";
import UserDashboard from "@/components/UserDashboard";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [currentPage, setCurrentPage] = useState("confessions");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  // Sample confession data
  const confessions = [
    {
      id: 1,
      title: "Found out after 3 years together...",
      content: "I discovered screenshots on their phone. Multiple dating apps, secret conversations. The lies were so elaborate. I'm sharing this because I need to feel less alone.",
      category: "long-term",
      timeAgo: "2 hours ago",
      reactions: { support: 127, shocked: 89, similar: 43 },
      comments: 23,
      isVerified: true,
      tags: ["dating-apps", "long-relationship", "evidence"]
    },
    {
      id: 2,
      title: "Wedding was next month...",
      content: "Bachelor party photos revealed everything. The person I trusted most betrayed me weeks before our wedding. Sharing the story and evidence to warn others about the signs I missed.",
      category: "engagement",
      timeAgo: "5 hours ago",
      reactions: { support: 234, shocked: 156, similar: 67 },
      comments: 45,
      isVerified: true,
      tags: ["wedding", "bachelor-party", "warning"]
    },
    {
      id: 3,
      title: "Mutual friends knew and said nothing",
      content: "The betrayal wasn't just from my partner. Our entire friend group knew and stayed silent. Sometimes the community betrayal hurts more than the romantic one.",
      category: "friends",
      timeAgo: "1 day ago",
      reactions: { support: 178, shocked: 92, similar: 89 },
      comments: 31,
      isVerified: false,
      tags: ["friends", "community", "silence"]
    }
  ];

  const filteredConfessions = selectedCategory === "all" 
    ? confessions 
    : confessions.filter(c => c.category === selectedCategory);

  const handleAuth = (userData: any) => {
    setUser(userData);
    toast({
      title: "Welcome to TruthSpace!",
      description: "You can now access all features including posting and your private diary.",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("confessions");
    toast({
      title: "Logged out",
      description: "You've been safely logged out. Your anonymity remains protected.",
    });
  };

  const handleRestrictedAction = (action: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: `Please login to ${action}. All activities remain anonymous to the community.`,
        variant: "destructive"
      });
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return user ? <UserDashboard user={user} /> : null;
      case "search":
        if (!handleRestrictedAction("search for people")) return null;
        return <CulpritSearch />;
      case "diary":
        if (!handleRestrictedAction("access your private diary")) return null;
        return <AnonymousDiary />;
      case "helpline":
        return <DepressionHelpline />;
      case "depression-analyzer":
        return <DepressionAnalyzer />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Community Stats */}
              <CommunityStats />

              {/* Login Notice for Non-Users */}
              {!user && (
                <Card className="bg-amber-900/50 border-amber-600 mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-amber-200 font-medium">Login to unlock all features</p>
                        <p className="text-amber-300 text-sm">Create an account to post confessions, access your diary, and search our database.</p>
                      </div>
                      <Button 
                        onClick={() => setShowAuthModal(true)}
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Login Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Categories and Filters */}
              <div className="mb-8">
                <CategoryFilter 
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* Content Tabs */}
              <Tabs defaultValue="recent" className="mb-8">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
                  <TabsTrigger value="recent" className="text-slate-300 data-[state=active]:text-white">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="text-slate-300 data-[state=active]:text-white">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="supported" className="text-slate-300 data-[state=active]:text-white">
                    <Heart className="w-4 h-4 mr-2" />
                    Most Supported
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-6 mt-6">
                  {filteredConfessions.map((confession) => (
                    <ConfessionCard key={confession.id} confession={confession} />
                  ))}
                </TabsContent>

                <TabsContent value="trending" className="space-y-6 mt-6">
                  {filteredConfessions
                    .sort((a, b) => (b.reactions.support + b.reactions.shocked + b.reactions.similar) - (a.reactions.support + a.reactions.shocked + a.reactions.similar))
                    .map((confession) => (
                      <ConfessionCard key={confession.id} confession={confession} />
                    ))}
                </TabsContent>

                <TabsContent value="supported" className="space-y-6 mt-6">
                  {filteredConfessions
                    .sort((a, b) => b.reactions.support - a.reactions.support)
                    .map((confession) => (
                      <ConfessionCard key={confession.id} confession={confession} />
                    ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-24">
                {/* Community Guidelines */}
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-400" />
                      Safe Space Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-300 space-y-2">
                    <p>• Complete anonymity guaranteed</p>
                    <p>• No personal attacks or harassment</p>
                    <p>• Support, don't judge</p>
                    <p>• Verify claims when possible</p>
                    <p>• Respect privacy boundaries</p>
                  </CardContent>
                </Card>

                {/* Support Resources */}
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-400" />
                      Support Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-300 space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
                      onClick={() => setCurrentPage("helpline")}
                    >
                      Crisis Support Chat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
                      onClick={() => setCurrentPage("depression-analyzer")}
                    >
                      AI Depression Analyzer
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800">
                      Legal Advice
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Community */}
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-400" />
                      Live Community
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-300">
                    <div className="flex items-center justify-between mb-2">
                      <span>Active now</span>
                      <Badge className="bg-green-500/20 text-green-400">1,247</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Stories today</span>
                      <Badge className="bg-blue-500/20 text-blue-400">89</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support given</span>
                      <Badge className="bg-pink-500/20 text-pink-400">2,156</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TruthSpace</h1>
                <p className="text-sm text-slate-400">Anonymous confessions & support</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage("confessions")}
                className={currentPage === "confessions" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Confessions
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (handleRestrictedAction("access partner check")) {
                    setCurrentPage("search");
                  }
                }}
                className={currentPage === "search" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
              >
                <Search className="w-4 h-4 mr-2" />
                Partner Check
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (handleRestrictedAction("access your diary")) {
                    setCurrentPage("diary");
                  }
                }}
                className={currentPage === "diary" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                My Diary
              </Button>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage("helpline")}
                className={currentPage === "helpline" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
              >
                <Heart className="w-4 h-4 mr-2" />
                Support
              </Button>
              {user && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage("dashboard")}
                  className={currentPage === "dashboard" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                <Shield className="w-3 h-3 mr-1" />
                100% Anonymous
              </Badge>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-300">Welcome, {user.username}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}

              {(currentPage === "confessions" && user) && (
                <Button 
                  onClick={() => setShowPostCreator(true)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  Share Your Story
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {renderCurrentPage()}
      </div>

      <Footer />

      {/* Post Creator Modal */}
      {showPostCreator && user && (
        <PostCreator onClose={() => setShowPostCreator(false)} />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuth}
      />
    </div>
  );
};

export default Index;
