
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Search, BookOpen, User, LogOut, Shield, Star } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: any;
  handleLogout: () => void;
  handleRestrictedAction: (action: string) => boolean;
  setShowAuthModal: (show: boolean) => void;
  setShowPostCreator: (show: boolean) => void;
}

const Header = ({
  currentPage,
  setCurrentPage,
  user,
  handleLogout,
  handleRestrictedAction,
  setShowAuthModal,
  setShowPostCreator
}: HeaderProps) => {
  const handleBrandClick = () => {
    setCurrentPage("confessions");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleBrandClick}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">TruthSpace</h1>
              <p className="text-sm text-slate-400">Anonymous confessions & support</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentPage("confessions")}
              className={currentPage === "confessions" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Confessions
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (handleRestrictedAction("access partner check")) {
                  setCurrentPage("search");
                }
              }}
              className={currentPage === "search" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
            >
              <Search className="w-4 h-4 mr-2" />
              Partner Check
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (handleRestrictedAction("access loyalty score tool")) {
                  setCurrentPage("loyalty-score");
                }
              }}
              className={currentPage === "loyalty-score" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
            >
              <Star className="w-4 h-4 mr-2" />
              Loyalty Score
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (handleRestrictedAction("access your diary")) {
                  setCurrentPage("diary");
                }
              }}
              className={currentPage === "diary" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Diary
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentPage("helpline")}
              className={currentPage === "helpline" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
            >
              <Heart className="w-4 h-4 mr-2" />
              Support
            </Button>
            {user && (
              <Button
                variant="ghost"
                onClick={() => setCurrentPage("dashboard")}
                className={currentPage === "dashboard" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white"}
              >
                {user.role === "admin" ? (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              <Shield className="w-3 h-3 mr-1" />
              100% Anonymous
            </Badge>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-300">Welcome, {user.username}</span>
                  {user.role === "admin" && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}

            {(currentPage === "confessions" && user) && (
              <Button 
                onClick={() => setShowPostCreator(true)}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              >
                Share Your Story
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
