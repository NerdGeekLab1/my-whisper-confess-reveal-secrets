
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  AlertTriangle, 
  Shield, 
  Search,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Activity
} from "lucide-react";

interface AdminDashboardProps {
  user: any;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data for demo
  const adminStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalPosts: 3456,
    pendingReports: 12,
    flaggedContent: 8,
    newUsersToday: 23
  };

  const mockUsers = [
    { id: 1, username: "anonymous_user_001", email: "user1@email.com", status: "active", joinDate: "2024-06-10", posts: 12, reports: 0 },
    { id: 2, username: "truth_seeker_92", email: "user2@email.com", status: "active", joinDate: "2024-06-08", posts: 8, reports: 1 },
    { id: 3, username: "support_giver", email: "user3@email.com", status: "suspended", joinDate: "2024-06-05", posts: 25, reports: 3 },
    { id: 4, username: "diary_writer", email: "user4@email.com", status: "active", joinDate: "2024-06-12", posts: 5, reports: 0 },
  ];

  const mockPosts = [
    { id: 1, title: "Anonymous confession about betrayal", author: "anonymous_user_001", date: "2024-06-16", status: "published", reports: 0, category: "relationship" },
    { id: 2, title: "Need support for depression", author: "truth_seeker_92", date: "2024-06-15", status: "flagged", reports: 2, category: "mental-health" },
    { id: 3, title: "Work harassment experience", author: "support_giver", date: "2024-06-14", status: "under-review", reports: 1, category: "workplace" },
    { id: 4, title: "Family issues and support needed", author: "diary_writer", date: "2024-06-13", status: "published", reports: 0, category: "family" },
  ];

  const mockReports = [
    { id: 1, postId: 2, reporter: "user_reporter_1", reason: "Inappropriate content", date: "2024-06-16", status: "pending" },
    { id: 2, postId: 3, reporter: "user_reporter_2", reason: "Harassment", date: "2024-06-15", status: "investigating" },
    { id: 3, postId: 2, reporter: "user_reporter_3", reason: "Spam", date: "2024-06-14", status: "resolved" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-red-400" />
                Admin Dashboard
              </h1>
              <p className="text-slate-400">Welcome back, {user.username} - Platform Administrator</p>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{adminStats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">{adminStats.activeUsers}</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{adminStats.totalPosts}</p>
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
                  <p className="text-2xl font-bold text-white">{adminStats.pendingReports}</p>
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
                  <p className="text-2xl font-bold text-white">{adminStats.flaggedContent}</p>
                </div>
                <Ban className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">New Today</p>
                  <p className="text-2xl font-bold text-white">{adminStats.newUsersToday}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:text-white">
              User Management
            </TabsTrigger>
            <TabsTrigger value="content" className="text-slate-300 data-[state=active]:text-white">
              Content Inventory
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-slate-300 data-[state=active]:text-white">
              Reports & Moderation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                    Platform Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Daily Active Users</span>
                    <span className="text-white font-bold">892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Posts Today</span>
                    <span className="text-white font-bold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Support Interactions</span>
                    <span className="text-white font-bold">234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Crisis Interventions</span>
                    <span className="text-white font-bold">12</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm font-medium">High-risk depression detected</p>
                    <p className="text-slate-400 text-xs">User needs immediate attention - 2 hours ago</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-400 text-sm font-medium">Multiple reports on content</p>
                    <p className="text-slate-400 text-xs">Post flagged for review - 4 hours ago</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 text-sm font-medium">New user verification needed</p>
                    <p className="text-slate-400 text-xs">Pending account approval - 6 hours ago</p>
                  </div>
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
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">User ID</TableHead>
                      <TableHead className="text-slate-300">Username</TableHead>
                      <TableHead className="text-slate-300">Email</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Join Date</TableHead>
                      <TableHead className="text-slate-300">Posts</TableHead>
                      <TableHead className="text-slate-300">Reports</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-700">
                        <TableCell className="text-slate-300">{user.id}</TableCell>
                        <TableCell className="text-white">{user.username}</TableCell>
                        <TableCell className="text-slate-300">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{user.joinDate}</TableCell>
                        <TableCell className="text-slate-300">{user.posts}</TableCell>
                        <TableCell className="text-slate-300">{user.reports}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Ban className="w-3 h-3" />
                            </Button>
                          </div>
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
              <CardHeader>
                <CardTitle className="text-white">Content Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Post ID</TableHead>
                      <TableHead className="text-slate-300">Title</TableHead>
                      <TableHead className="text-slate-300">Author</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Category</TableHead>
                      <TableHead className="text-slate-300">Reports</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPosts.map((post) => (
                      <TableRow key={post.id} className="border-slate-700">
                        <TableCell className="text-slate-300">{post.id}</TableCell>
                        <TableCell className="text-white max-w-xs truncate">{post.title}</TableCell>
                        <TableCell className="text-slate-300">{post.author}</TableCell>
                        <TableCell className="text-slate-300">{post.date}</TableCell>
                        <TableCell>
                          <Badge className={
                            post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                            post.status === 'flagged' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }>
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300">{post.category}</TableCell>
                        <TableCell className="text-slate-300">{post.reports}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Reports & Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Report ID</TableHead>
                      <TableHead className="text-slate-300">Post ID</TableHead>
                      <TableHead className="text-slate-300">Reporter</TableHead>
                      <TableHead className="text-slate-300">Reason</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReports.map((report) => (
                      <TableRow key={report.id} className="border-slate-700">
                        <TableCell className="text-slate-300">{report.id}</TableCell>
                        <TableCell className="text-slate-300">{report.postId}</TableCell>
                        <TableCell className="text-slate-300">{report.reporter}</TableCell>
                        <TableCell className="text-white">{report.reason}</TableCell>
                        <TableCell className="text-slate-300">{report.date}</TableCell>
                        <TableCell>
                          <Badge className={
                            report.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                            report.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                              <Ban className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
