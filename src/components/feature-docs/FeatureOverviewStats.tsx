import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Settings, Eye, Zap } from "lucide-react";

const FeatureOverviewStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <Card className="bg-slate-900 border-slate-700">
      <CardContent className="p-4 text-center">
        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">15</div>
        <div className="text-sm text-slate-400">Implemented</div>
      </CardContent>
    </Card>
    <Card className="bg-slate-900 border-slate-700">
      <CardContent className="p-4 text-center">
        <Settings className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">3</div>
        <div className="text-sm text-slate-400">Basic/Mock</div>
      </CardContent>
    </Card>
    <Card className="bg-slate-900 border-slate-700">
      <CardContent className="p-4 text-center">
        <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">12</div>
        <div className="text-sm text-slate-400">Planned</div>
      </CardContent>
    </Card>
    <Card className="bg-slate-900 border-slate-700">
      <CardContent className="p-4 text-center">
        <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">30</div>
        <div className="text-sm text-slate-400">Total Features</div>
      </CardContent>
    </Card>
  </div>
);

export default FeatureOverviewStats;
