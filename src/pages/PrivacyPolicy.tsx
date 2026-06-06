
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          ← Back to SnakesList
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-green-400" />
            Privacy Policy
          </h1>
          <p className="text-slate-400">Last updated: December 2024</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-400" />
                What We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>At SnakesList, we collect minimal information to provide our services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address and username for account creation</li>
                <li>Anonymous confession and diary content</li>
                <li>Basic usage analytics (non-personal)</li>
                <li>IP addresses for security purposes only</li>
              </ul>
              <p className="text-green-400 font-medium">
                We NEVER collect: Real names, phone numbers, or any personally identifiable information in your posts.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="w-5 h-5 mr-2 text-purple-400" />
                How We Protect You
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>All confessions are posted anonymously with no link to your account</li>
                <li>End-to-end encryption for all data transmission</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure servers with 24/7 monitoring</li>
                <li>No tracking cookies or third-party analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2 text-orange-400" />
                Data Sharing & Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p><strong>We never share your data with:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Advertisers or marketing companies</li>
                <li>Social media platforms</li>
                <li>Data brokers</li>
                <li>Third-party analytics services</li>
              </ul>
              <p className="mt-4"><strong>Your rights:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request account deletion at any time</li>
                <li>Download your personal data</li>
                <li>Opt out of non-essential communications</li>
                <li>Report privacy concerns directly to our team</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
