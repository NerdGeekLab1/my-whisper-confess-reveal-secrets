
import { useState } from "react";
import Header from "@/components/Header";
import PageRouter from "@/components/PageRouter";
import Footer from "@/components/Footer";
import PostCreator from "@/components/PostCreator";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPostCreator, setShowPostCreator] = useState(false);
  const [currentPage, setCurrentPage] = useState("confessions");

  const {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    handleAuth,
    handleLogout,
    handleRestrictedAction
  } = useAuth();

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        user={user}
        handleLogout={handleLogout}
        handleRestrictedAction={handleRestrictedAction}
        setShowAuthModal={setShowAuthModal}
        setShowPostCreator={setShowPostCreator}
      />

      <div className="container mx-auto px-4 py-8">
        <PageRouter
          currentPage={currentPage}
          user={user}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setShowAuthModal={setShowAuthModal}
          setCurrentPage={setCurrentPage}
          handleRestrictedAction={handleRestrictedAction}
        />
      </div>

      <Footer />

      {/* Post Creator Modal */}
      {showPostCreator && user && (
        <PostCreator onClose={() => setShowPostCreator(false)} />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Index;
