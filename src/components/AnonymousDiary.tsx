
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Lock, Globe, Plus, Heart, Star, Calendar } from "lucide-react";

interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  date: string;
  mood: string;
  isPublic: boolean;
  category: "affirmation" | "plan" | "fantasy" | "story" | "reflection";
  likes?: number;
}

const AnonymousDiary = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: 1,
      title: "Daily Affirmations",
      content: "I am worthy of love and respect. Today I choose to forgive myself and move forward with confidence.",
      date: "2024-06-16",
      mood: "hopeful",
      isPublic: false,
      category: "affirmation"
    },
    {
      id: 2,
      title: "Future Plans",
      content: "Planning to start therapy next month. Also considering moving to a new city for a fresh start.",
      date: "2024-06-15",
      mood: "determined",
      isPublic: false,
      category: "plan"
    }
  ]);

  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "",
    category: "reflection" as DiaryEntry["category"],
    isPublic: false
  });

  const handleSaveEntry = () => {
    const entry: DiaryEntry = {
      id: Date.now(),
      title: newEntry.title,
      content: newEntry.content,
      date: new Date().toISOString().split('T')[0],
      mood: newEntry.mood,
      isPublic: newEntry.isPublic,
      category: newEntry.category,
      likes: newEntry.isPublic ? 0 : undefined
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      title: "",
      content: "",
      mood: "",
      category: "reflection",
      isPublic: false
    });
    setShowNewEntry(false);
  };

  const togglePublic = (id: number) => {
    setEntries(entries.map(entry => 
      entry.id === id 
        ? { ...entry, isPublic: !entry.isPublic, likes: !entry.isPublic ? 0 : undefined }
        : entry
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "affirmation": return "bg-green-500/20 text-green-400";
      case "plan": return "bg-blue-500/20 text-blue-400";
      case "fantasy": return "bg-purple-500/20 text-purple-400";
      case "story": return "bg-orange-500/20 text-orange-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "happy": return "text-yellow-400";
      case "sad": return "text-blue-400";
      case "angry": return "text-red-400";
      case "hopeful": return "text-green-400";
      case "determined": return "text-purple-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            Anonymous Diary
          </h1>
          <p className="text-slate-400">Your private space for thoughts, plans, and healing</p>
        </div>

        {/* New Entry Button */}
        <div className="mb-6">
          <Button 
            onClick={() => setShowNewEntry(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>

        {/* New Entry Form */}
        {showNewEntry && (
          <Card className="bg-slate-900 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Write New Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Title</label>
                <Input
                  placeholder="Entry title"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Category</label>
                  <select 
                    value={newEntry.category}
                    onChange={(e) => setNewEntry({...newEntry, category: e.target.value as DiaryEntry["category"]})}
                    className="w-full h-10 rounded-md border border-slate-600 bg-slate-800 text-white px-3"
                  >
                    <option value="reflection">Reflection</option>
                    <option value="affirmation">Affirmation</option>
                    <option value="plan">Plan</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="story">Story</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Current Mood</label>
                  <Input
                    placeholder="How are you feeling?"
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Content</label>
                <Textarea
                  placeholder="Write your thoughts..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white min-h-32"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newEntry.isPublic}
                  onChange={(e) => setNewEntry({...newEntry, isPublic: e.target.checked})}
                  className="rounded border-slate-600"
                />
                <label htmlFor="isPublic" className="text-sm text-slate-400">
                  Make this entry public (share with community)
                </label>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleSaveEntry} className="bg-purple-600 hover:bg-purple-700">
                  Save Entry
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewEntry(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diary Entries */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="bg-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                      <Badge className={getCategoryColor(entry.category)}>
                        {entry.category}
                      </Badge>
                      {entry.isPublic ? (
                        <Badge className="bg-blue-500/20 text-blue-400">
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-500/20 text-slate-400">
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {entry.date}
                      </span>
                      {entry.mood && (
                        <span className={`flex items-center ${getMoodColor(entry.mood)}`}>
                          <Star className="w-3 h-3 mr-1" />
                          {entry.mood}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed mb-4">{entry.content}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center space-x-4">
                    {entry.isPublic && entry.likes !== undefined && (
                      <span className="flex items-center text-slate-400">
                        <Heart className="w-4 h-4 mr-1" />
                        {entry.likes} likes
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublic(entry.id)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    {entry.isPublic ? "Make Private" : "Make Public"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnonymousDiary;
