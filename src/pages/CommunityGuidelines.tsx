
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Heart, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CommunityGuidelines = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          ← Back to TruthSpace
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-400" />
            Community Guidelines
          </h1>
          <p className="text-slate-400">Building a safe space for healing and truth</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-400" />
                Our Core Values
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Empathy First:</strong> We support, don't judge. Everyone's pain is valid.</li>
                <li><strong>Complete Anonymity:</strong> Protect your identity and others' privacy.</li>
                <li><strong>Truth with Compassion:</strong> Share honestly but with kindness.</li>
                <li><strong>Healing Focus:</strong> We're here to heal, not to seek revenge.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                What's Allowed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>Sharing your personal experiences of betrayal or heartbreak</li>
                <li>Offering support and comfort to others</li>
                <li>Asking for advice or guidance</li>
                <li>Sharing evidence of betrayal (screenshots, etc.) when relevant</li>
                <li>Discussing patterns of behavior to warn others</li>
                <li>Seeking help for depression or mental health struggles</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                What's Not Allowed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Information:</strong> Never share full names, addresses, or contact details</li>
                <li><strong>Harassment:</strong> No bullying, threats, or targeted attacks</li>
                <li><strong>False Claims:</strong> Don't make up stories or false accusations</li>
                <li><strong>Revenge Plotting:</strong> No organizing harassment or real-world retaliation</li>
                <li><strong>Explicit Content:</strong> No graphic sexual content or violence</li>
                <li><strong>Spam or Promotion:</strong> No advertising or self-promotion</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Consequences</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>Violations may result in:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Content removal</li>
                <li>Temporary suspension</li>
                <li>Permanent account ban</li>
                <li>Reporting to authorities (in cases of threats or illegal content)</li>
              </ul>
              <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4 mt-4">
                <p className="text-blue-200">
                  <strong>Remember:</strong> Our goal is healing and support. If you're struggling, please reach out for help through our support resources.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
