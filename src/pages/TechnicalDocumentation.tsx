
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code, Database, Shield, Server, Globe, Zap } from "lucide-react";

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
          <p className="text-slate-400 text-lg">Complete technical overview of TruthSpace platform</p>
        </div>

        <div className="space-y-8">
          {/* Architecture Overview */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Server className="w-6 h-6 mr-3 text-green-400" />
                System Architecture
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

          {/* Database Schema */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Database className="w-6 h-6 mr-3 text-purple-400" />
                Database Schema
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Core Tables</h3>
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
                  <h3 className="text-lg font-semibold text-white mb-3">Supporting Tables</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-300">diary_entries</h4>
                      <p className="text-sm text-slate-400 mb-2">Private user diary system</p>
                      <ul className="text-xs space-y-1">
                        <li>• id, user_id, title, content</li>
                        <li>• mood, is_private</li>
                        <li>• created_at, updated_at</li>
                      </ul>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-300">reports</h4>
                      <p className="text-sm text-slate-400 mb-2">Content moderation system</p>
                      <ul className="text-xs space-y-1">
                        <li>• id, post_id, reporter_id</li>
                        <li>• reason, status</li>
                        <li>• created_at</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Shield className="w-6 h-6 mr-3 text-red-400" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Authentication</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• JWT-based authentication</li>
                    <li>• Email/password signup</li>
                    <li>• Role-based access control</li>
                    <li>• Demo account system</li>
                    <li>• Automatic profile creation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Row Level Security</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• User can only access own data</li>
                    <li>• Public posts visible to all</li>
                    <li>• Admin oversight capabilities</li>
                    <li>• Private diary protection</li>
                    <li>• Report moderation access</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Privacy Features</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Anonymous posting option</li>
                    <li>• No tracking cookies</li>
                    <li>• Encrypted data transmission</li>
                    <li>• GDPR compliance ready</li>
                    <li>• Data deletion capabilities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Globe className="w-6 h-6 mr-3 text-cyan-400" />
                API Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Supabase Client Setup</h3>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <code className="text-green-300 text-sm">
                      {`const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);`}
                    </code>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Key Operations</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• User authentication & signup</li>
                    <li>• Profile management</li>
                    <li>• Post CRUD operations</li>
                    <li>• Diary entry management</li>
                    <li>• Report submission</li>
                    <li>• Real-time subscriptions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Features */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-2xl">
                <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                Performance & Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Frontend Optimization</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• React 18 concurrent features</li>
                    <li>• Component lazy loading</li>
                    <li>• Tailwind CSS purging</li>
                    <li>• Vite hot module replacement</li>
                    <li>• Tree shaking optimization</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Data Management</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• TanStack Query caching</li>
                    <li>• Optimistic updates</li>
                    <li>• Background refetching</li>
                    <li>• Error boundary handling</li>
                    <li>• Connection state management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Database Performance</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• PostgreSQL indexing</li>
                    <li>• Connection pooling</li>
                    <li>• Query optimization</li>
                    <li>• Real-time subscriptions</li>
                    <li>• CDN asset delivery</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Setup */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Development Setup</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-4">
              <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Local Development</h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-slate-700 p-3 rounded">
                    <code className="text-green-300">npm install</code>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <code className="text-green-300">npm run dev</code>
                  </div>
                  <p className="text-slate-400 mt-2">Runs on localhost:5173 with hot reloading</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Environment Variables</h3>
                  <div className="bg-slate-800 p-3 rounded text-sm">
                    <code className="text-cyan-300">
                      VITE_SUPABASE_URL=your_supabase_url<br/>
                      VITE_SUPABASE_ANON_KEY=your_anon_key
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
