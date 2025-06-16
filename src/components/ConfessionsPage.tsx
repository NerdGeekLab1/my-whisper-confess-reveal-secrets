
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Clock, TrendingUp, Lock } from "lucide-react";
import CommunityStats from "@/components/CommunityStats";
import CategoryFilter from "@/components/CategoryFilter";
import ConfessionCard from "@/components/ConfessionCard";
import Sidebar from "@/components/Sidebar";

interface ConfessionsPageProps {
  user: any;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setShowAuthModal: (show: boolean) => void;
  setCurrentPage: (page: string) => void;
}

const ConfessionsPage = ({
  user,
  selectedCategory,
  setSelectedCategory,
  setShowAuthModal,
  setCurrentPage
}: ConfessionsPageProps) => {
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
        <Sidebar setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default ConfessionsPage;
