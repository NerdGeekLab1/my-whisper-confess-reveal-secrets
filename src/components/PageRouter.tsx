
import ConfessionsPage from "@/components/ConfessionsPage";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import CulpritSearch from "@/components/CulpritSearch";
import AnonymousDiary from "@/components/AnonymousDiary";
import DepressionHelpline from "@/components/DepressionHelpline";
import DepressionAnalyzer from "@/components/DepressionAnalyzer";

interface PageRouterProps {
  currentPage: string;
  user: any;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setShowAuthModal: (show: boolean) => void;
  setCurrentPage: (page: string) => void;
  handleRestrictedAction: (action: string) => boolean;
}

const PageRouter = ({
  currentPage,
  user,
  selectedCategory,
  setSelectedCategory,
  setShowAuthModal,
  setCurrentPage,
  handleRestrictedAction
}: PageRouterProps) => {
  switch (currentPage) {
    case "dashboard":
      return user ? (
        user.role === "admin" ? <AdminDashboard user={user} /> : <UserDashboard user={user} />
      ) : null;
    case "search":
      if (!handleRestrictedAction("search for people")) return null;
      return <CulpritSearch />;
    case "diary":
      if (!handleRestrictedAction("access your private diary")) return null;
      return <AnonymousDiary />;
    case "helpline":
      return <DepressionHelpline />;
    case "depression-analyzer":
      return <DepressionAnalyzer />;
    default:
      return (
        <ConfessionsPage
          user={user}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setShowAuthModal={setShowAuthModal}
          setCurrentPage={setCurrentPage}
        />
      );
  }
};

export default PageRouter;
