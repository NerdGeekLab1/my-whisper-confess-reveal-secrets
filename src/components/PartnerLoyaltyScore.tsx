
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Star, AlertTriangle, CheckCircle, TrendingUp, Users, Clock, Shield, History, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/Breadcrumbs";

interface LoyaltyFormData {
  partnerName: string;
  relationshipDuration: string;
  communicationFrequency: string;
  conflictResolution: string;
  trustLevel: string;
  emotionalSupport: string;
  futureCommitment: string;
  physicalIntimacy: string;
  sharedInterests: string;
  financialTransparency: string;
  socialMediaBehavior: string;
  familyIntegration: string;
}

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "twitter", label: "Twitter / X" },
  { key: "tiktok", label: "TikTok" },
  { key: "snapchat", label: "Snapchat" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "telegram", label: "Telegram" },
  { key: "discord", label: "Discord" },
  { key: "reddit", label: "Reddit" },
  { key: "youtube", label: "YouTube" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone number" },
] as const;
type SocialKey = typeof SOCIAL_PLATFORMS[number]["key"];

interface LoyaltyResult {
  overallScore: number;
  category: string;
  color: string;
  icon: any;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  breakdown: {
    communication: number;
    trust: number;
    commitment: number;
    compatibility: number;
  };
}

const PartnerLoyaltyScore = () => {
  const [formData, setFormData] = useState<LoyaltyFormData>({
    partnerName: "",
    relationshipDuration: "",
    communicationFrequency: "",
    conflictResolution: "",
    trustLevel: "",
    emotionalSupport: "",
    futureCommitment: "",
    physicalIntimacy: "",
    sharedInterests: "",
    financialTransparency: "",
    socialMediaBehavior: "",
    familyIntegration: ""
  });

  const [result, setResult] = useState<LoyaltyResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedScores, setSavedScores] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedScores();
  }, []);

  const [socialHandles, setSocialHandles] = useState<Record<string, string>>({});
  const [miscDetails, setMiscDetails] = useState({
    age: "",
    occupation: "",
    city: "",
    metVia: "",
    livingTogether: "",
    prevRelationships: "",
    height: "",
    education: "",
    notes: "",
  });

  const setHandle = (k: SocialKey, v: string) => setSocialHandles((prev) => ({ ...prev, [k]: v }));


  const fetchSavedScores = async () => {
    const { data } = await supabase
      .from("loyalty_scores")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSavedScores(data);
  };

  const calculateLoyaltyScore = () => {
    if (!formData.partnerName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your partner's name to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(async () => {
      const scores = {
        relationshipDuration: getScoreFromValue(formData.relationshipDuration, 'duration'),
        communicationFrequency: getScoreFromValue(formData.communicationFrequency, 'frequency'),
        conflictResolution: getScoreFromValue(formData.conflictResolution, 'resolution'),
        trustLevel: getScoreFromValue(formData.trustLevel, 'trust'),
        emotionalSupport: getScoreFromValue(formData.emotionalSupport, 'support'),
        futureCommitment: getScoreFromValue(formData.futureCommitment, 'commitment'),
        physicalIntimacy: getScoreFromValue(formData.physicalIntimacy, 'intimacy'),
        sharedInterests: getScoreFromValue(formData.sharedInterests, 'interests'),
        financialTransparency: getScoreFromValue(formData.financialTransparency, 'financial'),
        socialMediaBehavior: getScoreFromValue(formData.socialMediaBehavior, 'social'),
        familyIntegration: getScoreFromValue(formData.familyIntegration, 'family')
      };

      const baseScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
      // Social transparency boost: more filled verifiable handles = more openness signal (up to +8)
      const filledHandles = Object.values(socialHandles).filter((v) => v && v.trim().length > 1).length;
      const socialBoost = Math.min(8, filledHandles * 1.2);
      const overallScore = Math.min(100, Math.round(baseScore + socialBoost));

      const trustAdj = Math.min(100, Math.round((scores.trustLevel + scores.financialTransparency + scores.socialMediaBehavior) / 3 + socialBoost));
      const breakdown = {
        communication: Math.round((scores.communicationFrequency + scores.conflictResolution) / 2),
        trust: trustAdj,
        commitment: Math.round((scores.futureCommitment + scores.relationshipDuration) / 2),
        compatibility: Math.round((scores.sharedInterests + scores.physicalIntimacy + scores.emotionalSupport + scores.familyIntegration) / 4)
      };

      const loyaltyResult = generateLoyaltyResult(overallScore, breakdown);
      setResult(loyaltyResult);
      setIsAnalyzing(false);

      // Auto-save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("loyalty_scores").insert({
          user_id: user.id,
          partner_name: formData.partnerName,
          overall_score: overallScore,
          category: loyaltyResult.category,
          breakdown: breakdown as any,
          strengths: loyaltyResult.strengths,
          concerns: loyaltyResult.concerns,
          recommendations: loyaltyResult.recommendations,
          form_data: formData as any,
          partner_social_handles: socialHandles as any,
        });
        fetchSavedScores();
      }

      toast({
        title: "Analysis Complete",
        description: `Loyalty score calculated and saved for ${formData.partnerName}`,
      });
    }, 2000);
  };

  const getScoreFromValue = (value: string, type: string): number => {
    const scoreMap: Record<string, Record<string, number>> = {
      duration: { "less-than-6-months": 60, "6-months-1-year": 70, "1-2-years": 80, "2-5-years": 90, "5-plus-years": 95 },
      frequency: { "rarely": 40, "weekly": 60, "daily": 85, "multiple-times-daily": 95 },
      resolution: { "avoid-conflicts": 50, "argue-frequently": 30, "discuss-calmly": 90, "seek-compromise": 95 },
      trust: { "completely": 95, "mostly": 80, "somewhat": 60, "rarely": 30, "never": 10 },
      support: { "always": 95, "usually": 80, "sometimes": 60, "rarely": 40, "never": 20 },
      commitment: { "marriage-soon": 95, "long-term": 85, "unsure": 50, "casual": 30 },
      intimacy: { "very-satisfied": 90, "satisfied": 80, "neutral": 60, "unsatisfied": 40 },
      interests: { "many-shared": 90, "some-shared": 70, "few-shared": 50, "none-shared": 30 },
      financial: { "completely-open": 95, "mostly-open": 80, "somewhat-private": 60, "very-private": 40 },
      social: { "respectful": 90, "appropriate": 80, "concerning": 40, "problematic": 20 },
      family: { "well-integrated": 90, "getting-along": 75, "neutral": 60, "some-issues": 40, "major-issues": 20 }
    };

    return scoreMap[type]?.[value] || 50;
  };

  const generateLoyaltyResult = (score: number, breakdown: any): LoyaltyResult => {
    let category, color, icon, strengths, concerns, recommendations;

    if (score >= 85) {
      category = "Highly Loyal";
      color = "text-green-500";
      icon = CheckCircle;
      strengths = ["Strong emotional bond", "Excellent communication", "High commitment level", "Great compatibility"];
      concerns = ["Minor areas for growth"];
      recommendations = ["Continue building on your strong foundation", "Consider relationship counseling for optimization"];
    } else if (score >= 70) {
      category = "Moderately Loyal";
      color = "text-blue-500";
      icon = Heart;
      strengths = ["Good foundation", "Decent communication", "Growing together"];
      concerns = ["Some trust issues", "Communication gaps", "Commitment uncertainty"];
      recommendations = ["Work on building deeper trust", "Improve daily communication", "Discuss future goals together"];
    } else if (score >= 50) {
      category = "Mixed Signals";
      color = "text-yellow-500";
      icon = AlertTriangle;
      strengths = ["Some positive aspects", "Potential for growth"];
      concerns = ["Trust issues", "Communication problems", "Commitment uncertainty", "Compatibility challenges"];
      recommendations = ["Couples therapy recommended", "Focus on honest communication", "Reassess relationship goals"];
    } else {
      category = "High Risk";
      color = "text-red-500";
      icon = Star;
      strengths = ["Room for significant improvement"];
      concerns = ["Major trust issues", "Poor communication", "Low commitment", "Compatibility problems"];
      recommendations = ["Serious relationship evaluation needed", "Professional counseling strongly recommended", "Consider if this relationship meets your needs"];
    }

    return { overallScore: score, category, color, icon, strengths, concerns, recommendations, breakdown };
  };

  const resetForm = () => {
    setFormData({
      partnerName: "",
      relationshipDuration: "",
      communicationFrequency: "",
      conflictResolution: "",
      trustLevel: "",
      emotionalSupport: "",
      futureCommitment: "",
      physicalIntimacy: "",
      sharedInterests: "",
      financialTransparency: "",
      socialMediaBehavior: "",
      familyIntegration: ""
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-4xl">
        <Breadcrumbs items={[
          { label: "Home", onClick: () => (window.location.href = "/") },
          { label: "Tools" },
          { label: "Partner Loyalty Score" },
          ...(result ? [{ label: "Results" }] : []),
        ]} />
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Partner Loyalty Score</h1>
              <p className="text-slate-400">Analyze your partner's loyalty and relationship dynamics</p>
            </div>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-200 text-sm">
                  This tool provides insights based on relationship patterns and behaviors. Results are for guidance only and should not replace professional relationship counseling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {!result ? (
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-400" />
                Partner Information Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="partnerName" className="text-slate-300">Partner's Name *</Label>
                <Input
                  id="partnerName"
                  value={formData.partnerName}
                  onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                  placeholder="Enter your partner's name"
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-3 border border-slate-700 rounded-lg p-4 bg-slate-800/40">
                <Label className="text-slate-200 font-semibold">Partner's Social Media Handles</Label>
                <p className="text-xs text-slate-400">Used for cross-checking against Culprit Search. Kept private to you. Filled handles show a green dot.</p>
                <Tabs defaultValue={SOCIAL_PLATFORMS[0].key} className="w-full">
                  <TabsList className="bg-slate-900 flex-wrap h-auto justify-start">
                    {SOCIAL_PLATFORMS.map((p) => (
                      <TabsTrigger key={p.key} value={p.key} className="text-xs data-[state=active]:bg-slate-700">
                        {p.label}
                        {socialHandles[p.key]?.trim() && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <TabsContent key={p.key} value={p.key} className="mt-3">
                      <Label className="text-slate-400 text-xs">{p.label} handle / URL</Label>
                      <Input
                        value={socialHandles[p.key] || ""}
                        onChange={(e) => setHandle(p.key, e.target.value)}
                        placeholder={p.key === "phone" ? "+1 555 123 4567" : p.key === "email" ? "name@example.com" : `@${p.key}_handle or full URL`}
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">Each filled platform adds signal weight to the trust score.</p>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-slate-300">Relationship Duration</Label>
                  <Select value={formData.relationshipDuration} onValueChange={(value) => setFormData({ ...formData, relationshipDuration: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-6-months">Less than 6 months</SelectItem>
                      <SelectItem value="6-months-1-year">6 months - 1 year</SelectItem>
                      <SelectItem value="1-2-years">1-2 years</SelectItem>
                      <SelectItem value="2-5-years">2-5 years</SelectItem>
                      <SelectItem value="5-plus-years">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Communication Frequency</Label>
                  <Select value={formData.communicationFrequency} onValueChange={(value) => setFormData({ ...formData, communicationFrequency: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="How often do you communicate?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-times-daily">Multiple times daily</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Conflict Resolution</Label>
                  <Select value={formData.conflictResolution} onValueChange={(value) => setFormData({ ...formData, conflictResolution: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="How do you handle conflicts?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seek-compromise">Seek compromise together</SelectItem>
                      <SelectItem value="discuss-calmly">Discuss calmly</SelectItem>
                      <SelectItem value="avoid-conflicts">Avoid conflicts</SelectItem>
                      <SelectItem value="argue-frequently">Argue frequently</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Trust Level</Label>
                  <Select value={formData.trustLevel} onValueChange={(value) => setFormData({ ...formData, trustLevel: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="How much do you trust them?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completely">Completely</SelectItem>
                      <SelectItem value="mostly">Mostly</SelectItem>
                      <SelectItem value="somewhat">Somewhat</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Emotional Support</Label>
                  <Select value={formData.emotionalSupport} onValueChange={(value) => setFormData({ ...formData, emotionalSupport: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Do they provide emotional support?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always there for me</SelectItem>
                      <SelectItem value="usually">Usually supportive</SelectItem>
                      <SelectItem value="sometimes">Sometimes</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Future Commitment</Label>
                  <Select value={formData.futureCommitment} onValueChange={(value) => setFormData({ ...formData, futureCommitment: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Future plans together?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marriage-soon">Planning marriage/long-term</SelectItem>
                      <SelectItem value="long-term">Serious long-term relationship</SelectItem>
                      <SelectItem value="unsure">Unsure about future</SelectItem>
                      <SelectItem value="casual">Keeping it casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Physical Intimacy</Label>
                  <Select value={formData.physicalIntimacy} onValueChange={(value) => setFormData({ ...formData, physicalIntimacy: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Physical connection satisfaction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very-satisfied">Very satisfied</SelectItem>
                      <SelectItem value="satisfied">Satisfied</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="unsatisfied">Unsatisfied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Shared Interests</Label>
                  <Select value={formData.sharedInterests} onValueChange={(value) => setFormData({ ...formData, sharedInterests: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Common interests/hobbies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="many-shared">Many shared interests</SelectItem>
                      <SelectItem value="some-shared">Some shared interests</SelectItem>
                      <SelectItem value="few-shared">Few shared interests</SelectItem>
                      <SelectItem value="none-shared">Very different interests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Financial Transparency</Label>
                  <Select value={formData.financialTransparency} onValueChange={(value) => setFormData({ ...formData, financialTransparency: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Financial openness" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completely-open">Completely open about finances</SelectItem>
                      <SelectItem value="mostly-open">Mostly transparent</SelectItem>
                      <SelectItem value="somewhat-private">Somewhat private</SelectItem>
                      <SelectItem value="very-private">Very secretive about money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Social Media Behavior</Label>
                  <Select value={formData.socialMediaBehavior} onValueChange={(value) => setFormData({ ...formData, socialMediaBehavior: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Their social media behavior" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="respectful">Respectful and appropriate</SelectItem>
                      <SelectItem value="appropriate">Generally appropriate</SelectItem>
                      <SelectItem value="concerning">Sometimes concerning</SelectItem>
                      <SelectItem value="problematic">Often problematic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Family Integration</Label>
                  <Select value={formData.familyIntegration} onValueChange={(value) => setFormData({ ...formData, familyIntegration: value })}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue placeholder="Relationship with your family/friends" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="well-integrated">Gets along great with everyone</SelectItem>
                      <SelectItem value="getting-along">Generally gets along well</SelectItem>
                      <SelectItem value="neutral">Neutral/polite interactions</SelectItem>
                      <SelectItem value="some-issues">Some minor issues</SelectItem>
                      <SelectItem value="major-issues">Major problems with family/friends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={calculateLoyaltyScore}
                  disabled={isAnalyzing}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Calculate Loyalty Score
                    </>
                  )}
                </Button>
                <Button onClick={resetForm} variant="outline" className="border-slate-600 text-slate-300">
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="bg-slate-900 border-slate-700">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <result.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {formData.partnerName}'s Loyalty Score
                  </h2>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="text-5xl font-bold text-white">{result.overallScore}</div>
                    <div className="text-2xl text-slate-400">/100</div>
                  </div>
                  <Badge className={`${result.color} text-lg px-4 py-2`}>
                    {result.category}
                  </Badge>
                  <Progress 
                    value={result.overallScore} 
                    className="w-full mt-4 h-3"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(result.breakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-white font-semibold">{value}/100</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Concerns and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                    Areas of Concern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.concerns.map((concern, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-400" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-slate-300 flex items-start">
                        <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={resetForm}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Test Another Partner
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="w-4 h-4 mr-2" />
                {showHistory ? "Hide History" : "View History"}
              </Button>
            </div>

            {/* Score History */}
            {showHistory && savedScores.length > 0 && (
              <Card className="bg-slate-900 border-slate-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <History className="w-5 h-5 mr-2 text-blue-400" />
                    Previous Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {savedScores.map((score) => (
                      <div key={score.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{score.partner_name}</p>
                          <p className="text-slate-400 text-sm">{new Date(score.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={
                            score.overall_score >= 85 ? 'bg-green-500/20 text-green-400' :
                            score.overall_score >= 70 ? 'bg-blue-500/20 text-blue-400' :
                            score.overall_score >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }>
                            {score.overall_score}/100 — {score.category}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300"
                            onClick={async () => {
                              await supabase.from("loyalty_scores").delete().eq("id", score.id);
                              fetchSavedScores();
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerLoyaltyScore;
