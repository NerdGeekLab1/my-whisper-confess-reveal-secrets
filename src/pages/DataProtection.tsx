
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Lock, Eye, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DataProtection = () => {
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
            <Shield className="w-8 h-8 mr-3 text-green-400" />
            Data Protection & GDPR
          </h1>
          <p className="text-slate-400">Your rights and our commitments under data protection law</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-400" />
                Your Data Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-6">
              <p>Under GDPR and other data protection laws, you have the following rights regarding your personal data:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Eye className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">Right to Access</h3>
                      <p className="text-sm text-slate-400">Request a copy of all personal data we hold about you</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">Right to Rectification</h3>
                      <p className="text-sm text-slate-400">Correct any inaccurate or incomplete personal data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Trash2 className="w-5 h-5 text-red-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">Right to Erasure</h3>
                      <p className="text-sm text-slate-400">Request deletion of your personal data ("right to be forgotten")</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Download className="w-5 h-5 text-green-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">Right to Portability</h3>
                      <p className="text-sm text-slate-400">Receive your data in a portable format</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-orange-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">Right to Restrict</h3>
                      <p className="text-sm text-slate-400">Limit how we process your personal data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Database className="w-5 h-5 text-cyan-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white">Right to Object</h3>
                      <p className="text-sm text-slate-400">Object to certain types of data processing</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">How We Protect Your Data</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Technical Safeguards</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• End-to-end encryption for all data transmission</li>
                    <li>• Encrypted data storage using AES-256</li>
                    <li>• Secure authentication with JWT tokens</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Automatic security updates and patches</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Organizational Measures</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Access controls and role-based permissions</li>
                    <li>• Staff training on data protection procedures</li>
                    <li>• Data breach response procedures</li>
                    <li>• Regular backup and disaster recovery testing</li>
                    <li>• Privacy impact assessments for new features</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Data Processing Legal Basis</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Account Information</h3>
                  <p className="text-sm"><strong>Legal Basis:</strong> Contract performance</p>
                  <p className="text-sm">We process your email and username to provide our services and maintain your account.</p>
                </div>
                
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Posts and Confessions</h3>
                  <p className="text-sm"><strong>Legal Basis:</strong> Consent</p>
                  <p className="text-sm">You choose to share content publicly. You can delete your posts at any time.</p>
                </div>
                
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Support and Safety</h3>
                  <p className="text-sm"><strong>Legal Basis:</strong> Legitimate interests</p>
                  <p className="text-sm">We may process data to ensure user safety and platform security.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Making a Request</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>To exercise any of your data protection rights, contact us using one of the methods below:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Email</h3>
                  <p className="text-sm mb-2">Send your request to:</p>
                  <a href="mailto:privacy@truthspace.app" className="text-blue-400 hover:text-blue-300">
                    privacy@truthspace.app
                  </a>
                </div>
                
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Response Time</h3>
                  <p className="text-sm">We will respond to your request within:</p>
                  <p className="text-green-400 font-medium">30 days (GDPR compliance)</p>
                </div>
              </div>
              
              <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4">
                <h3 className="font-semibold text-blue-200 mb-2">What to Include in Your Request</h3>
                <ul className="text-sm text-blue-100 space-y-1">
                  <li>• Your registered email address</li>
                  <li>• Specific data or action you're requesting</li>
                  <li>• Proof of identity (if requesting sensitive information)</li>
                  <li>• Clear description of your request</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Supervisory Authority</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <p>
                If you are not satisfied with how we handle your data protection concerns, 
                you have the right to lodge a complaint with your local data protection authority.
              </p>
              
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">EU Users</h3>
                <p className="text-sm">Contact your national Data Protection Authority</p>
                <a 
                  href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Find your DPA →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataProtection;
