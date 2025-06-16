
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code, Database, Shield, Server, Globe, Zap, MessageCircle, Brain, Users, Heart } from "lucide-react";

const TechnicalDocumentation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="container mx-auto max-w-6xl">
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mb-6 border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          ← Back to TruthSpace
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
            <Code className="w-10 h-10 mr-4 text-blue-400" />
            Technical Documentation
          </h1>
          <p className="text-slate-400 text-lg">Complete technical overview and roadmap for TruthSpace platform</p>
        </div>

        <div className="space-y-8">
          {/* Current Architecture Overview */}
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

          {/* Enhanced Features Roadmap */}
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

          {/* Enhanced Database Schema */}
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

          {/* Advanced Security Features */}
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

          {/* API & Integration Architecture */}
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

          {/* Performance & Scalability */}
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

          {/* Implementation Timeline */}
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

          {/* Development Setup */}
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
        </div>
      </div>
    </div>
  );
};

export default TechnicalDocumentation;
