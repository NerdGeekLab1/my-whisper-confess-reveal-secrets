
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Shield, Users, Eye, Clock, TrendingUp } from "lucide-react";
import PostCreator from "@/components/PostCreator";
import ConfessionCard from "@/components/ConfessionCard";
import CategoryFilter from "@/components/CategoryFilter";
import CommunityStats from "@/components/CommunityStats";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPostCreator, setShowPostCreator] = useState(false);

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
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                <Shield className="w-3 h-3 mr-1" />
                100% Anonymous
              </Badge>
              <Button 
                onClick={() => setShowPostCreator(true)}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                Share Your Story
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Community Stats */}
            <CommunityStats />

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
                  <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800">
                    Crisis Support Chat
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800">
                    Therapy Resources
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
      </div>

      {/* Post Creator Modal */}
      {showPostCreator && (
        <PostCreator onClose={() => setShowPostCreator(false)} />
      )}
    </div>
  );
};

export default Index;
