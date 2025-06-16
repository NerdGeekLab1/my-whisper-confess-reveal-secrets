
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, MapPin, Building, GraduationCap, Phone, Instagram } from "lucide-react";
import CulpritDetailView from "./CulpritDetailView";

interface SearchFilters {
  name: string;
  phone: string;
  location: string;
  college: string;
  company: string;
  socialHandle: string;
  dob: string;
}

interface CulpritRecord {
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
}

const CulpritSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    name: "",
    phone: "",
    location: "",
    college: "",
    company: "",
    socialHandle: "",
    dob: ""
  });

  const [results, setResults] = useState<CulpritRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCulprit, setSelectedCulprit] = useState<number | null>(null);

  // Mock data for demonstration
  const mockResults: CulpritRecord[] = [
    {
      id: 1,
      name: "Alex M.",
      age: 28,
      location: "New York, NY",
      college: "NYU",
      company: "Tech Corp",
      socialHandles: ["@alex_m", "@alexmiller"],
      reportCount: 7,
      lastSeen: "2 weeks ago",
      riskLevel: "high",
      categories: ["dating-apps", "emotional-abuse", "financial"]
    },
    {
      id: 2,
      name: "Jordan K.",
      age: 25,
      location: "Los Angeles, CA",
      socialHandles: ["@jordan_k"],
      reportCount: 3,
      lastSeen: "1 month ago",
      riskLevel: "medium",
      categories: ["cheating", "gaslighting"]
    }
  ];

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const handleViewDetails = (culpritId: number) => {
    setSelectedCulprit(culpritId);
  };

  const handleBackToSearch = () => {
    setSelectedCulprit(null);
  };

  // If a culprit is selected, show the detailed view
  if (selectedCulprit) {
    return (
      <CulpritDetailView 
        culpritId={selectedCulprit} 
        onBack={handleBackToSearch} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Partner Background Check</h1>
          <p className="text-slate-400">Search our database to verify if someone has been reported for relationship misconduct</p>
        </div>

        {/* Search Filters */}
        <Card className="bg-slate-900 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Full Name</label>
                <Input
                  placeholder="Enter full name"
                  value={filters.name}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Phone Number</label>
                <Input
                  placeholder="Enter phone number"
                  value={filters.phone}
                  onChange={(e) => setFilters({...filters, phone: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Date of Birth</label>
                <Input
                  type="date"
                  value={filters.dob}
                  onChange={(e) => setFilters({...filters, dob: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Location</label>
                <Input
                  placeholder="City, State"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">College/University</label>
                <Input
                  placeholder="Educational institution"
                  value={filters.college}
                  onChange={(e) => setFilters({...filters, college: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Company</label>
                <Input
                  placeholder="Workplace"
                  value={filters.company}
                  onChange={(e) => setFilters({...filters, company: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-slate-400 mb-2 block">Social Media Handle</label>
                <Input
                  placeholder="Instagram, Twitter, etc."
                  value={filters.socialHandle}
                  onChange={(e) => setFilters({...filters, socialHandle: e.target.value})}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              {isSearching ? "Searching..." : "Search Database"}
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Search Results ({results.length})</h2>
            {results.map((result) => (
              <Card key={result.id} className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{result.name}</h3>
                      <p className="text-slate-400">Age: {result.age} • Last seen: {result.lastSeen}</p>
                    </div>
                    <Badge className={getRiskColor(result.riskLevel)}>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {result.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-slate-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      {result.location}
                    </div>
                    {result.college && (
                      <div className="flex items-center text-slate-300">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        {result.college}
                      </div>
                    )}
                    {result.company && (
                      <div className="flex items-center text-slate-300">
                        <Building className="w-4 h-4 mr-2" />
                        {result.company}
                      </div>
                    )}
                    <div className="flex items-center text-slate-300">
                      <Instagram className="w-4 h-4 mr-2" />
                      {result.socialHandles.join(", ")}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-slate-400 mb-2">Reported for:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.categories.map((category) => (
                        <Badge key={category} variant="outline" className="border-slate-600 text-slate-400">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <span className="text-sm text-slate-400">
                      {result.reportCount} reports filed
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                      onClick={() => handleViewDetails(result.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CulpritSearch;
