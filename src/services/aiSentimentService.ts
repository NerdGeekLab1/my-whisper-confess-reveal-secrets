import { supabase } from "@/integrations/supabase/client";

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  crisisRisk: 'low' | 'medium' | 'high';
  flaggedTerms: string[];
  recommendations: string[];
}

export interface ModerationResult {
  isApproved: boolean;
  flaggedContent: string[];
  moderationScore: number;
  suggestedAction: 'approve' | 'review' | 'reject';
}

class AISentimentService {
  // Fallback keywords for offline/error scenarios
  private crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living', 'harm myself',
    'give up', 'hopeless', 'worthless', 'nobody cares', 'better off dead'
  ];

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-sentiment', {
        body: { text, type: 'sentiment' }
      });

      if (error) throw error;
      return data as SentimentAnalysis;
    } catch (e) {
      console.warn('AI sentiment fallback to local analysis:', e);
      return this.localSentimentFallback(text);
    }
  }

  async moderateContent(text: string): Promise<ModerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-sentiment', {
        body: { text, type: 'moderate' }
      });

      if (error) throw error;
      return data as ModerationResult;
    } catch (e) {
      console.warn('AI moderation fallback to local analysis:', e);
      return this.localModerationFallback(text);
    }
  }

  private localSentimentFallback(text: string): SentimentAnalysis {
    const lowerText = text.toLowerCase();
    const positiveWords = ['better', 'hope', 'healing', 'support', 'grateful', 'stronger', 'progress'];
    const negativeWords = ['terrible', 'awful', 'devastated', 'broken', 'lost', 'betrayed', 'hurt'];
    
    let positiveCount = 0, negativeCount = 0;
    positiveWords.forEach(w => { if (lowerText.includes(w)) positiveCount++; });
    negativeWords.forEach(w => { if (lowerText.includes(w)) negativeCount++; });
    
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    const crisisMatches = this.crisisKeywords.filter(k => lowerText.includes(k));
    let crisisRisk: 'low' | 'medium' | 'high' = 'low';
    if (crisisMatches.length >= 2) crisisRisk = 'high';
    else if (crisisMatches.length > 0) crisisRisk = 'medium';
    
    const recommendations: string[] = [];
    if (crisisRisk === 'high') {
      recommendations.push('Crisis intervention resources', 'National Suicide Prevention Lifeline: 988');
    } else if (crisisRisk === 'medium') {
      recommendations.push('Mental health support groups', 'Self-care techniques');
    }
    if (sentiment === 'negative') {
      recommendations.push('Mindfulness and meditation resources');
    }
    
    return {
      sentiment,
      confidence: Math.min(0.9, Math.max(0.3, (positiveCount + negativeCount) * 0.15)),
      crisisRisk,
      flaggedTerms: crisisMatches,
      recommendations
    };
  }

  private localModerationFallback(text: string): ModerationResult {
    const lowerText = text.toLowerCase();
    const harmful = ['revenge', 'hurt someone', 'make them pay', 'hate speech', 'violence', 'attack'];
    const flagged = harmful.filter(k => lowerText.includes(k));
    const crisisTerms = this.crisisKeywords.filter(k => lowerText.includes(k));
    const score = (flagged.length * 0.3) + (crisisTerms.length * 0.2);
    
    let suggestedAction: 'approve' | 'review' | 'reject' = 'approve';
    if (score > 0.6) suggestedAction = 'reject';
    else if (score > 0.3) suggestedAction = 'review';
    
    return {
      isApproved: suggestedAction === 'approve',
      flaggedContent: [...flagged, ...crisisTerms],
      moderationScore: score,
      suggestedAction
    };
  }
}

export const aiSentimentService = new AISentimentService();
