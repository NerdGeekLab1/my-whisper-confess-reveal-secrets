
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, MessageCircle, AlertTriangle, Shield, Search, Eye, Trash2, Ban,
  CheckCircle, Clock, BarChart3, TrendingUp, Activity, Loader2, ChevronLeft, ChevronRight, Settings, ScrollText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminConfiguration from "@/components/AdminConfiguration";
import AdminAuditLog from "@/components/AdminAuditLog";
import ReviewReportModal from "@/components/ReviewReportModal";
import { logAdminAction } from "@/lib/adminAudit";

interface AdminDashboardProps {
  user: any;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [postPage, setPostPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [reviewReportId, setReviewReportId] = useState<string | null>(null);
  const [reportStatusFilter, setReportStatusFilter] = useState<"all" | "pending" | "investigating" | "resolved" | "dismissed">("pending");
  const [postStatusFilter, setPostStatusFilter] = useState<"all" | "approved" | "pending" | "flagged">("all");
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchAll = async () => {
      const [profilesRes, postsRes, reportsRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("posts").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(postPage * ITEMS_PER_PAGE, (postPage + 1) * ITEMS_PER_PAGE - 1),
        supabase.from("reports").select("*").order("created_at", { ascending: false }),
      ]);
      if (profilesRes.data) setProfiles(profilesRes.data);
      if (postsRes.data) setPosts(postsRes.data);
      if (postsRes.count !== null) setTotalPosts(postsRes.count);
      if (reportsRes.data) setReports(reportsRes.data);
      setLoading(false);
    };
    fetchAll();
  }, [postPage]);

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      await logAdminAction({
        actionType: "post_delete",
        targetTable: "posts",
        targetId: postId,
        summary: `Deleted post ${postId.slice(0, 8)}`,
      });
      setPosts(posts.filter(p => p.id !== postId));
      toast({ title: "Post deleted" });
    }
  };

  const handleUpdatePostStatus = async (postId: string, status: string) => {
    const { error } = await supabase.from("posts").update({ status }).eq("id", postId);
    if (!error) {
      await logAdminAction({
        actionType: "post_status_update",
        targetTable: "posts",
        targetId: postId,
        summary: `Set post ${postId.slice(0, 8)} to ${status}`,
        metadata: { status },
      });
      setPosts(posts.map(p => p.id === postId ? { ...p, status } : p));
      toast({ title: `Post ${status}` });
    }
  };

  const filteredProfiles = profiles.filter(p =>
    (p.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-red-400" />Admin Dashboard
              </h1>
              <p className="text-slate-400">Welcome back, {user.username} - Platform Administrator</p>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <Shield className="w-3 h-3 mr-1" />Admin Access
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{profiles.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{posts.length}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Reports</p>
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.status === 'pending').length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Flagged Content</p>
                  <p className="text-2xl font-bold text-white">{posts.filter(p => p.status === 'flagged').length}</p>
                </div>
                <Ban className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:text-white">Users</TabsTrigger>
            <TabsTrigger value="content" className="text-slate-300 data-[state=active]:text-white">Content</TabsTrigger>
            <TabsTrigger value="reports" className="text-slate-300 data-[state=active]:text-white">Reports</TabsTrigger>
            <TabsTrigger value="audit" className="text-slate-300 data-[state=active]:text-white">
              <ScrollText className="w-4 h-4 mr-1" />Audit Log
            </TabsTrigger>
            <TabsTrigger value="config" className="text-slate-300 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-1" />Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />Platform Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Users</span>
                    <span className="text-white font-bold">{profiles.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Posts</span>
                    <span className="text-white font-bold">{posts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Approved Posts</span>
                    <span className="text-white font-bold">{posts.filter(p => p.status === 'approved').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Open Reports</span>
                    <span className="text-white font-bold">{reports.filter(r => r.status === 'pending').length}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reports.slice(0, 3).map((report) => (
                    <div key={report.id} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-yellow-400 text-sm font-medium">{report.reason}</p>
                      <p className="text-slate-400 text-xs">Status: {report.status}</p>
                    </div>
                  ))}
                  {reports.length === 0 && <p className="text-slate-400 text-sm">No reports yet.</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white max-w-sm" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Username</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Verified</TableHead>
                      <TableHead className="text-slate-300">Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.map((profile) => (
                      <TableRow key={profile.id} className="border-slate-700">
                        <TableCell className="text-white">{profile.username || "—"}</TableCell>
                        <TableCell className="text-slate-300">{profile.email || "—"}</TableCell>
                        <TableCell>
                          <Badge className={profile.is_verified ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}>
                            {profile.is_verified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {profile.joined_date ? new Date(profile.joined_date).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader><CardTitle className="text-white">Content Inventory</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Title</TableHead>
                      <TableHead className="text-slate-300">Category</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id} className="border-slate-700">
                        <TableCell className="text-white max-w-xs truncate">{post.title}</TableCell>
                        <TableCell className="text-slate-300">{post.category || "—"}</TableCell>
                        <TableCell>
                          <Badge className={
                            post.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            post.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }>{post.status}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {post.created_at ? new Date(post.created_at).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {post.status !== 'approved' && (
                              <Button size="sm" variant="outline" className="border-green-600 text-green-400"
                                onClick={() => handleUpdatePostStatus(post.id, 'approved')}>
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="border-red-600 text-red-400"
                              onClick={() => handleDeletePost(post.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {Math.ceil(totalPosts / ITEMS_PER_PAGE) > 1 && (
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <Button variant="outline" size="sm" disabled={postPage === 0} onClick={() => setPostPage(p => p - 1)} className="border-slate-600 text-slate-300">
                      <ChevronLeft className="w-4 h-4 mr-1" />Previous
                    </Button>
                    <span className="text-slate-400 text-sm">Page {postPage + 1} of {Math.ceil(totalPosts / ITEMS_PER_PAGE)}</span>
                    <Button variant="outline" size="sm" disabled={postPage >= Math.ceil(totalPosts / ITEMS_PER_PAGE) - 1} onClick={() => setPostPage(p => p + 1)} className="border-slate-600 text-slate-300">
                      Next<ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Reports & Moderation</CardTitle>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs text-slate-400 mr-1">Resolution:</span>
                  {(["pending", "investigating", "resolved", "dismissed", "all"] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={reportStatusFilter === s ? "default" : "outline"}
                      className={reportStatusFilter === s
                        ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                        : "border-slate-600 text-slate-300 hover:text-white"}
                      onClick={() => setReportStatusFilter(s)}
                    >
                      {s === "pending" ? "Unresolved"
                        : s === "investigating" ? "Investigating"
                        : s === "resolved" ? "Approved"
                        : s === "dismissed" ? "Denied"
                        : "All"}
                      {" "}
                      <span className="ml-1 opacity-70">
                        ({s === "all" ? reports.length : reports.filter(r => r.status === s).length})
                      </span>
                    </Button>
                  ))}
                  <span className="text-xs text-slate-400 ml-4 mr-1">Post status:</span>
                  {(["all", "approved", "pending", "flagged"] as const).map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={postStatusFilter === s ? "default" : "outline"}
                      className={postStatusFilter === s
                        ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                        : "border-slate-600 text-slate-300 hover:text-white"}
                      onClick={() => setPostStatusFilter(s)}
                    >
                      {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Reason</TableHead>
                      <TableHead className="text-slate-300">Post ID</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports
                      .filter(r => reportStatusFilter === "all" ? true : r.status === reportStatusFilter)
                      .filter(r => {
                        if (postStatusFilter === "all") return true;
                        const p = posts.find(x => x.id === r.post_id);
                        return p?.status === postStatusFilter;
                      })
                      .map((report) => (
                      <TableRow key={report.id} className="border-slate-700">
                        <TableCell className="text-white max-w-xs truncate">{report.reason}</TableCell>
                        <TableCell className="text-slate-300 text-xs">{report.post_id?.slice(0, 8) || "—"}</TableCell>
                        <TableCell className="text-slate-300">
                          {report.created_at ? new Date(report.created_at).toLocaleDateString() : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            report.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                            report.status === 'dismissed' ? 'bg-slate-500/20 text-slate-300' :
                            report.status === 'investigating' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }>{report.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {report.status === 'pending' || report.status === 'investigating' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-600 text-blue-400"
                              onClick={() => setReviewReportId(report.id)}
                            >
                              <Eye className="w-3 h-3 mr-1" />Review
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-400 hover:text-white"
                              onClick={() => setReviewReportId(report.id)}
                            >
                              <Eye className="w-3 h-3 mr-1" />View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {reports.filter(r => reportStatusFilter === "all" ? true : r.status === reportStatusFilter).length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-slate-400 py-6">No reports match the current filters.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <AdminConfiguration />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AdminAuditLog />
          </TabsContent>
        </Tabs>

        <ReviewReportModal
          reportId={reviewReportId}
          open={!!reviewReportId}
          onClose={() => setReviewReportId(null)}
          onResolved={(id) => {
            setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
