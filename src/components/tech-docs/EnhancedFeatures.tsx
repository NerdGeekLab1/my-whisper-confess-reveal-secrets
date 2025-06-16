
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, MessageCircle, Brain, Users, Heart } from "lucide-react";

const EnhancedFeatures = () => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-2xl">
          <Zap className="w-6 h-6 mr-3 text-yellow-400" />
          Enhanced Features Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <MessageCircle className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Chat</h3>
            <ul className="text-sm space-y-1">
              <li>• Peer support chat rooms</li>
              <li>• Anonymous group sessions</li>
              <li>• Crisis intervention chat</li>
              <li>• Live notifications</li>
            </ul>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <Brain className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Integration</h3>
            <ul className="text-sm space-y-1">
              <li>• Sentiment analysis</li>
              <li>• Auto content moderation</li>
              <li>• Resource recommendations</li>
              <li>• Mood pattern analysis</li>
            </ul>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <Users className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
            <ul className="text-sm space-y-1">
              <li>• Support group creation</li>
              <li>• Anonymous matching</li>
              <li>• Achievement system</li>
              <li>• Weekly challenges</li>
            </ul>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <Heart className="w-8 h-8 text-red-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Personal Tools</h3>
            <ul className="text-sm space-y-1">
              <li>• Mood tracking journal</li>
              <li>• Goal setting system</li>
              <li>• Reflection prompts</li>
              <li>• Progress analytics</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedFeatures;
