
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { moodTrackingService, MoodEntry, MoodPattern } from "@/services/moodTrackingService";

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(5);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [newEmotion, setNewEmotion] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [patterns, setPatterns] = useState<MoodPattern | null>(null);

  const emotionOptions = [
    "Happy", "Sad", "Angry", "Anxious", "Grateful", "Frustrated", 
    "Hopeful", "Lonely", "Excited", "Overwhelmed", "Peaceful", "Confused"
  ];

  const triggerOptions = [
    "Work stress", "Relationship issues", "Financial worry", "Health concerns",
    "Family problems", "Social media", "Weather", "Sleep issues", "Therapy session"
  ];

  const activityOptions = [
    "Exercise", "Meditation", "Reading", "Socializing", "Working", 
    "Therapy", "Journaling", "Music", "Art", "Nature walk"
  ];

  useEffect(() => {
    setRecentEntries(moodTrackingService.getMoodEntries(7));
    setPatterns(moodTrackingService.analyzeMoodPatterns(30));
  }, []);

  const handleSaveMood = () => {
    const entry = moodTrackingService.addMoodEntry({
      date: new Date().toISOString().split('T')[0],
      mood: currentMood,
      emotions,
      notes: notes || undefined,
      triggers: triggers.length > 0 ? triggers : undefined,
      activities: activities.length > 0 ? activities : undefined
    });

    setRecentEntries([entry, ...recentEntries.slice(0, 6)]);
    setPatterns(moodTrackingService.analyzeMoodPatterns(30));
    
    // Reset form
    setNotes("");
    setEmotions([]);
    setTriggers([]);
    setActivities([]);
  };

  const addItem = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
    if (item && !current.includes(item)) {
      setter([...current, item]);
    }
  };

  const removeItem = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => {
    setter(current.filter(i => i !== item));
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 7) return <Smile className="w-5 h-5 text-green-400" />;
    if (mood >= 4) return <Meh className="w-5 h-5 text-yellow-400" />;
    return <Frown className="w-5 h-5 text-red-400" />;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Today's Mood Entry */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Scale */}
          <div>
            <label className="text-sm text-slate-300 mb-3 block">Mood Scale (1-10)</label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-400">Terrible</span>
              <input
                type="range"
                min="1"
                max="10"
                value={currentMood}
                onChange={(e) => setCurrentMood(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-slate-400">Amazing</span>
              <div className="flex items-center space-x-2 ml-4">
                {getMoodIcon(currentMood)}
                <span className="text-white font-bold">{currentMood}</span>
              </div>
            </div>
          </div>

          {/* Emotions */}
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Emotions</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {emotions.map(emotion => (
                <Badge 
                  key={emotion} 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 cursor-pointer hover:bg-slate-700"
                  onClick={() => removeItem(emotion, setEmotions, emotions)}
                >
                  {emotion} ×
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Add emotion..."
                value={newEmotion}
                onChange={(e) => setNewEmotion(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem(newEmotion, setEmotions, emotions);
                    setNewEmotion("");
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  addItem(newEmotion, setEmotions, emotions);
                  setNewEmotion("");
                }}
                className="border-slate-600"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {emotionOptions.filter(e => !emotions.includes(e)).map(emotion => (
                <Button
                  key={emotion}
                  variant="ghost"
                  size="sm"
                  onClick={() => addItem(emotion, setEmotions, emotions)}
                  className="text-xs text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  {emotion}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Notes (Optional)</label>
            <Textarea
              placeholder="How was your day? What influenced your mood?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
            />
          </div>

          <Button onClick={handleSaveMood} className="w-full bg-purple-600 hover:bg-purple-700">
            Save Mood Entry
          </Button>
        </CardContent>
      </Card>

      {/* Mood Patterns */}
      {patterns && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              Mood Insights
              {getTrendIcon(patterns.moodTrend)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Average Mood</p>
                <div className="flex items-center space-x-2">
                  {getMoodIcon(patterns.averageMood)}
                  <span className="text-2xl font-bold text-white">{patterns.averageMood}</span>
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-400 text-sm">Trend</p>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(patterns.moodTrend)}
                  <span className="text-white capitalize">{patterns.moodTrend}</span>
                </div>
              </div>
            </div>

            {patterns.insights.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-2">Insights</h4>
                <ul className="space-y-1">
                  {patterns.insights.map((insight, index) => (
                    <li key={index} className="text-slate-300 text-sm">• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">{entry.date}</span>
                    <div className="flex items-center space-x-2">
                      {getMoodIcon(entry.mood)}
                      <span className="text-white font-medium">{entry.mood}</span>
                    </div>
                  </div>
                  {entry.emotions && entry.emotions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {entry.emotions.map(emotion => (
                        <Badge key={emotion} variant="outline" className="border-slate-600 text-slate-300 text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {entry.notes && (
                    <p className="text-slate-300 text-sm">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodTracker;
