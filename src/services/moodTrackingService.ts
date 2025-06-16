
export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  emotions: string[];
  notes?: string;
  triggers?: string[];
  activities?: string[];
}

export interface MoodPattern {
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  commonTriggers: string[];
  bestDays: string[];
  insights: string[];
}

class MoodTrackingService {
  private moodEntries: MoodEntry[] = [];

  addMoodEntry(entry: Omit<MoodEntry, 'id'>): MoodEntry {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString()
    };
    
    this.moodEntries.push(newEntry);
    return newEntry;
  }

  getMoodEntries(days: number = 30): MoodEntry[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.moodEntries.filter(entry => 
      new Date(entry.date) >= cutoffDate
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  analyzeMoodPatterns(days: number = 30): MoodPattern {
    const entries = this.getMoodEntries(days);
    
    if (entries.length === 0) {
      return {
        averageMood: 5,
        moodTrend: 'stable',
        commonTriggers: [],
        bestDays: [],
        insights: ['Start tracking your mood to see patterns!']
      };
    }
    
    // Calculate average mood
    const averageMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    
    // Determine trend
    const recentEntries = entries.slice(0, 7);
    const olderEntries = entries.slice(7, 14);
    
    const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    const olderAvg = olderEntries.length > 0 
      ? olderEntries.reduce((sum, entry) => sum + entry.mood, 0) / olderEntries.length 
      : recentAvg;
    
    let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
    const difference = recentAvg - olderAvg;
    if (difference > 0.5) moodTrend = 'improving';
    else if (difference < -0.5) moodTrend = 'declining';
    
    // Find common triggers
    const triggerCount: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.triggers?.forEach(trigger => {
        triggerCount[trigger] = (triggerCount[trigger] || 0) + 1;
      });
    });
    
    const commonTriggers = Object.entries(triggerCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger]) => trigger);
    
    // Find best days (highest mood days)
    const bestDays = entries
      .filter(entry => entry.mood >= 7)
      .slice(0, 3)
      .map(entry => entry.date);
    
    // Generate insights
    const insights = this.generateInsights(averageMood, moodTrend, commonTriggers, entries);
    
    return {
      averageMood: Math.round(averageMood * 10) / 10,
      moodTrend,
      commonTriggers,
      bestDays,
      insights
    };
  }

  private generateInsights(
    averageMood: number, 
    trend: string, 
    triggers: string[], 
    entries: MoodEntry[]
  ): string[] {
    const insights = [];
    
    if (averageMood >= 7) {
      insights.push('Your overall mood has been quite positive lately!');
    } else if (averageMood <= 4) {
      insights.push('Consider reaching out for support - you deserve to feel better.');
    }
    
    if (trend === 'improving') {
      insights.push('Great news! Your mood has been improving over time.');
    } else if (trend === 'declining') {
      insights.push('Your mood has been declining. Consider what changes might help.');
    }
    
    if (triggers.length > 0) {
      insights.push(`Your main mood triggers seem to be: ${triggers.slice(0, 2).join(', ')}`);
    }
    
    // Check for patterns in activities
    const activityMoods: { [key: string]: number[] } = {};
    entries.forEach(entry => {
      entry.activities?.forEach(activity => {
        if (!activityMoods[activity]) activityMoods[activity] = [];
        activityMoods[activity].push(entry.mood);
      });
    });
    
    const bestActivity = Object.entries(activityMoods)
      .map(([activity, moods]) => ({
        activity,
        avgMood: moods.reduce((sum, mood) => sum + mood, 0) / moods.length
      }))
      .sort((a, b) => b.avgMood - a.avgMood)[0];
    
    if (bestActivity && bestActivity.avgMood > averageMood + 0.5) {
      insights.push(`${bestActivity.activity} seems to boost your mood significantly!`);
    }
    
    return insights;
  }
}

export const moodTrackingService = new MoodTrackingService();
