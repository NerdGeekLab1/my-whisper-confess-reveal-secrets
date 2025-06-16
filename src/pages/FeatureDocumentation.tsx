
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  MessageCircle, 
  Heart, 
  Shield, 
  Search, 
  BookOpen, 
  TrendingUp, 
  Users,
  Zap,
  Eye,
  Bell,
  Settings,
  Smartphone,
  Lock,
  Flag,
  CheckCircle
} from "lucide-react";

const FeatureDocumentation = () => {
  const features = [
    {
      category: "AI-Powered Features",
      icon: Brain,
      color: "text-purple-400",
      items: [
        {
          name: "Sentiment Analysis",
          description: "Automatically analyzes posts to detect crisis situations and emotional distress",
          status: "Implemented",
          location: "src/services/aiSentimentService.ts",
          usage: "Integrated with post creation and viewing"
        },
        {
          name: "AI Content Moderation",
          description: "Detects harmful content and flags inappropriate posts automatically",
          status: "Implemented",
          location: "src/services/aiSentimentService.ts",
          usage: "Real-time content filtering"
        },
        {
          name: "Resource Recommendations",
          description: "Provides automated suggestions for mental health resources based on post content",
          status: "Implemented",
          location: "src/services/aiSentimentService.ts",
          usage: "Displays contextual help resources"
        },
        {
          name: "Mood Pattern Analysis",
          description: "Tracks and analyzes user mood patterns over time using AI",
          status: "Implemented",
          location: "src/services/moodTrackingService.ts",
          usage: "Available in mood tracker component"
        }
      ]
    },
    {
      category: "Enhanced User Experience",
      icon: Heart,
      color: "text-pink-400",
      items: [
        {
          name: "Post Reactions System",
          description: "Support, relate, encourage, insightful, and healing reactions for posts",
          status: "Implemented",
          location: "src/components/PostReactions.tsx",
          usage: "Available on all confession cards"
        },
        {
          name: "Commenting System",
          description: "Threaded comments and replies for community interaction",
          status: "Planned",
          location: "To be implemented",
          usage: "Will be added to confession cards"
        },
        {
          name: "Content Filtering",
          description: "Filter content by severity levels and trigger warnings",
          status: "Planned",
          location: "To be implemented",
          usage: "Filter options in main feed"
        },
        {
          name: "Dark/Light Mode",
          description: "Theme toggle for user preference",
          status: "Planned",
          location: "To be implemented",
          usage: "Header toggle button"
        },
        {
          name: "Mobile PWA",
          description: "Progressive Web App capabilities for mobile experience",
          status: "Planned",
          location: "To be implemented",
          usage: "Automatic mobile optimization"
        }
      ]
    },
    {
      category: "Safety & Moderation",
      icon: Shield,
      color: "text-red-400",
      items: [
        {
          name: "Community Reporting",
          description: "Report system with escalation workflow for inappropriate content",
          status: "Basic Implementation",
          location: "Database reports table",
          usage: "Report buttons on posts"
        },
        {
          name: "Automated Flagging",
          description: "AI-powered content flagging for harmful or crisis content",
          status: "Implemented",
          location: "src/services/aiSentimentService.ts",
          usage: "Automatic background processing"
        },
        {
          name: "Moderator Dashboard",
          description: "Admin interface for reviewing flagged content and reports",
          status: "Basic Implementation",
          location: "src/components/AdminDashboard.tsx",
          usage: "Admin role access"
        },
        {
          name: "Crisis Detection",
          description: "Automatic detection of crisis situations with resource display",
          status: "Implemented",
          location: "src/services/aiSentimentService.ts",
          usage: "Real-time crisis intervention"
        }
      ]
    },
    {
      category: "Personal Tools",
      icon: BookOpen,
      color: "text-green-400",
      items: [
        {
          name: "Private Journal",
          description: "Personal diary with mood tracking capabilities",
          status: "Implemented",
          location: "src/components/AnonymousDiary.tsx",
          usage: "Accessible from user dashboard"
        },
        {
          name: "Mood Tracker",
          description: "Daily mood logging with pattern analysis and insights",
          status: "Implemented",
          location: "src/components/MoodTracker.tsx",
          usage: "Dedicated mood tracking page"
        },
        {
          name: "Goal Setting",
          description: "Personal goal tracking and progress monitoring",
          status: "Planned",
          location: "To be implemented",
          usage: "Dashboard integration"
        },
        {
          name: "Reflection Prompts",
          description: "Guided reflection questions for personal growth",
          status: "Planned",
          location: "To be implemented",
          usage: "Daily prompts in diary"
        }
      ]
    },
    {
      category: "Partner Background Check",
      icon: Search,
      color: "text-cyan-400",
      items: [
        {
          name: "Basic Search",
          description: "Search database for reported individuals using various filters",
          status: "Implemented",
          location: "src/components/CulpritSearch.tsx",
          usage: "Partner Check navigation"
        },
        {
          name: "Detailed View",
          description: "Comprehensive background reports with full information",
          status: "Implemented",
          location: "src/components/CulpritDetailView.tsx",
          usage: "View Details button in search results"
        },
        {
          name: "Report Verification",
          description: "Multi-source verification of reported information",
          status: "Mock Implementation",
          location: "CulpritDetailView component",
          usage: "Verification status in detailed view"
        },
        {
          name: "Risk Assessment",
          description: "Automated risk level calculation based on reports",
          status: "Implemented",
          location: "CulpritSearch component",
          usage: "Risk badges in search results"
        }
      ]
    },
    {
      category: "Community Features",
      icon: Users,
      color: "text-blue-400",
      items: [
        {
          name: "Anonymous Confessions",
          description: "Safe space for sharing personal experiences anonymously",
          status: "Implemented",
          location: "src/components/ConfessionsPage.tsx",
          usage: "Main application feature"
        },
        {
          name: "Support Groups",
          description: "Topic-based support communities",
          status: "Planned",
          location: "To be implemented",
          usage: "Community section"
        },
        {
          name: "Peer Matching",
          description: "Anonymous matching with similar experiences",
          status: "Planned",
          location: "To be implemented",
          usage: "Matchmaking system"
        },
        {
          name: "Achievement System",
          description: "Recognition for community support and engagement",
          status: "Planned",
          location: "To be implemented",
          usage: "User profile badges"
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Implemented": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Basic Implementation": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "Mock Implementation": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "Planned": return "bg-gray-500/20 text-gray-400 border-gray-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">TruthSpace Feature Documentation</h1>
          <p className="text-slate-400 text-lg">
            Comprehensive guide to all implemented and planned features in the TruthSpace platform
          </p>
        </div>

        {/* Feature Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">15</div>
              <div className="text-sm text-slate-400">Implemented</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-4 text-center">
              <Settings className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-slate-400">Basic/Mock</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-4 text-center">
              <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-slate-400">Planned</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">30</div>
              <div className="text-sm text-slate-400">Total Features</div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Categories */}
        <div className="space-y-8">
          {features.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <Card key={categoryIndex} className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className={`text-2xl flex items-center ${category.color}`}>
                    <Icon className="w-6 h-6 mr-3" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{item.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Location: </span>
                            <code className="text-cyan-300">{item.location}</code>
                          </div>
                          <div>
                            <span className="text-slate-400">Usage: </span>
                            <span className="text-slate-300">{item.usage}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation Guide */}
        <Card className="bg-slate-900 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center">
              <Smartphone className="w-6 h-6 mr-3 text-green-400" />
              Navigation Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Main Features Access</h3>
                <ul className="space-y-2 text-slate-300">
                  <li><strong>Confessions:</strong> Main page - anonymous posting and viewing</li>
                  <li><strong>Partner Check:</strong> Header navigation - background verification</li>
                  <li><strong>My Diary:</strong> Header navigation - private journaling</li>
                  <li><strong>Support:</strong> Header navigation - crisis resources</li>
                  <li><strong>Dashboard:</strong> User profile and statistics</li>
                  <li><strong>Mood Tracker:</strong> Dashboard quick action or direct navigation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">User Roles & Access</h3>
                <ul className="space-y-2 text-slate-300">
                  <li><strong>Anonymous Users:</strong> View confessions, access support resources</li>
                  <li><strong>Registered Users:</strong> Post confessions, access diary, mood tracking</li>
                  <li><strong>Admin Users:</strong> Full moderation dashboard, user management</li>
                  <li><strong>Demo Credentials:</strong> user@demo.com / admin@demo.com (demo123)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation Notes */}
        <Card className="bg-slate-900 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center">
              <Lock className="w-6 h-6 mr-3 text-yellow-400" />
              Technical Implementation Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-slate-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Services</h3>
                <p>AI sentiment analysis and content moderation are implemented as mock services. In production, these would connect to OpenAI API for real sentiment analysis and content classification.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Database Structure</h3>
                <p>Current tables: profiles, posts, diary_entries, reports. Future expansions planned for mood_entries, chat_rooms, and support_groups.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Security & Privacy</h3>
                <p>All user data is protected with Row Level Security (RLS). Anonymous posting maintains user privacy while allowing content moderation.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureDocumentation;
