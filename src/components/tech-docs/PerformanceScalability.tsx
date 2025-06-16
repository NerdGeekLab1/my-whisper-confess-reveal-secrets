
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

const PerformanceScalability = () => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-2xl">
          <Zap className="w-6 h-6 mr-3 text-yellow-400" />
          Performance & Scalability Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Current Optimizations</h3>
            <ul className="space-y-2 text-sm">
              <li>• React 18 concurrent features</li>
              <li>• TanStack Query caching</li>
              <li>• Vite build optimization</li>
              <li>• Tailwind CSS purging</li>
              <li>• Component lazy loading</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Scaling Strategy</h3>
            <ul className="space-y-2 text-sm">
              <li>• Database connection pooling</li>
              <li>• CDN for static assets</li>
              <li>• Redis for session caching</li>
              <li>• Horizontal database scaling</li>
              <li>• Load balancer configuration</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Monitoring</h3>
            <ul className="space-y-2 text-sm">
              <li>• Real-time error tracking</li>
              <li>• Performance metrics</li>
              <li>• User journey analytics</li>
              <li>• Database query monitoring</li>
              <li>• Crisis detection alerts</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceScalability;
