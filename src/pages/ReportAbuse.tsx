
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Shield, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ReportAbuse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    reportType: "",
    description: "",
    evidence: "",
    contactEmail: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to a backend
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. Our moderation team will review it within 24 hours.",
    });
    
    // Reset form
    setFormData({
      reportType: "",
      description: "",
      evidence: "",
      contactEmail: ""
    });
  };

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
            <AlertTriangle className="w-8 h-8 mr-3 text-red-400" />
            Report Abuse
          </h1>
          <p className="text-slate-400">Help us maintain a safe community by reporting inappropriate content or behavior</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Form */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-400" />
                  Submit a Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Type of Report</label>
                    <Select value={formData.reportType} onValueChange={(value) => setFormData({...formData, reportType: value})}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="harassment">Harassment or Bullying</SelectItem>
                        <SelectItem value="doxxing">Personal Information Sharing</SelectItem>
                        <SelectItem value="threats">Threats or Violence</SelectItem>
                        <SelectItem value="spam">Spam or Scam</SelectItem>
                        <SelectItem value="false-content">False or Misleading Content</SelectItem>
                        <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Please provide details about the incident..."
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Evidence (Optional)</label>
                    <Textarea
                      value={formData.evidence}
                      onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                      placeholder="URLs, usernames, or any other relevant information..."
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-2">Contact Email (Optional)</label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      placeholder="your-email@example.com"
                      className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                    />
                    <p className="text-slate-400 text-sm mt-1">
                      Only provide if you want updates on your report
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={!formData.reportType || !formData.description}
                  >
                    Submit Report
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Emergency Contacts & Info */}
          <div className="space-y-6">
            <Card className="bg-red-900/50 border-red-600">
              <CardHeader>
                <CardTitle className="text-red-200 text-lg">Emergency Situations</CardTitle>
              </CardHeader>
              <CardContent className="text-red-100 space-y-3">
                <p className="text-sm">If you are in immediate danger or experiencing a mental health crisis:</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full border-red-400 text-red-200 hover:bg-red-800" asChild>
                    <a href="tel:911">🚨 Emergency: 911</a>
                  </Button>
                  <Button variant="outline" className="w-full border-red-400 text-red-200 hover:bg-red-800" asChild>
                    <a href="tel:988">💬 Crisis Helpline: 988</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium">Email Reports</p>
                    <a href="mailto:abuse@truthspace.app" className="text-blue-400 hover:text-blue-300 text-sm">
                      abuse@truthspace.app
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium">Support Line</p>
                    <a href="tel:1-800-TRUTH-1" className="text-green-400 hover:text-green-300 text-sm">
                      1-800-TRUTH-1
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-300 space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                  <p>Report is reviewed within 24 hours</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                  <p>Investigation begins if necessary</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                  <p>Action taken (warning, suspension, or removal)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">4</span>
                  <p>Follow-up if contact email provided</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAbuse;
