import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

const TechnicalNotes = () => (
  <Card className="bg-slate-900 border-slate-700 mt-8">
    <CardHeader>
      <CardTitle className="text-white text-2xl flex items-center">
        <Lock className="w-6 h-6 mr-3 text-yellow-400" />
        Technical Implementation Notes
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4 text-slate-300">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">AI Services</h3>
          <p>AI sentiment analysis and content moderation are powered by Lovable AI (Gemini) with local fallback for reliability. The AI chatbot uses streaming responses for real-time conversations.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Database Structure</h3>
          <p>Tables: profiles, posts, diary_entries, reports, user_roles, loyalty_scores. All tables have Row Level Security with proper access control policies.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Security & Privacy</h3>
          <p>All user data is protected with Row Level Security (RLS). Anonymous posting maintains user privacy while allowing content moderation. Users can see their own posts immediately while pending admin review.</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TechnicalNotes;
