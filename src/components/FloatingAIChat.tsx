import { Bot, Sparkles } from "lucide-react";

interface FloatingAIChatProps {
  currentPage: string;
  onOpen: () => void;
}

/**
 * Floating action button that launches the AI Support Chat.
 * Sits bottom-right on every page and animates gently to draw attention
 * without cluttering the main navigation.
 */
const FloatingAIChat = ({ currentPage, onOpen }: FloatingAIChatProps) => {
  if (currentPage === "ai-chat") return null;

  return (
    <button
      onClick={onOpen}
      aria-label="Open AI support chat"
      data-testid="floating-ai-chat"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2"
    >
      {/* Pulsing halo */}
      <span className="absolute inset-0 rounded-full bg-purple-500/40 blur-xl animate-pulse pointer-events-none" />
      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-60 blur-md animate-ping pointer-events-none" />

      {/* Label pill (desktop only) */}
      <span className="hidden md:inline-flex relative -mr-2 items-center gap-1.5 rounded-full bg-slate-900/90 border border-purple-500/40 px-3 py-1.5 text-xs font-medium text-purple-200 shadow-lg backdrop-blur-sm opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
        Talk to EVA / ADAM
      </span>

      {/* Main button */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-white shadow-[0_10px_40px_-5px_rgba(168,85,247,0.6)] ring-2 ring-white/10 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
        <Bot className="w-6 h-6" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-slate-950 animate-pulse" />
      </span>
    </button>
  );
};

export default FloatingAIChat;
