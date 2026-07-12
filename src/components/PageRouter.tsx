
import ConfessionsPage from "@/components/ConfessionsPage";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import CulpritSearch from "@/components/CulpritSearch";
import AnonymousDiary from "@/components/AnonymousDiary";
import DepressionHelpline from "@/components/DepressionHelpline";
import DepressionAnalyzer from "@/components/DepressionAnalyzer";
import MoodTracker from "@/components/MoodTracker";
import PartnerLoyaltyScore from "@/components/PartnerLoyaltyScore";
import SupportChatbot from "@/components/SupportChatbot";

interface PageRouterProps {
  currentPage: string;
  user: any;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setShowAuthModal: (show: boolean) => void;
  setCurrentPage: (page: string) => void;
  setShowPostCreator?: (show: boolean) => void;
  handleRestrictedAction: (action: string) => boolean;
}

const PageRouter = ({
  currentPage,
  user,
  selectedCategory,
  setSelectedCategory,
  setShowAuthModal,
  setCurrentPage,
  setShowPostCreator,
  handleRestrictedAction
}: PageRouterProps) => {
  switch (currentPage) {
    case "dashboard":
      return user ? (
        user.role === "admin" ? (
          <AdminDashboard user={user} />
        ) : (
          <UserDashboard 
            user={user} 
            setCurrentPage={setCurrentPage}
            setShowPostCreator={setShowPostCreator}
          />
        )
      ) : null;
    case "search":
      if (!handleRestrictedAction("search for people")) return null;
      return <CulpritSearch />;
    case "loyalty-score":
      if (!handleRestrictedAction("access loyalty score tool")) return null;
      return <PartnerLoyaltyScore />;
    case "diary":
      if (!handleRestrictedAction("access your private diary")) return null;
      return <AnonymousDiary />;
    case "mood-tracker":
      if (!handleRestrictedAction("track your mood")) return null;
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Mood Tracker</h1>
              <p className="text-slate-400">Track your daily mood and discover patterns</p>
            </div>
            <MoodTracker />
          </div>
        </div>
      );
    case "helpline":
      return <DepressionHelpline />;
    case "depression-analyzer":
      return <DepressionAnalyzer />;
    case "ai-chat":
      if (!handleRestrictedAction("access AI support chat")) return null;
      return <SupportChatbot user={user} />;
    default:
      return (
        <ConfessionsPage
          user={user}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setShowAuthModal={setShowAuthModal}
          setCurrentPage={setCurrentPage}
          setShowPostCreator={setShowPostCreator}
        />
      );
  }
};

export default PageRouter;
