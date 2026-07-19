
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Search, BookOpen, User, LogOut, Shield, Star, Sparkles } from "lucide-react";
import snakesListLogo from "@/assets/snakeslist-logo.png.asset.json";

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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            onClick={handleBrandClick}
          >
            <img src={snakesListLogo.url} alt="SnakesList logo" className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]" />
            <div className="leading-tight">
              <h1 className="text-xl font-bold text-white tracking-wide">SnakesList</h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">Hidden truths. Shared strength.</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center min-w-0">
            <Button
              variant="ghost"
              onClick={() => setCurrentPage("confessions")}
              size="sm" className={`h-9 px-2.5 text-sm ${currentPage === "confessions" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
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
              size="sm" className={`h-9 px-2.5 text-sm ${currentPage === "search" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
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
              size="sm" className={`h-9 px-2.5 text-sm ${currentPage === "loyalty-score" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
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
              size="sm" className={`h-9 px-2.5 text-sm ${currentPage === "diary" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Diary
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.assign("/soul-connect")}
              size="sm" className="h-9 px-2.5 text-sm text-pink-300 hover:text-white hover:bg-pink-900/30"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Soul Connect
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentPage("helpline")}
              size="sm" className={`h-9 px-2.5 text-sm ${currentPage === "helpline" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
            >
              <Heart className="w-4 h-4 mr-2" />
              Support
            </Button>
            {user && (
              <Button
                variant="ghost"
                onClick={() => setCurrentPage("dashboard")}
                size="sm" className={`h-9 px-2.5 text-sm ${currentPage === "dashboard" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
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

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="hidden xl:inline-flex border-slate-600 text-slate-300">
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

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
