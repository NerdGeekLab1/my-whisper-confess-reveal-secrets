
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImplementationTimeline = () => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Implementation Timeline</CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-900/30 border border-green-600 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-300 mb-2">Phase 1 (Current)</h3>
            <ul className="text-sm space-y-1">
              <li>✓ Basic posting system</li>
              <li>✓ User authentication</li>
              <li>✓ Private diary</li>
              <li>✓ Admin dashboard</li>
            </ul>
          </div>
          <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Phase 2 (Next)</h3>
            <ul className="text-sm space-y-1">
              <li>• Real-time chat system</li>
              <li>• Post reactions</li>
              <li>• Enhanced moderation</li>
              <li>• Mood tracking</li>
            </ul>
          </div>
          <div className="bg-purple-900/30 border border-purple-600 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Phase 3 (Future)</h3>
            <ul className="text-sm space-y-1">
              <li>• AI content analysis</li>
              <li>• Support groups</li>
              <li>• Crisis detection</li>
              <li>• Mobile PWA</li>
            </ul>
          </div>
          <div className="bg-orange-900/30 border border-orange-600 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-300 mb-2">Phase 4 (Advanced)</h3>
            <ul className="text-sm space-y-1">
              <li>• Video support sessions</li>
              <li>• Multi-language support</li>
              <li>• Advanced analytics</li>
              <li>• Third-party integrations</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImplementationTimeline;
