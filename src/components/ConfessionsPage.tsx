import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Clock, TrendingUp, Lock, Loader2, ArrowDown } from "lucide-react";
import CommunityStats from "@/components/CommunityStats";
import CategoryFilter from "@/components/CategoryFilter";
import ConfessionCard from "@/components/ConfessionCard";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface ConfessionsPageProps {
  user: any;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setShowAuthModal: (show: boolean) => void;
  setCurrentPage: (page: string) => void;
}

const PAGE_SIZE = 10;

const ConfessionsPage = ({
  user,
  selectedCategory,
  setSelectedCategory,
  setShowAuthModal,
  setCurrentPage,
}: ConfessionsPageProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const newestCreatedAtRef = useRef<string | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const topRef = useRef<HTMLDivElement | null>(null);
  // Buffer realtime inserts that arrive while the user is loading older pages,
  // so we don't shift the cursor / list mid-fetch.
  const pendingInsertsRef = useRef<any[]>([]);
  const loadingMoreRef = useRef(false);
  const [bufferedCount, setBufferedCount] = useState(0);

  // Cursor-based fetch: pass `before` (created_at) to load older items.
  const fetchPage = useCallback(
    async (before: string | null) => {
      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      if (before) {
        query = query.lt("created_at", before);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("posts fetch error", error);
        return [];
      }
      return data ?? [];
    },
    [selectedCategory]
  );

  const loadInitial = useCallback(async () => {
    setLoading(true);
    seenIdsRef.current = new Set();
    const data = await fetchPage(null);
    data.forEach((p: any) => seenIdsRef.current.add(p.id));
    setPosts(data);
    setHasMore(data.length === PAGE_SIZE);
    if (data[0]?.created_at) newestCreatedAtRef.current = data[0].created_at;
    setLoading(false);
  }, [fetchPage]);

  const flushBufferedInserts = useCallback(() => {
    if (pendingInsertsRef.current.length === 0) return;
    const buffered = pendingInsertsRef.current;
    pendingInsertsRef.current = [];
    setBufferedCount(0);
    setPosts((prev) => {
      const fresh = buffered.filter((p) => !prev.some((x) => x.id === p.id));
      fresh.forEach((p) => seenIdsRef.current.add(p.id));
      return [...fresh, ...prev];
    });
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMore) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const oldest = posts[posts.length - 1]?.created_at ?? null;
    const data = await fetchPage(oldest);
    const fresh = data.filter((p: any) => !seenIdsRef.current.has(p.id));
    fresh.forEach((p: any) => seenIdsRef.current.add(p.id));
    setPosts((prev) => [...prev, ...fresh]);
    setHasMore(data.length === PAGE_SIZE);
    setLoadingMore(false);
    loadingMoreRef.current = false;
    // Now that pagination settled, merge any inserts that arrived during the fetch
    flushBufferedInserts();
  }, [fetchPage, hasMore, posts, flushBufferedInserts]);

  // Reload from top when category changes
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const scrollToTop = useCallback(async () => {
    await loadInitial();
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [loadInitial]);

  // Realtime: prepend new approved posts and toast
  useEffect(() => {
    const channel = supabase
      .channel("posts-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const p = payload.new as any;
          if (!p?.id || seenIdsRef.current.has(p.id)) return;

          const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
          const isVisible = p.status === "approved" || (user && p.user_id === user.id);
          if (!matchesCategory || !isVisible) return;

          seenIdsRef.current.add(p.id);
          if (p.created_at) newestCreatedAtRef.current = p.created_at;

          // If user is loading older pages, buffer the insert to avoid shifting the cursor.
          if (loadingMoreRef.current) {
            pendingInsertsRef.current = [p, ...pendingInsertsRef.current];
            setBufferedCount(pendingInsertsRef.current.length);
            toast("New confession posted", {
              description: "Will appear after older posts finish loading.",
            });
            return;
          }

          // Prepend so the new item is reachable as the user scrolls or via "View".
          setPosts((prev) => [p, ...prev]);

          toast("New confession posted", {
            description: p.title || "A new story was shared with the community.",
            action: {
              label: "View",
              onClick: () => {
                topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              },
            },
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCategory, user]);

  const confessions = posts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    category: p.category || "other",
    timeAgo: p.created_at ? new Date(p.created_at).toLocaleDateString() : "recently",
    reactions: { support: 0, shocked: 0, similar: 0 },
    comments: 0,
    isVerified: false,
    tags: [],
    status: p.status,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3" ref={topRef}>
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

        {bufferedCount > 0 && (
          <div className="flex justify-center mb-4">
            <Button
              onClick={() => {
                flushBufferedInserts();
                topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
              size="sm"
            >
              ↑ Show {bufferedCount} new {bufferedCount === 1 ? "confession" : "confessions"}
            </Button>
          </div>
        )}

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
                ) : (
                  confessions.map((c) => <ConfessionCard key={c.id} confession={c} />)
                )}
              </TabsContent>
              <TabsContent value="trending" className="space-y-6 mt-6">
                {confessions.map((c) => <ConfessionCard key={c.id} confession={c} />)}
              </TabsContent>
              <TabsContent value="supported" className="space-y-6 mt-6">
                {confessions.map((c) => <ConfessionCard key={c.id} confession={c} />)}
              </TabsContent>
            </Tabs>

            {/* Cursor pagination — Load more */}
            {hasMore && confessions.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="border-slate-600 text-slate-300"
                >
                  {loadingMore ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading...</>
                  ) : (
                    <><ArrowDown className="w-4 h-4 mr-2" />Load older confessions</>
                  )}
                </Button>
              </div>
            )}
            {!hasMore && confessions.length > 0 && (
              <p className="text-center text-slate-500 text-sm mt-6">You've reached the end of the feed.</p>
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
