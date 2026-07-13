import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Clock, TrendingUp, Lock, Loader2, ArrowDown, PenSquare } from "lucide-react";
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
  setShowPostCreator?: (show: boolean) => void;
}

type TabKey = "recent" | "trending" | "supported";
const PAGE_SIZE = 10;

interface FeedState {
  posts: any[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  page: number;
}

const initialFeed = (): FeedState => ({
  posts: [],
  loading: true,
  loadingMore: false,
  hasMore: true,
  page: 0,
});

const ConfessionsPage = ({
  user,
  selectedCategory,
  setSelectedCategory,
  setShowAuthModal,
  setCurrentPage,
  setShowPostCreator,
}: ConfessionsPageProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("recent");
  const [feeds, setFeeds] = useState<Record<TabKey, FeedState>>({
    recent: initialFeed(),
    trending: initialFeed(),
    supported: initialFeed(),
  });
  const topRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<Record<TabKey, boolean>>({
    recent: false,
    trending: false,
    supported: false,
  });

  // Build a query per tab. Range-based pagination keeps each ordering simple.
  const buildQuery = useCallback(
    (tab: TabKey, from: number, to: number) => {
      let q = supabase.from("posts").select("*", { count: "exact" }).range(from, to);
      if (selectedCategory !== "all") q = q.eq("category", selectedCategory);

      if (tab === "trending") {
        // Last 7 days, most recent first — reflects current activity.
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        q = q.gte("created_at", since).order("created_at", { ascending: false });
      } else if (tab === "supported") {
        // Least-reported first, then oldest enduring posts the community kept.
        q = q
          .order("reports_count", { ascending: true })
          .order("created_at", { ascending: true });
      } else {
        q = q.order("created_at", { ascending: false });
      }
      return q;
    },
    [selectedCategory]
  );

  const fetchTab = useCallback(
    async (tab: TabKey, page: number) => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await buildQuery(tab, from, to);
      if (error) {
        console.warn("posts fetch error", error);
        return [];
      }
      return data ?? [];
    },
    [buildQuery]
  );

  const loadInitial = useCallback(
    async (tab: TabKey) => {
      setFeeds((f) => ({ ...f, [tab]: { ...initialFeed() } }));
      const data = await fetchTab(tab, 0);
      setFeeds((f) => ({
        ...f,
        [tab]: {
          posts: data,
          loading: false,
          loadingMore: false,
          hasMore: data.length === PAGE_SIZE,
          page: 0,
        },
      }));
    },
    [fetchTab]
  );

  const loadMore = useCallback(
    async (tab: TabKey) => {
      if (loadingRef.current[tab]) return;
      const current = feeds[tab];
      if (!current.hasMore || current.loading) return;
      loadingRef.current[tab] = true;
      setFeeds((f) => ({ ...f, [tab]: { ...f[tab], loadingMore: true } }));
      const nextPage = current.page + 1;
      const data = await fetchTab(tab, nextPage);
      setFeeds((f) => {
        const seen = new Set(f[tab].posts.map((p) => p.id));
        const fresh = data.filter((p: any) => !seen.has(p.id));
        return {
          ...f,
          [tab]: {
            posts: [...f[tab].posts, ...fresh],
            loading: false,
            loadingMore: false,
            hasMore: data.length === PAGE_SIZE,
            page: nextPage,
          },
        };
      });
      loadingRef.current[tab] = false;
    },
    [fetchTab, feeds]
  );

  // Reload active tab when category or tab changes
  useEffect(() => {
    loadInitial(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, activeTab]);

  // Infinite scroll via IntersectionObserver on the sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore(activeTab);
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab, loadMore]);

  // Realtime: prepend new approved posts to the recent tab
  useEffect(() => {
    const channel = supabase
      .channel("posts-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const p = payload.new as any;
          if (!p?.id) return;
          const matchesCategory =
            selectedCategory === "all" || p.category === selectedCategory;
          const isVisible =
            p.status === "approved" || (user && p.user_id === user.id);
          if (!matchesCategory || !isVisible) return;

          setFeeds((f) => {
            if (f.recent.posts.some((x) => x.id === p.id)) return f;
            return {
              ...f,
              recent: { ...f.recent, posts: [p, ...f.recent.posts] },
            };
          });
          toast("New confession posted", {
            description: p.title || "A new story was shared.",
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCategory, user]);

  const mapPost = (p: any) => ({
    id: p.id as string,
    title: p.title,
    content: p.content,
    category: p.category || "other",
    timeAgo: p.created_at ? new Date(p.created_at).toLocaleDateString() : "recently",
    isVerified: false,
    tags: [],
    user_id: p.user_id,
    status: p.status,
  });

  const removePost = (id: string) => {
    setFeeds((f) => {
      const next: any = { ...f };
      (Object.keys(f) as TabKey[]).forEach((k) => {
        next[k] = { ...f[k], posts: f[k].posts.filter((p: any) => p.id !== id) };
      });
      return next;
    });
  };

  const renderFeed = (tab: TabKey) => {
    const state = feeds[tab];
    if (state.loading) {
      return (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      );
    }
    if (state.posts.length === 0) {
      return (
        <p className="text-center text-slate-400 py-8">
          {tab === "trending"
            ? "No trending confessions in the last 7 days."
            : tab === "supported"
            ? "No supported confessions yet."
            : "No confessions yet. Be the first to share your story."}
        </p>
      );
    }
    return (
      <>
        {state.posts.map((p) => (
          <ConfessionCard key={p.id} confession={mapPost(p)} onDeleted={removePost} />
        ))}
        <div ref={sentinelRef} className="h-1" />
        {state.loadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
        )}
        {state.hasMore && !state.loadingMore && (
          <div className="flex justify-center mt-2">
            <Button
              variant="outline"
              onClick={() => loadMore(tab)}
              className="border-slate-600 text-slate-300"
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              Load more
            </Button>
          </div>
        )}
        {!state.hasMore && (
          <p className="text-center text-slate-500 text-sm mt-6">
            You've reached the end of the feed.
          </p>
        )}
      </>
    );
  };

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
                  <p className="text-amber-300 text-sm">
                    Create an account to post confessions, access your diary, and search our database.
                  </p>
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

        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          {user && setShowPostCreator && (
            <Button
              onClick={() => setShowPostCreator(true)}
              className="shrink-0 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
            >
              <PenSquare className="w-4 h-4 mr-2" />
              Share Your Story
            </Button>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabKey)}
          className="mb-8"
        >
          <TabsList data-testid="sort-buttons" className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
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
            {renderFeed("recent")}
          </TabsContent>
          <TabsContent value="trending" className="space-y-6 mt-6">
            {renderFeed("trending")}
          </TabsContent>
          <TabsContent value="supported" className="space-y-6 mt-6">
            {renderFeed("supported")}
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-1">
        <Sidebar setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default ConfessionsPage;
