import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw, ScrollText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuditEntry {
  id: string;
  actor_user_id: string;
  action_type: string;
  target_table: string;
  target_id: string | null;
  summary: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

const actionBadge = (type: string) => {
  if (type.includes("delete")) return "bg-red-500/20 text-red-400";
  if (type.includes("update") || type.includes("status")) return "bg-blue-500/20 text-blue-400";
  if (type.includes("create") || type.includes("add")) return "bg-green-500/20 text-green-400";
  return "bg-slate-500/20 text-slate-300";
};

const AdminAuditLog = () => {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [actors, setActors] = useState<Record<string, { username: string | null; email: string | null }>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    const entries = (data ?? []) as AuditEntry[];
    setLogs(entries);

    const ids = Array.from(new Set(entries.map((e) => e.actor_user_id))).filter(Boolean);
    if (ids.length) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, email")
        .in("id", ids);
      const map: Record<string, { username: string | null; email: string | null }> = {};
      (profiles ?? []).forEach((p: any) => {
        map[p.id] = { username: p.username, email: p.email };
      });
      setActors(map);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();

    const channel = (supabase as any)
      .channel("admin-audit-logs")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "admin_audit_logs" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center">
          <ScrollText className="w-5 h-5 mr-2 text-blue-400" />
          Admin Audit Log
        </CardTitle>
        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center text-slate-400 py-6">No admin actions recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-300">When</TableHead>
                <TableHead className="text-slate-300">Admin</TableHead>
                <TableHead className="text-slate-300">Action</TableHead>
                <TableHead className="text-slate-300">Target</TableHead>
                <TableHead className="text-slate-300">Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((entry) => {
                const actor = actors[entry.actor_user_id];
                return (
                  <TableRow key={entry.id} className="border-slate-700">
                    <TableCell className="text-slate-300 text-xs whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-200 text-sm">
                      {actor?.username || actor?.email || entry.actor_user_id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <Badge className={actionBadge(entry.action_type)}>{entry.action_type}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-300 text-xs">
                      {entry.target_table}
                      {entry.target_id ? <span className="text-slate-500"> · {entry.target_id.slice(0, 8)}</span> : null}
                    </TableCell>
                    <TableCell className="text-slate-200 text-sm">{entry.summary}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminAuditLog;