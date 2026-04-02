
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Clock, TrendingUp, Lock, Loader2 } from "lucide-react";
import CommunityStats from "@/components/CommunityStats";
import CategoryFilter from "@/components/CategoryFilter";
import ConfessionCard from "@/components/ConfessionCard";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";

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
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setDbPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Sample fallback data + DB posts combined
  const sampleConfessions = [
    {
      id: "sample-1",
      title: "Found out after 3 years together...",
      content: "I discovered screenshots on their phone. Multiple dating apps, secret conversations. The lies were so elaborate.",
      category: "long-term",
      timeAgo: "2 hours ago",
      reactions: { support: 127, shocked: 89, similar: 43 },
      comments: 23,
      isVerified: true,
      tags: ["dating-apps", "long-relationship", "evidence"]
    },
    {
      id: "sample-2",
      title: "Wedding was next month...",
      content: "Bachelor party photos revealed everything. The person I trusted most betrayed me weeks before our wedding.",
      category: "engagement",
      timeAgo: "5 hours ago",
      reactions: { support: 234, shocked: 156, similar: 67 },
      comments: 45,
      isVerified: true,
      tags: ["wedding", "bachelor-party", "warning"]
    },
    {
      id: "sample-3",
      title: "Mutual friends knew and said nothing",
      content: "The betrayal wasn't just from my partner. Our entire friend group knew and stayed silent.",
      category: "friends",
      timeAgo: "1 day ago",
      reactions: { support: 178, shocked: 92, similar: 89 },
      comments: 31,
      isVerified: false,
      tags: ["friends", "community", "silence"]
    }
  ];

  const dbConfessions = dbPosts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    category: p.category || "other",
    timeAgo: p.created_at ? new Date(p.created_at).toLocaleDateString() : "recently",
    reactions: { support: 0, shocked: 0, similar: 0 },
    comments: 0,
    isVerified: false,
    tags: []
  }));

  const confessions = [...dbConfessions, ...sampleConfessions];

  const filteredConfessions = selectedCategory === "all"
    ? confessions
    : confessions.filter(c => c.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3">
        <CommunityStats />

        {!user && (
          <Card className="bg-amber-900/50 border-amber-600 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-amber-200 font-medium">Login to unlock all features</p>
                  <p className="text-amber-300 text-sm">Create an account to post confessions, access your diary, and search our database.</p>
                </div>
                <Button onClick={() => setShowAuthModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white">
                  Login Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-8">
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="recent" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
              <TabsTrigger value="recent" className="text-slate-300 data-[state=active]:text-white">
                <Clock className="w-4 h-4 mr-2" />Recent
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-slate-300 data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />Trending
              </TabsTrigger>
              <TabsTrigger value="supported" className="text-slate-300 data-[state=active]:text-white">
                <Heart className="w-4 h-4 mr-2" />Most Supported
              </TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="space-y-6 mt-6">
              {filteredConfessions.map((confession) => (
                <ConfessionCard key={confession.id} confession={confession} />
              ))}
            </TabsContent>
            <TabsContent value="trending" className="space-y-6 mt-6">
              {filteredConfessions.map((confession) => (
                <ConfessionCard key={confession.id} confession={confession} />
              ))}
            </TabsContent>
            <TabsContent value="supported" className="space-y-6 mt-6">
              {filteredConfessions.map((confession) => (
                <ConfessionCard key={confession.id} confession={confession} />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <div className="lg:col-span-1">
        <Sidebar setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default ConfessionsPage;
