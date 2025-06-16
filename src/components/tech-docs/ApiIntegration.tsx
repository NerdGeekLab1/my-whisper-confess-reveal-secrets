
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

const ApiIntegration = () => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-2xl">
          <Globe className="w-6 h-6 mr-3 text-cyan-400" />
          API & Integration Architecture
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Current Integrations</h3>
            <div className="bg-slate-800 p-4 rounded-lg">
              <code className="text-green-300 text-sm">
                {`// Supabase Client Configuration
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      channels: ['posts', 'chat'],
      heartbeatIntervalMs: 30000
    }
  }
);`}
              </code>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Planned Integrations</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>OpenAI API:</strong> Content analysis & moderation</li>
              <li><strong>Twilio:</strong> SMS crisis alerts</li>
              <li><strong>WebRTC:</strong> Video support sessions</li>
              <li><strong>Push Notifications:</strong> PWA alerts</li>
              <li><strong>Analytics:</strong> Privacy-focused metrics</li>
              <li><strong>Translation API:</strong> Multi-language support</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiIntegration;
