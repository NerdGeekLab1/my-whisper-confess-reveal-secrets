
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const SecurityFeatures = () => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-2xl">
          <Shield className="w-6 h-6 mr-3 text-red-400" />
          Advanced Security & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Current Security</h3>
            <ul className="space-y-2 text-sm">
              <li>• JWT-based authentication</li>
              <li>• Row Level Security (RLS)</li>
              <li>• Anonymous posting</li>
              <li>• Encrypted data transmission</li>
              <li>• No tracking cookies</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Enhanced Privacy</h3>
            <ul className="space-y-2 text-sm">
              <li>• End-to-end encrypted chat</li>
              <li>• Temporary anonymous IDs</li>
              <li>• Auto data expiration</li>
              <li>• VPN-friendly architecture</li>
              <li>• Zero-knowledge protocols</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">AI Safety</h3>
            <ul className="space-y-2 text-sm">
              <li>• Crisis detection algorithms</li>
              <li>• Harmful content filtering</li>
              <li>• Bias monitoring systems</li>
              <li>• Transparent AI decisions</li>
              <li>• Human oversight protocols</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityFeatures;
