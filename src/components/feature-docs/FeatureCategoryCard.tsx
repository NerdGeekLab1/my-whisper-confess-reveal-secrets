import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface FeatureItem {
  name: string;
  description: string;
  status: string;
  location: string;
  usage: string;
}

interface FeatureCategoryCardProps {
  category: string;
  icon: LucideIcon;
  color: string;
  items: FeatureItem[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Implemented": return "bg-green-500/20 text-green-400 border-green-500/50";
    case "Basic Implementation": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "Mock Implementation": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    case "Planned": return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
  }
};

const FeatureCategoryCard = ({ category, icon: Icon, color, items }: FeatureCategoryCardProps) => (
  <Card className="bg-slate-900 border-slate-700">
    <CardHeader>
      <CardTitle className={`text-2xl flex items-center ${color}`}>
        <Icon className="w-6 h-6 mr-3" />
        {category}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 bg-slate-800 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
            </div>
            <p className="text-slate-300 mb-3">{item.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Location: </span>
                <code className="text-cyan-300">{item.location}</code>
              </div>
              <div>
                <span className="text-slate-400">Usage: </span>
                <span className="text-slate-300">{item.usage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default FeatureCategoryCard;
