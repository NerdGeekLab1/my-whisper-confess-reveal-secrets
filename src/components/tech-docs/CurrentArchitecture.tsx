
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "lucide-react";

const CurrentArchitecture = () => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-2xl">
          <Server className="w-6 h-6 mr-3 text-green-400" />
          Current System Architecture
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Frontend Stack</h3>
            <ul className="space-y-2">
              <li><strong>Framework:</strong> React 18.3.1 with TypeScript</li>
              <li><strong>Build Tool:</strong> Vite for fast development</li>
              <li><strong>Styling:</strong> Tailwind CSS with custom dark theme</li>
              <li><strong>UI Components:</strong> Shadcn/ui with Radix primitives</li>
              <li><strong>Routing:</strong> React Router DOM v6</li>
              <li><strong>State Management:</strong> React hooks + TanStack Query</li>
              <li><strong>Icons:</strong> Lucide React</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Backend & Infrastructure</h3>
            <ul className="space-y-2">
              <li><strong>Backend as a Service:</strong> Supabase</li>
              <li><strong>Database:</strong> PostgreSQL with Row Level Security</li>
              <li><strong>Authentication:</strong> Supabase Auth with JWT</li>
              <li><strong>Real-time:</strong> Supabase Realtime subscriptions</li>
              <li><strong>API:</strong> Auto-generated REST API from PostgreSQL</li>
              <li><strong>Hosting:</strong> Lovable platform deployment</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentArchitecture;
