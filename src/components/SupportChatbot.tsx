import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2, Heart, Shield, RefreshCw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

interface SupportChatbotProps {
  user?: any;
}

const SupportChatbot = ({ user }: SupportChatbotProps) => {
  const [persona, setPersona] = useState<"eva" | "adam" | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Heuristic suggestion: pair opposite-gender companion (Eva for male, Adam for female)
  const suggestedPersona: "eva" | "adam" | null = (() => {
    const g = (user?.gender || user?.user_metadata?.gender || "").toString().toLowerCase();
    if (g.startsWith("m")) return "eva";
    if (g.startsWith("f") || g.startsWith("w")) return "adam";
    return null;
  })();

  const startChat = (selectedPersona: "eva" | "adam") => {
    setPersona(selectedPersona);
    setMessages([]);
    // Send initial greeting
    streamChat([], selectedPersona, "Hi, I'd like to talk.");
  };

  const streamChat = async (history: Msg[], chatPersona: string, userMessage: string) => {
    const userMsg: Msg = { role: "user", content: userMessage };
    const newHistory = [...history, userMsg];
    setMessages(newHistory);
    setIsLoading(true);
    setInput("");

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newHistory,
          persona: chatPersona,
          userMeta: {
            nickname: user?.username || user?.user_metadata?.username || user?.email?.split("@")[0] || null,
            gender: user?.gender || user?.user_metadata?.gender || null,
          },
        }),
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to connect to AI");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "assistant", content: `I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 💙` }]);
    }

    setIsLoading(false);
  };

  const handleSend = () => {
    if (!input.trim() || isLoading || !persona) return;
    streamChat(messages, persona, input.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setPersona(null);
    setMessages([]);
    setInput("");
  };

  // Persona selection screen
  if (!persona) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">AI Support Chat</h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Talk to our AI companions about anything on your mind. They're here to listen, support, and guide you through tough times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {suggestedPersona && (
              <p className="md:col-span-2 text-center text-sm text-purple-300/80 -mt-2">
                ✨ Based on your profile, we'd suggest <strong className="text-white">{suggestedPersona === "eva" ? "EVA" : "ADAM"}</strong> — but pick whoever feels right.
              </p>
            )}
            {/* EVA Card */}
            <Card 
              className="bg-gradient-to-br from-purple-900/40 to-pink-900/30 border-purple-500/30 cursor-pointer hover:border-purple-400/60 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
              onClick={() => startChat("eva")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">EVA</h2>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 mb-4">Female Companion</Badge>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Warm, nurturing, and deeply empathetic. EVA creates a gentle safe space where you can share anything without judgment.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-purple-300 border-purple-500/30 text-xs">Emotional Support</Badge>
                  <Badge variant="outline" className="text-purple-300 border-purple-500/30 text-xs">Relationship Guidance</Badge>
                  <Badge variant="outline" className="text-purple-300 border-purple-500/30 text-xs">Mental Wellness</Badge>
                </div>
              </CardContent>
            </Card>

            {/* ADAM Card */}
            <Card 
              className="bg-gradient-to-br from-blue-900/40 to-cyan-900/30 border-blue-500/30 cursor-pointer hover:border-blue-400/60 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
              onClick={() => startChat("adam")}
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">ADAM</h2>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/40 mb-4">Male Companion</Badge>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Calm, protective, and understanding. ADAM offers honest perspective with genuine care, creating a safe haven for your thoughts.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="text-blue-300 border-blue-500/30 text-xs">Honest Guidance</Badge>
                  <Badge variant="outline" className="text-blue-300 border-blue-500/30 text-xs">Strength Building</Badge>
                  <Badge variant="outline" className="text-blue-300 border-blue-500/30 text-xs">Crisis Support</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 max-w-xl mx-auto">
              <p className="text-slate-400 text-sm">
                <Shield className="w-4 h-4 inline mr-1 text-green-400" />
                Your conversations are private and not stored. If you're in crisis, please call <strong className="text-white">988</strong> (Suicide & Crisis Lifeline).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat interface
  const isEva = persona === "eva";
  const gradientFrom = isEva ? "from-purple-500" : "from-blue-500";
  const gradientTo = isEva ? "to-pink-500" : "to-cyan-500";
  const accentBg = isEva ? "bg-purple-500/20" : "bg-blue-500/20";
  const accentText = isEva ? "text-purple-300" : "text-blue-300";
  const accentBorder = isEva ? "border-purple-500/30" : "border-blue-500/30";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="container mx-auto max-w-3xl h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center`}>
              {isEva ? <Heart className="w-5 h-5 text-white" /> : <Shield className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{isEva ? "EVA" : "ADAM"}</h2>
              <p className="text-xs text-slate-400">{isEva ? "Emotional Support Companion" : "Supportive Guide Companion"}</p>
            </div>
            <Badge className={`${accentBg} ${accentText} ${accentBorder}`}>
              <Bot className="w-3 h-3 mr-1" />AI Powered
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={resetChat} className="text-slate-400 hover:text-white">
            <RefreshCw className="w-4 h-4 mr-1" />Switch
          </Button>
        </div>

        {/* Messages */}
        <Card className="flex-1 bg-slate-900/80 border-slate-700 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.filter(m => !(m.role === "user" && m.content === "Hi, I'd like to talk.")).map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user" 
                      ? "bg-slate-700 text-white rounded-br-sm" 
                      : `${accentBg} ${accentText} rounded-bl-sm border ${accentBorder}`
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className={`${accentBg} ${accentText} rounded-2xl rounded-bl-sm px-4 py-3 border ${accentBorder}`}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex space-x-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Talk to ${isEva ? "EVA" : "ADAM"}...`}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 resize-none min-h-[44px] max-h-[120px]"
                rows={1}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:opacity-90 px-4`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              AI companion for emotional support. Not a substitute for professional help.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupportChatbot;
