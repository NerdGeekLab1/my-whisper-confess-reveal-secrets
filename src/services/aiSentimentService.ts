
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
  private crisisKeywords = [
    'suicide', 'kill myself', 'end it all', 'not worth living', 'harm myself',
    'give up', 'hopeless', 'worthless', 'nobody cares', 'better off dead'
  ];

  private harmfulKeywords = [
    'revenge', 'hurt someone', 'make them pay', 'get back at', 'destroy',
    'hate speech', 'discriminate', 'violence', 'attack'
  ];

  analyzeSentiment(text: string): SentimentAnalysis {
    const lowerText = text.toLowerCase();
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['better', 'hope', 'healing', 'support', 'grateful', 'stronger', 'progress'];
    const negativeWords = ['terrible', 'awful', 'devastated', 'broken', 'lost', 'betrayed', 'hurt'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });
    
    // Determine sentiment
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
    
    // Crisis risk assessment
    const crisisMatches = this.crisisKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );
    
    let crisisRisk: 'low' | 'medium' | 'high' = 'low';
    if (crisisMatches.length > 0) {
      crisisRisk = crisisMatches.length >= 2 ? 'high' : 'medium';
    }
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(sentiment, crisisRisk, lowerText);
    
    return {
      sentiment,
      confidence: Math.min(0.9, Math.max(0.3, (positiveCount + negativeCount) * 0.15)),
      crisisRisk,
      flaggedTerms: crisisMatches,
      recommendations
    };
  }

  moderateContent(text: string): ModerationResult {
    const lowerText = text.toLowerCase();
    
    const flaggedContent = this.harmfulKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );
    
    const crisisTerms = this.crisisKeywords.filter(keyword => 
      lowerText.includes(keyword)
    );
    
    const moderationScore = (flaggedContent.length * 0.3) + (crisisTerms.length * 0.2);
    
    let suggestedAction: 'approve' | 'review' | 'reject' = 'approve';
    if (moderationScore > 0.6) suggestedAction = 'reject';
    else if (moderationScore > 0.3) suggestedAction = 'review';
    
    return {
      isApproved: suggestedAction === 'approve',
      flaggedContent: [...flaggedContent, ...crisisTerms],
      moderationScore,
      suggestedAction
    };
  }

  private generateRecommendations(
    sentiment: string, 
    crisisRisk: string, 
    text: string
  ): string[] {
    const recommendations = [];
    
    if (crisisRisk === 'high') {
      recommendations.push('Crisis intervention resources');
      recommendations.push('National Suicide Prevention Lifeline: 988');
      recommendations.push('Professional counseling services');
    } else if (crisisRisk === 'medium') {
      recommendations.push('Mental health support groups');
      recommendations.push('Self-care techniques');
    }
    
    if (sentiment === 'negative') {
      recommendations.push('Mindfulness and meditation resources');
      recommendations.push('Community support threads');
    }
    
    if (text.includes('relationship') || text.includes('betrayal')) {
      recommendations.push('Relationship counseling resources');
      recommendations.push('Trust rebuilding guides');
    }
    
    return recommendations;
  }
}

export const aiSentimentService = new AISentimentService();
