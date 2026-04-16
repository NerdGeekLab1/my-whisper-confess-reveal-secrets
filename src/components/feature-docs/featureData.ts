import { Brain, Heart, Shield, BookOpen, Search, Users } from "lucide-react";

export const features = [
  {
    category: "AI-Powered Features",
    icon: Brain,
    color: "text-purple-400",
    items: [
      { name: "Sentiment Analysis", description: "Real AI-powered analysis using Gemini to detect crisis situations and emotional distress", status: "Implemented", location: "Edge Function: ai-sentiment", usage: "Integrated with post creation and viewing" },
      { name: "AI Content Moderation", description: "Real-time AI content filtering for harmful or inappropriate posts", status: "Implemented", location: "Edge Function: ai-sentiment", usage: "Automatic background processing" },
      { name: "EVA Support Chatbot", description: "Female AI companion for emotional support with streaming responses", status: "Implemented", location: "src/components/SupportChatbot.tsx", usage: "AI Chat navigation" },
      { name: "ADAM Support Chatbot", description: "Male AI companion for emotional support with streaming responses", status: "Implemented", location: "src/components/SupportChatbot.tsx", usage: "AI Chat navigation" },
      { name: "Mood Pattern Analysis", description: "Tracks and analyzes user mood patterns over time using AI", status: "Implemented", location: "src/services/moodTrackingService.ts", usage: "Available in mood tracker component" }
    ]
  },
  {
    category: "Enhanced User Experience",
    icon: Heart,
    color: "text-pink-400",
    items: [
      { name: "Post Reactions System", description: "Support, relate, encourage, insightful, and healing reactions for posts", status: "Implemented", location: "src/components/PostReactions.tsx", usage: "Available on all confession cards" },
      { name: "Auto-visible Own Posts", description: "Users can see their own posts immediately, even while pending review", status: "Implemented", location: "Database RLS policy", usage: "Automatic on confessions page" },
      { name: "Paginated Feeds", description: "All data lists use pagination to handle unlimited growth", status: "Implemented", location: "ConfessionsPage & AdminDashboard", usage: "Automatic pagination controls" },
      { name: "Commenting System", description: "Threaded comments and replies for community interaction", status: "Planned", location: "To be implemented", usage: "Will be added to confession cards" },
      { name: "Dark/Light Mode", description: "Theme toggle for user preference", status: "Planned", location: "To be implemented", usage: "Header toggle button" }
    ]
  },
  {
    category: "Safety & Moderation",
    icon: Shield,
    color: "text-red-400",
    items: [
      { name: "Community Reporting", description: "Report system with escalation workflow for inappropriate content", status: "Implemented", location: "Database reports table", usage: "Report buttons on posts" },
      { name: "Automated Flagging", description: "AI-powered content flagging for harmful or crisis content", status: "Implemented", location: "Edge Function: ai-sentiment", usage: "Automatic background processing" },
      { name: "Moderator Dashboard", description: "Admin interface with pagination for reviewing flagged content and reports", status: "Implemented", location: "src/components/AdminDashboard.tsx", usage: "Admin role access" },
      { name: "Crisis Detection", description: "Automatic detection of crisis situations with resource display", status: "Implemented", location: "Edge Function: ai-sentiment", usage: "Real-time crisis intervention" }
    ]
  },
  {
    category: "Personal Tools",
    icon: BookOpen,
    color: "text-green-400",
    items: [
      { name: "Private Journal", description: "Personal diary with mood tracking capabilities", status: "Implemented", location: "src/components/AnonymousDiary.tsx", usage: "Accessible from user dashboard" },
      { name: "Mood Tracker", description: "Daily mood logging with pattern analysis and insights", status: "Implemented", location: "src/components/MoodTracker.tsx", usage: "Dedicated mood tracking page" },
      { name: "Partner Loyalty Score", description: "Relationship assessment with persistent score history", status: "Implemented", location: "src/components/PartnerLoyaltyScore.tsx", usage: "Loyalty Score navigation" },
      { name: "Goal Setting", description: "Personal goal tracking and progress monitoring", status: "Planned", location: "To be implemented", usage: "Dashboard integration" }
    ]
  },
  {
    category: "Partner Background Check",
    icon: Search,
    color: "text-cyan-400",
    items: [
      { name: "Basic Search", description: "Search database for reported individuals using various filters", status: "Implemented", location: "src/components/CulpritSearch.tsx", usage: "Partner Check navigation" },
      { name: "Detailed View", description: "Comprehensive background reports with full information", status: "Implemented", location: "src/components/CulpritDetailView.tsx", usage: "View Details button in search results" },
      { name: "Risk Assessment", description: "Automated risk level calculation based on reports", status: "Implemented", location: "CulpritSearch component", usage: "Risk badges in search results" }
    ]
  },
  {
    category: "Community Features",
    icon: Users,
    color: "text-blue-400",
    items: [
      { name: "Anonymous Confessions", description: "Safe space for sharing personal experiences anonymously", status: "Implemented", location: "src/components/ConfessionsPage.tsx", usage: "Main application feature" },
      { name: "Support Groups", description: "Topic-based support communities", status: "Planned", location: "To be implemented", usage: "Community section" },
      { name: "Peer Matching", description: "Anonymous matching with similar experiences", status: "Planned", location: "To be implemented", usage: "Matchmaking system" },
      { name: "Achievement System", description: "Recognition for community support and engagement", status: "Planned", location: "To be implemented", usage: "User profile badges" }
    ]
  }
];
