
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

const DatabaseSchema = () => {
  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center text-2xl">
          <Database className="w-6 h-6 mr-3 text-purple-400" />
          Enhanced Database Schema
        </CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Current Core Tables</h3>
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-300">profiles</h4>
                <p className="text-sm text-slate-400 mb-2">User profile and role management</p>
                <ul className="text-xs space-y-1">
                  <li>• id (UUID, FK to auth.users)</li>
                  <li>• username, email, role</li>
                  <li>• is_verified, joined_date, last_active</li>
                </ul>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <h4 className="font-semibold text-green-300">posts</h4>
                <p className="text-sm text-slate-400 mb-2">Anonymous confessions and content</p>
                <ul className="text-xs space-y-1">
                  <li>• id, user_id, title, content</li>
                  <li>• category, is_anonymous, status</li>
                  <li>• reports_count, timestamps</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Proposed New Tables</h3>
            <div className="space-y-4">
              <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 className="font-semibold text-yellow-300">chat_rooms</h4>
                <p className="text-sm text-slate-400 mb-2">Real-time support chat rooms</p>
                <ul className="text-xs space-y-1">
                  <li>• id, name, type, max_participants</li>
                  <li>• is_active, created_by</li>
                  <li>• created_at, expires_at</li>
                </ul>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-cyan-400">
                <h4 className="font-semibold text-cyan-300">mood_entries</h4>
                <p className="text-sm text-slate-400 mb-2">Daily mood tracking system</p>
                <ul className="text-xs space-y-1">
                  <li>• id, user_id, mood_score</li>
                  <li>• emotions, notes</li>
                  <li>• logged_at, factors</li>
                </ul>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-pink-400">
                <h4 className="font-semibold text-pink-300">support_groups</h4>
                <p className="text-sm text-slate-400 mb-2">Community support groups</p>
                <ul className="text-xs space-y-1">
                  <li>• id, name, description</li>
                  <li>• category, member_count</li>
                  <li>• created_by, is_private</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseSchema;
