
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Heart, Users } from "lucide-react";

interface SidebarProps {
  setCurrentPage: (page: string) => void;
}

const Sidebar = ({ setCurrentPage }: SidebarProps) => {
  return (
    <div className="space-y-6 sticky top-24">
      {/* Community Guidelines */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Safe Space Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300 space-y-2">
          <p>• Complete anonymity guaranteed</p>
          <p>• No personal attacks or harassment</p>
          <p>• Support, don't judge</p>
          <p>• Verify claims when possible</p>
          <p>• Respect privacy boundaries</p>
        </CardContent>
      </Card>

      {/* Support Resources */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Heart className="w-5 h-5 mr-2 text-pink-400" />
            Support Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300 space-y-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
            onClick={() => setCurrentPage("helpline")}
          >
            Crisis Support Chat
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
            onClick={() => setCurrentPage("depression-analyzer")}
          >
            AI Depression Analyzer
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800">
            Legal Advice
          </Button>
        </CardContent>
      </Card>

      {/* Active Community */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Live Community
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span>Active now</span>
            <Badge className="bg-green-500/20 text-green-400">1,247</Badge>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span>Stories today</span>
            <Badge className="bg-blue-500/20 text-blue-400">89</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Support given</span>
            <Badge className="bg-pink-500/20 text-pink-400">2,156</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
