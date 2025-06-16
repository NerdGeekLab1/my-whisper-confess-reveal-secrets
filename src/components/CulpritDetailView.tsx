
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  AlertTriangle, 
  MapPin, 
  Building, 
  GraduationCap, 
  Phone, 
  Instagram,
  Calendar,
  FileText,
  Shield,
  Users,
  Clock,
  Flag
} from "lucide-react";

interface CulpritDetailProps {
  culpritId: number;
  onBack: () => void;
}

interface DetailedRecord {
  id: number;
  name: string;
  age: number;
  location: string;
  college?: string;
  company?: string;
  socialHandles: string[];
  reportCount: number;
  lastSeen: string;
  riskLevel: "high" | "medium" | "low";
  categories: string[];
  detailedInfo: {
    physicalDescription: string;
    knownAddresses: string[];
    phoneNumbers: string[];
    emailAddresses: string[];
    relationshipHistory: Array<{
      type: string;
      duration: string;
      issues: string[];
    }>;
    reportDetails: Array<{
      date: string;
      category: string;
      description: string;
      severity: string;
    }>;
    verificationStatus: string;
    lastUpdated: string;
  };
}

const CulpritDetailView = ({ culpritId, onBack }: CulpritDetailProps) => {
  // Mock detailed data - in real app, this would be fetched from API
  const [record] = useState<DetailedRecord>({
    id: culpritId,
    name: "Alex M.",
    age: 28,
    location: "New York, NY",
    college: "NYU",
    company: "Tech Corp",
    socialHandles: ["@alex_m", "@alexmiller"],
    reportCount: 7,
    lastSeen: "2 weeks ago",
    riskLevel: "high",
    categories: ["dating-apps", "emotional-abuse", "financial"],
    detailedInfo: {
      physicalDescription: "5'10\", Brown hair, Blue eyes, Athletic build",
      knownAddresses: [
        "123 Main St, New York, NY 10001",
        "456 Park Ave, New York, NY 10016"
      ],
      phoneNumbers: [
        "+1 (555) 123-4567",
        "+1 (555) 987-6543"
      ],
      emailAddresses: [
        "alex.m***@gmail.com",
        "alexmiller***@company.com"
      ],
      relationshipHistory: [
        {
          type: "Dating App Match",
          duration: "3 months",
          issues: ["Emotional manipulation", "Financial fraud"]
        },
        {
          type: "Workplace Romance",
          duration: "6 months",
          issues: ["Harassment", "Stalking behavior"]
        }
      ],
      reportDetails: [
        {
          date: "2024-01-15",
          category: "Financial Fraud",
          description: "Asked for money for 'emergency' and disappeared",
          severity: "High"
        },
        {
          date: "2024-02-20",
          category: "Emotional Abuse",
          description: "Gaslighting and manipulation tactics",
          severity: "High"
        },
        {
          date: "2024-03-10",
          category: "Cheating",
          description: "Multiple simultaneous relationships",
          severity: "Medium"
        }
      ],
      verificationStatus: "Verified by multiple sources",
      lastUpdated: "2024-03-15"
    }
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "text-red-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-green-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search Results
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{record.name}</h1>
              <p className="text-slate-400">Detailed Background Report</p>
            </div>
            <Badge className={getRiskColor(record.riskLevel)}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {record.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-400" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-slate-300">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Age: {record.age} • {record.location}</span>
                  </div>
                  {record.college && (
                    <div className="flex items-center text-slate-300">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {record.college}
                    </div>
                  )}
                  {record.company && (
                    <div className="flex items-center text-slate-300">
                      <Building className="w-4 h-4 mr-2" />
                      {record.company}
                    </div>
                  )}
                  <div className="flex items-center text-slate-300">
                    <Clock className="w-4 h-4 mr-2" />
                    Last seen: {record.lastSeen}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Physical Description:</p>
                  <p className="text-slate-300">{record.detailedInfo.physicalDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-400" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Known Addresses:</p>
                  <ul className="space-y-1">
                    {record.detailedInfo.knownAddresses.map((address, index) => (
                      <li key={index} className="text-slate-300">{address}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Phone Numbers:</p>
                  <ul className="space-y-1">
                    {record.detailedInfo.phoneNumbers.map((phone, index) => (
                      <li key={index} className="text-slate-300">{phone}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Email Addresses:</p>
                  <ul className="space-y-1">
                    {record.detailedInfo.emailAddresses.map((email, index) => (
                      <li key={index} className="text-slate-300">{email}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Social Media:</p>
                  <div className="flex items-center text-slate-300">
                    <Instagram className="w-4 h-4 mr-2" />
                    {record.socialHandles.join(", ")}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Relationship History */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-400" />
                  Relationship History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {record.detailedInfo.relationshipHistory.map((relationship, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{relationship.type}</h4>
                      <span className="text-sm text-slate-400">{relationship.duration}</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-1">Reported Issues:</p>
                      <div className="flex flex-wrap gap-2">
                        {relationship.issues.map((issue, issueIndex) => (
                          <Badge key={issueIndex} variant="outline" className="border-red-600 text-red-400">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Detailed Reports */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Flag className="w-5 h-5 mr-2 text-red-400" />
                  Detailed Reports ({record.reportCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {record.detailedInfo.reportDetails.map((report, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {report.category}
                        </Badge>
                        <span className={`text-sm font-semibold ${getSeverityColor(report.severity)}`}>
                          {report.severity} Severity
                        </span>
                      </div>
                      <span className="text-sm text-slate-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {report.date}
                      </span>
                    </div>
                    <p className="text-slate-300">{report.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Assessment */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-yellow-400" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${record.riskLevel === 'high' ? 'text-red-400' : record.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {record.riskLevel.toUpperCase()}
                  </div>
                  <p className="text-slate-400 text-sm">Risk Level</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Reports:</span>
                    <span className="text-white font-semibold">{record.reportCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verification:</span>
                    <span className="text-green-400">{record.detailedInfo.verificationStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Updated:</span>
                    <span className="text-slate-300">{record.detailedInfo.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Reported Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {record.categories.map((category) => (
                    <Badge key={category} variant="outline" className="border-slate-600 text-slate-400 w-full justify-center">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Flag className="w-4 h-4 mr-2" />
                  Report Additional Info
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                  <Shield className="w-4 h-4 mr-2" />
                  Request Verification
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="bg-red-900/20 border-red-500/50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-400 mb-1">Safety Notice</h4>
                    <p className="text-sm text-red-300">
                      Always prioritize your safety. If you feel threatened, contact local authorities immediately.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulpritDetailView;
