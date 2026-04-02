
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lock, Globe, Plus, Heart, Star, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DiaryEntry {
  id: string;
  title: string | null;
  content: string;
  created_at: string | null;
  mood: string | null;
  is_private: boolean | null;
}

const AnonymousDiary = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "", mood: "", isPublic: false });
  const { toast } = useToast();

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("diary_entries")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setEntries(data);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSaveEntry = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("diary_entries").insert({
      user_id: user.id,
      title: newEntry.title || null,
      content: newEntry.content,
      mood: newEntry.mood || null,
      is_private: !newEntry.isPublic,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Entry saved!", description: "Your diary entry has been saved." });
      setNewEntry({ title: "", content: "", mood: "", isPublic: false });
      setShowNewEntry(false);
      fetchEntries();
    }
  };

  const getMoodColor = (mood: string | null) => {
    switch (mood) {
      case "happy": return "text-yellow-400";
      case "sad": return "text-blue-400";
      case "angry": return "text-red-400";
      case "hopeful": return "text-green-400";
      case "determined": return "text-purple-400";
      default: return "text-slate-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />Anonymous Diary
          </h1>
          <p className="text-slate-400">Your private space for thoughts, plans, and healing</p>
        </div>

        <div className="mb-6">
          <Button onClick={() => setShowNewEntry(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Plus className="w-4 h-4 mr-2" />New Entry
          </Button>
        </div>

        {showNewEntry && (
          <Card className="bg-slate-900 border-slate-700 mb-6">
            <CardHeader><CardTitle className="text-white">Write New Entry</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Title</label>
                <Input placeholder="Entry title" value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Current Mood</label>
                <Input placeholder="How are you feeling?" value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Content</label>
                <Textarea placeholder="Write your thoughts..." value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white min-h-32" />
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleSaveEntry} className="bg-purple-600 hover:bg-purple-700">Save Entry</Button>
                <Button variant="outline" onClick={() => setShowNewEntry(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {entries.length === 0 && (
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No diary entries yet. Start writing your first entry!</p>
              </CardContent>
            </Card>
          )}
          {entries.map((entry) => (
            <Card key={entry.id} className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{entry.title || "Untitled"}</h3>
                      <Badge className="bg-slate-500/20 text-slate-400">
                        <Lock className="w-3 h-3 mr-1" />Private
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "Unknown"}
                      </span>
                      {entry.mood && (
                        <span className={`flex items-center ${getMoodColor(entry.mood)}`}>
                          <Star className="w-3 h-3 mr-1" />{entry.mood}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnonymousDiary;
