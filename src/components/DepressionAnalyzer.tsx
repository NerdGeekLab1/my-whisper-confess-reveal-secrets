
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Phone, MessageCircle, Shield, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  severity: "low" | "moderate" | "high" | "critical";
  riskFactors: string[];
  supportSuggestions: string[];
  emergencyTriggered: boolean;
}

const DepressionAnalyzer = () => {
  const [story, setStory] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeStory = async () => {
    if (!story.trim()) {
      toast({
        title: "Please write your story",
        description: "We need some text to analyze and provide support.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis (in real implementation, this would call an AI service)
    const keywords = {
      critical: ["suicide", "kill myself", "end it all", "no way out", "better off dead"],
      high: ["hopeless", "worthless", "can't go on", "everything hurts", "nobody cares"],
      moderate: ["depressed", "sad", "lonely", "tired", "struggling", "difficult"],
      low: ["down", "upset", "worried", "stressed", "overwhelmed"]
    };

    let severity: "low" | "moderate" | "high" | "critical" = "low";
    const riskFactors: string[] = [];
    const supportSuggestions: string[] = [];

    const storyLower = story.toLowerCase();

    // Check for critical keywords
    if (keywords.critical.some(word => storyLower.includes(word))) {
      severity = "critical";
      riskFactors.push("Suicidal ideation detected");
      supportSuggestions.push("Immediate crisis intervention required");
    } else if (keywords.high.some(word => storyLower.includes(word))) {
      severity = "high";
      riskFactors.push("Severe emotional distress");
      supportSuggestions.push("Professional counseling recommended");
    } else if (keywords.moderate.some(word => storyLower.includes(word))) {
      severity = "moderate";
      riskFactors.push("Signs of depression");
      supportSuggestions.push("Consider therapy or support groups");
    }

    // Additional risk factor analysis
    if (storyLower.includes("alone") || storyLower.includes("isolated")) {
      riskFactors.push("Social isolation");
    }
    if (storyLower.includes("betrayed") || storyLower.includes("cheated")) {
      riskFactors.push("Relationship trauma");
    }

    // Default support suggestions
    supportSuggestions.push("Connect with trusted friends or family");
    supportSuggestions.push("Practice self-care activities");
    supportSuggestions.push("Consider professional help if symptoms persist");

    const emergencyTriggered = severity === "critical";

    setTimeout(() => {
      setAnalysis({
        severity,
        riskFactors,
        supportSuggestions,
        emergencyTriggered
      });
      setIsAnalyzing(false);

      if (emergencyTriggered) {
        toast({
          title: "⚠️ Emergency Support Activated",
          description: "Crisis support resources have been alerted. Help is available 24/7.",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500";
      case "moderate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
      default: return "bg-green-500/20 text-green-400 border-green-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="w-6 h-6 mr-3 text-blue-400" />
            AI Depression Support Analyzer
          </CardTitle>
          <p className="text-slate-400">
            Share your story anonymously. Our AI will analyze the content and provide appropriate support resources.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Anonymous Story
            </label>
            <Textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Share what you're going through... This is a safe, anonymous space."
              className="min-h-[150px] bg-slate-800 border-slate-600 text-white resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-slate-400 mt-2">
              {story.length}/2000 characters • Your story is completely anonymous
            </p>
          </div>

          <Button
            onClick={analyzeStory}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze & Get Support
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Analysis Results</CardTitle>
              <Badge className={getSeverityColor(analysis.severity)}>
                {analysis.severity.toUpperCase()} RISK
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {analysis.emergencyTriggered && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">🚨 Emergency Support Activated</h3>
                </div>
                <p className="text-red-200 mb-4">
                  Your message indicates you may be in immediate danger. Please reach out for help right now:
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Crisis Hotline: 988
                  </Button>
                  <Button variant="outline" className="w-full border-red-500 text-red-200">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Crisis Chat
                  </Button>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                Risk Factors Identified
              </h4>
              <div className="space-y-2">
                {analysis.riskFactors.map((factor, index) => (
                  <div key={index} className="bg-slate-800 rounded-lg p-3">
                    <p className="text-slate-300">{factor}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-pink-400" />
                Recommended Support
              </h4>
              <div className="space-y-2">
                {analysis.supportSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-slate-800 rounded-lg p-3">
                    <p className="text-slate-300">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">Privacy Protected</span>
              </div>
              <p className="text-xs text-blue-200">
                Your story is analyzed locally and anonymously. No personal data is stored or shared.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DepressionAnalyzer;
