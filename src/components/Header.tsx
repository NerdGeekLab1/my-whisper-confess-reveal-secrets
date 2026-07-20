import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Heart, MessageCircle, Search, BookOpen, User, LogOut, Shield, Star, Sparkles, Menu } from "lucide-react";
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
}: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { key: "confessions", label: "Confessions", icon: MessageCircle, gate: null },
    { key: "search", label: "Partner Check", icon: Search, gate: "access partner check" },
    { key: "loyalty-score", label: "Loyalty Score", icon: Star, gate: "access loyalty score tool" },
    { key: "diary", label: "My Diary", icon: BookOpen, gate: "access your diary" },
    { key: "helpline", label: "Support", icon: Heart, gate: null },
  ];

  const go = (key: string, gate: string | null) => {
    if (gate && !handleRestrictedAction(gate)) return;
    setCurrentPage(key);
    setMobileOpen(false);
  };

  const goSoul = () => {
    window.location.assign("/soul-connect");
    setMobileOpen(false);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            onClick={() => setCurrentPage("confessions")}
          >
            <img src={snakesListLogo.url} alt="SnakesList logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]" />
            <div className="leading-tight">
              <h1 className="text-lg font-bold text-white tracking-wide">SnakesList</h1>
              <p className="text-[10px] text-slate-400 hidden md:block">Hidden truths. Shared strength.</p>
            </div>
          </div>

          {/* Desktop nav (xl+) */}
          <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center min-w-0">
            {navItems.map(({ key, label, icon: Icon, gate }) => (
              <Button
                key={key}
                variant="ghost"
                onClick={() => go(key, gate)}
                size="sm"
                className={`h-9 px-2.5 text-sm whitespace-nowrap ${currentPage === key ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {label}
              </Button>
            ))}
            <Button variant="ghost" onClick={goSoul} size="sm" className="h-9 px-2.5 text-sm text-pink-300 hover:text-white hover:bg-pink-900/30 whitespace-nowrap">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Soul Connect
            </Button>
            {user && (
              <Button
                variant="ghost"
                onClick={() => setCurrentPage("dashboard")}
                size="sm"
                className={`h-9 px-2.5 text-sm whitespace-nowrap ${currentPage === "dashboard" ? "text-white bg-slate-800" : "text-slate-300 hover:text-white hover:bg-slate-800/60"}`}
              >
                {user.role === "admin" ? <Shield className="w-4 h-4 mr-1.5" /> : <User className="w-4 h-4 mr-1.5" />}
                {user.role === "admin" ? "Admin" : "Dashboard"}
              </Button>
            )}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <span className="hidden xl:inline text-sm text-slate-300 max-w-[120px] truncate">Hi, {user.username}</span>
                {user.role === "admin" && (
                  <Badge className="hidden xl:inline-flex bg-red-500/20 text-red-400 border-red-500/30">
                    <Shield className="w-3 h-3 mr-1" />Admin
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white h-9 w-9 p-0" aria-label="Log out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)} className="border-slate-600 text-slate-200 hover:bg-slate-800 h-9">
                <User className="w-4 h-4 mr-1.5" />Login
              </Button>
            )}

            {/* Mobile/Tablet menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="xl:hidden h-9 w-9 p-0 text-slate-200 hover:bg-slate-800" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-950 border-slate-800 text-white w-72">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-1">
                  {navItems.map(({ key, label, icon: Icon, gate }) => (
                    <Button
                      key={key}
                      variant="ghost"
                      onClick={() => go(key, gate)}
                      className={`justify-start ${currentPage === key ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60 hover:text-white"}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />{label}
                    </Button>
                  ))}
                  <Button variant="ghost" onClick={goSoul} className="justify-start text-pink-300 hover:bg-pink-900/30 hover:text-white">
                    <Sparkles className="w-4 h-4 mr-2" />Soul Connect
                  </Button>
                  {user && (
                    <Button
                      variant="ghost"
                      onClick={() => { setCurrentPage("dashboard"); setMobileOpen(false); }}
                      className={`justify-start ${currentPage === "dashboard" ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60 hover:text-white"}`}
                    >
                      {user.role === "admin" ? <Shield className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                      {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                    </Button>
                  )}
                  <div className="border-t border-slate-800 my-3" />
                  <Badge variant="outline" className="border-slate-600 text-slate-300 self-start">
                    <Shield className="w-3 h-3 mr-1" />100% Anonymous
                  </Badge>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
