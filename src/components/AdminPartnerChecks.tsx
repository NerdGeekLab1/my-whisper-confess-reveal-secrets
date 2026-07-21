import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Trash2, Search, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/lib/adminAudit";

interface Row {
  id: string;
  user_id: string;
  partner_name: string;
  overall_score: number;
  category: string;
  breakdown: any;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
  form_data: any;
  partner_social_handles: any;
  misc_details: any;
  created_at: string;
  updated_at?: string;
}

const scoreColor = (s: number) =>
  s >= 85 ? "bg-green-500/20 text-green-400" :
  s >= 70 ? "bg-blue-500/20 text-blue-400" :
  s >= 50 ? "bg-yellow-500/20 text-yellow-400" :
            "bg-red-500/20 text-red-400";

const AdminPartnerChecks = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);
  const { toast } = useToast();

  const fetchRows = async () => {
    setLoading(true);
    let query = supabase.from("loyalty_scores").select("*").order("created_at", { ascending: false }).limit(200);
    const term = q.trim();
    if (term) query = query.or(`partner_name.ilike.%${term}%,category.ilike.%${term}%`);
    const { data, error } = await query;
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const handleDelete = async (row: Row) => {
    if (!confirm(`Delete partner check "${row.partner_name}"?`)) return;
    const { error } = await supabase.from("loyalty_scores").delete().eq("id", row.id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    await logAdminAction({
      actionType: "delete",
      targetTable: "loyalty_scores",
      targetId: row.id,
      summary: `Deleted partner check for ${row.partner_name}`,
    });
    toast({ title: "Deleted", description: `${row.partner_name} removed` });
    setRows((r) => r.filter((x) => x.id !== row.id));
    if (selected?.id === row.id) setSelected(null);
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" /> Partner Checks
          <Badge variant="outline" className="ml-2 border-slate-600 text-slate-300">{rows.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchRows()}
              placeholder="Search by partner name or category…"
              className="bg-slate-800 border-slate-600 text-white pl-9"
            />
          </div>
          <Button onClick={fetchRows} variant="outline" className="border-slate-600 text-slate-200">Search</Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-400"><Loader2 className="w-5 h-5 animate-spin mr-2" />Loading…</div>
        ) : rows.length === 0 ? (
          <p className="text-slate-400 text-center py-10">No partner checks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-300">Partner</TableHead>
                  <TableHead className="text-slate-300">Score</TableHead>
                  <TableHead className="text-slate-300">Category</TableHead>
                  <TableHead className="text-slate-300">Handles</TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const handleCount = Object.values(r.partner_social_handles || {}).filter((v: any) => v && String(v).trim()).length;
                  return (
                    <TableRow key={r.id} className="border-slate-800">
                      <TableCell className="text-white font-medium">{r.partner_name}</TableCell>
                      <TableCell><Badge className={scoreColor(r.overall_score)}>{r.overall_score}/100</Badge></TableCell>
                      <TableCell className="text-slate-300">{r.category}</TableCell>
                      <TableCell className="text-slate-400">{handleCount} linked</TableCell>
                      <TableCell className="text-slate-400 text-sm">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-200" onClick={() => setSelected(r)}>
                            <Eye className="w-3 h-3 mr-1" /> View
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(r)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              {selected?.partner_name}
              {selected && <Badge className={scoreColor(selected.overall_score)}>{selected.overall_score}/100 · {selected.category}</Badge>}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-5 text-sm">
              <section>
                <h4 className="text-slate-300 font-semibold mb-2">Score Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(selected.breakdown || {}).map(([k, v]) => (
                    <div key={k} className="bg-slate-800 rounded p-2">
                      <div className="text-xs text-slate-400 capitalize">{k}</div>
                      <div className="text-white font-semibold">{String(v)}/100</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-green-400 font-semibold mb-1">Strengths</h4>
                  <ul className="list-disc pl-5 text-slate-300 space-y-1">{selected.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-1">Concerns</h4>
                  <ul className="list-disc pl-5 text-slate-300 space-y-1">{selected.concerns?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-pink-400 font-semibold mb-1">Recommendations</h4>
                  <ul className="list-disc pl-5 text-slate-300 space-y-1">{selected.recommendations?.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              </section>

              <section>
                <h4 className="text-slate-300 font-semibold mb-2">Social Handles</h4>
                {Object.keys(selected.partner_social_handles || {}).length === 0 ? (
                  <p className="text-slate-500 text-xs">None provided.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(selected.partner_social_handles).map(([k, v]) => (
                      v ? <div key={k} className="bg-slate-800 rounded p-2">
                        <div className="text-xs text-slate-400 capitalize">{k}</div>
                        <div className="text-white break-all text-xs">{String(v)}</div>
                      </div> : null
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h4 className="text-slate-300 font-semibold mb-2">Miscellaneous Details</h4>
                {Object.keys(selected.misc_details || {}).length === 0 ? (
                  <p className="text-slate-500 text-xs">None provided.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(selected.misc_details).map(([k, v]) => (
                      v ? <div key={k} className="bg-slate-800 rounded p-2">
                        <div className="text-xs text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
                        <div className="text-white text-xs">{String(v)}</div>
                      </div> : null
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h4 className="text-slate-300 font-semibold mb-2">Original Form Data</h4>
                <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-400 overflow-x-auto">{JSON.stringify(selected.form_data, null, 2)}</pre>
              </section>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs text-slate-500">
                <div>Created {new Date(selected.created_at).toLocaleString()}</div>
                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(selected)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Delete record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminPartnerChecks;
