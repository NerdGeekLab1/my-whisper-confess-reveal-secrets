
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
            <FileText className="w-8 h-8 mr-3 text-blue-400" />
            Terms of Service
          </h1>
          <p className="text-slate-400">Last updated: December 2024</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Scale className="w-5 h-5 mr-2 text-green-400" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                By accessing and using SnakesList, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                SnakesList is a platform designed to provide a safe space for sharing experiences, seeking support, and connecting 
                with others who have faced similar challenges.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                Use of the Service
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <h3 className="text-lg font-semibold text-white">Permitted Uses</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sharing personal experiences of betrayal, heartbreak, or emotional challenges</li>
                <li>Offering support and encouragement to other community members</li>
                <li>Seeking advice and guidance from the community</li>
                <li>Using the anonymous diary feature for personal reflection</li>
                <li>Accessing depression support resources and helplines</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-6">Prohibited Uses</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sharing personally identifiable information of others without consent</li>
                <li>Harassment, bullying, or threats toward any individual</li>
                <li>Posting false, misleading, or defamatory content</li>
                <li>Organizing or inciting real-world harassment or violence</li>
                <li>Sharing explicit sexual content or graphic violence</li>
                <li>Commercial activities or spam</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
                Account Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must provide accurate information during registration</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>One person may not maintain more than one account</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Content and Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <h3 className="text-lg font-semibold text-white">Your Content</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain ownership of content you post</li>
                <li>You grant SnakesList a license to display and distribute your content</li>
                <li>You represent that you have the right to post your content</li>
                <li>You may delete your content at any time</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4">Platform Content</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>SnakesList retains ownership of platform features and design</li>
                <li>You may not reproduce or distribute platform content without permission</li>
                <li>All trademarks and service marks are property of their respective owners</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the service will cease immediately. 
                If you wish to terminate your account, you may simply discontinue using the service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                The information on this service is provided on an "as is" basis. To the fullest extent 
                permitted by law, this company excludes all representations, warranties, conditions and 
                terms whether express or implied.
              </p>
              <div className="bg-amber-900/50 border border-amber-600 rounded-lg p-4">
                <p className="text-amber-200">
                  <strong>Mental Health Notice:</strong> SnakesList provides peer support but is not a 
                  substitute for professional mental health services. If you are experiencing a mental 
                  health emergency, please contact emergency services immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
