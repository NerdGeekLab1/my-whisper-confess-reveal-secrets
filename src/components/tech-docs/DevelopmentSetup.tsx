
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DevelopmentSetup = () => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Development Setup & Deployment</CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-4">
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Local Development</h3>
          <div className="space-y-2 text-sm">
            <div className="bg-slate-700 p-3 rounded">
              <code className="text-green-300">npm install && npm run dev</code>
            </div>
            <p className="text-slate-400">Runs on localhost:5173 with hot reloading</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Environment Configuration</h3>
            <div className="bg-slate-800 p-3 rounded text-sm">
              <code className="text-cyan-300">
                VITE_SUPABASE_URL=https://kejaelgndmtragvcpstc.supabase.co<br/>
                VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...<br/>
                VITE_OPENAI_API_KEY=sk-...<br/>
                VITE_TWILIO_ACCOUNT_SID=AC...
              </code>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Demo Credentials</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-800 p-3 rounded">
                <strong className="text-blue-300">User:</strong> user@demo.com / demo123
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <strong className="text-red-300">Admin:</strong> admin@demo.com / admin123
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevelopmentSetup;
