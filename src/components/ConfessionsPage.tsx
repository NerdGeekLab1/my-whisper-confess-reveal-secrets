import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Clock, TrendingUp, Lock, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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

const POSTS_PER_PAGE = 10;

const ConfessionsPage = ({
  user,
  selectedCategory,
  setSelectedCategory,
  setShowAuthModal,
  setCurrentPage
}: ConfessionsPageProps) => {
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const from = page * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (selectedCategory !== "all") {
      query = query.eq("category", selectedCategory);
    }

    const { data, count } = await query;
    if (data) setDbPosts(data);
    if (count !== null) setTotalCount(count);
    setLoading(false);
  }, [page, selectedCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setPage(0);
  }, [selectedCategory]);

  // Realtime: refetch when posts change
  useEffect(() => {
    const channel = supabase
      .channel("posts-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => { fetchPosts(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const confessions = dbPosts.map(p => ({
    id: p.id,
    title: p.title,
    content: p.content,
    category: p.category || "other",
    timeAgo: p.created_at ? new Date(p.created_at).toLocaleDateString() : "recently",
    reactions: { support: 0, shocked: 0, similar: 0 },
    comments: 0,
    isVerified: false,
    tags: [],
    status: p.status
  }));

  const totalPages = Math.max(1, Math.ceil(totalCount / POSTS_PER_PAGE));

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
          <>
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
                {confessions.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No confessions yet. Be the first to share your story.</p>
                ) : confessions.map((confession) => (
                  <ConfessionCard key={confession.id} confession={confession} />
                ))}
              </TabsContent>
              <TabsContent value="trending" className="space-y-6 mt-6">
                {confessions.map((confession) => (
                  <ConfessionCard key={confession.id} confession={confession} />
                ))}
              </TabsContent>
              <TabsContent value="supported" className="space-y-6 mt-6">
                {confessions.map((confession) => (
                  <ConfessionCard key={confession.id} confession={confession} />
                ))}
              </TabsContent>
            </Tabs>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="border-slate-600 text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />Previous
                </Button>
                <span className="text-slate-400 text-sm">
                  Page {page + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="border-slate-600 text-slate-300"
                >
                  Next<ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="lg:col-span-1">
        <Sidebar setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default ConfessionsPage;
