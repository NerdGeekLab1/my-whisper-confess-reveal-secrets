import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

const NavigationGuide = () => (
  <Card className="bg-slate-900 border-slate-700 mt-8">
    <CardHeader>
      <CardTitle className="text-white text-2xl flex items-center">
        <Smartphone className="w-6 h-6 mr-3 text-green-400" />
        Navigation Guide
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Main Features Access</h3>
          <ul className="space-y-2 text-slate-300">
            <li><strong>Confessions:</strong> Main page - anonymous posting and viewing</li>
            <li><strong>Partner Check:</strong> Header navigation - background verification</li>
            <li><strong>AI Chat:</strong> EVA/ADAM support companions</li>
            <li><strong>My Diary:</strong> Header navigation - private journaling</li>
            <li><strong>Support:</strong> Header navigation - crisis resources</li>
            <li><strong>Dashboard:</strong> User profile and statistics</li>
            <li><strong>Mood Tracker:</strong> Dashboard quick action or direct navigation</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">User Roles & Access</h3>
          <ul className="space-y-2 text-slate-300">
            <li><strong>Anonymous Users:</strong> View confessions, access support resources</li>
            <li><strong>Registered Users:</strong> Post confessions, access diary, mood tracking, AI chat</li>
            <li><strong>Admin Users:</strong> Full moderation dashboard, user management</li>
          </ul>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default NavigationGuide;
