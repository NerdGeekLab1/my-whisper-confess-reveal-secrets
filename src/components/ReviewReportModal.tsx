import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Loader2, CheckCircle, XCircle, ExternalLink, FileText, History, Image as ImageIcon, Link as LinkIcon, ZoomIn, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/lib/adminAudit";

type Decision = "approve" | "deny";
type ReasonCode =
  | "no_violation"
  | "violation_removed"
  | "violation_warned"
  | "duplicate_report"
  | "insufficient_evidence"
  | "user_banned";

const REASON_OPTIONS: { code: ReasonCode; label: string; appliesTo: Decision[] }[] = [
  { code: "no_violation", label: "No violation found — content stays", appliesTo: ["deny"] },
  { code: "duplicate_report", label: "Duplicate of an existing report", appliesTo: ["deny"] },
  { code: "insufficient_evidence", label: "Insufficient evidence to act", appliesTo: ["deny"] },
  { code: "violation_warned", label: "Violation confirmed — author warned", appliesTo: ["approve"] },
  { code: "violation_removed", label: "Violation confirmed — post removed", appliesTo: ["approve"] },
  { code: "user_banned", label: "Severe violation — user actioned", appliesTo: ["approve"] },
];

interface ReviewReportModalProps {
  reportId: string | null;
  open: boolean;
  onClose: () => void;
  onResolved: (reportId: string) => void;
}

const URL_RE = /(https?:\/\/[^\s)]+)/gi;
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i;

const extractUrls = (...sources: (string | null | undefined)[]): string[] => {
  const set = new Set<string>();
  for (const s of sources) {
    if (!s) continue;
    const matches = s.match(URL_RE);
    matches?.forEach((u) => set.add(u.replace(/[.,;]+$/, "")));
  }
  return Array.from(set);
};

const ReviewReportModal = ({ reportId, open, onClose, onResolved }: ReviewReportModalProps) => {
  const [report, setReport] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [decision, setDecision] = useState<Decision>("approve");
  const [reasonCode, setReasonCode] = useState<ReasonCode>("violation_removed");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!open || !reportId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setReport(null);
      setPost(null);
      setTimeline([]);
      setNotes("");
      setDecision("approve");
      setReasonCode("violation_removed");

      const { data: r } = await supabase.from("reports").select("*").eq("id", reportId).maybeSingle();
      if (cancelled) return;
      setReport(r);

      let postData: any = null;
      if (r?.post_id) {
        const { data: p } = await supabase.from("posts").select("*").eq("id", r.post_id).maybeSingle();
        if (cancelled) return;
        postData = p;
        setPost(p);
      }

      // Timeline: prior audit-log entries for this report or post
      const ids = [reportId, r?.post_id].filter(Boolean) as string[];
      if (ids.length > 0) {
        const { data: logs } = await (supabase as any)
          .from("admin_audit_logs")
          .select("*")
          .in("target_id", ids)
          .order("created_at", { ascending: false })
          .limit(20);
        if (!cancelled) setTimeline(logs ?? []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [open, reportId]);

  // Reset reasonCode to a valid one when decision flips
  useEffect(() => {
    const valid = REASON_OPTIONS.filter(r => r.appliesTo.includes(decision));
    if (!valid.some(r => r.code === reasonCode)) {
      setReasonCode(valid[0].code);
    }
  }, [decision, reasonCode]);

  const evidenceUrls = useMemo(
    () => extractUrls(report?.reason, post?.content, post?.title),
    [report, post]
  );

  const handleSubmit = async () => {
    if (!report) return;
    setSubmitting(true);

    const newReportStatus = decision === "approve" ? "resolved" : "dismissed";

    const { error: reportErr } = await supabase
      .from("reports")
      .update({ status: newReportStatus })
      .eq("id", report.id);

    if (reportErr) {
      toast({ title: "Failed to update report", description: reportErr.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    if (decision === "approve" && post && reasonCode === "violation_removed") {
      await supabase.from("posts").update({ status: "flagged" }).eq("id", post.id);
    }

    const reasonLabel = REASON_OPTIONS.find(r => r.code === reasonCode)?.label ?? reasonCode;

    await logAdminAction({
      actionType: decision === "approve" ? "report_approved" : "report_denied",
      targetTable: "reports",
      targetId: report.id,
      summary: `Report ${report.id.slice(0, 8)} ${decision === "approve" ? "upheld" : "dismissed"}: ${reasonLabel}`,
      metadata: {
        decision,
        reason_code: reasonCode,
        reason_label: reasonLabel,
        notes: notes.trim() || null,
        post_id: report.post_id,
        post_title: post?.title ?? null,
        post_status_after: decision === "approve" && reasonCode === "violation_removed" ? "flagged" : post?.status ?? null,
        original_reason: report.reason,
        evidence_urls: evidenceUrls,
      },
    });

    toast({
      title: decision === "approve" ? "Report upheld" : "Report dismissed",
      description: reasonLabel,
    });

    onResolved(report.id);
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-400" />
            Review Report
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Inspect evidence, review prior actions, and record a structured resolution. Your decision is written to the audit log.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : !report ? (
          <p className="text-slate-400 py-8 text-center">Report not found.</p>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wide text-slate-400">Report reason</span>
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{report.status}</Badge>
              </div>
              <p className="text-sm text-white whitespace-pre-wrap">{report.reason}</p>
              <p className="text-xs text-slate-500 mt-2">
                Filed {report.created_at ? new Date(report.created_at).toLocaleString() : "—"}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wide text-slate-400">Reported post</span>
                {post?.id && (
                  <a
                    href={`/?post=${post.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    Open <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              {post ? (
                <>
                  <h4 className="text-white font-semibold mb-1">{post.title}</h4>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap line-clamp-6">{post.content}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <Badge variant="outline" className="text-slate-300 border-slate-600">
                      {post.category || "uncategorized"}
                    </Badge>
                    <Badge className="bg-slate-700 text-slate-200">status: {post.status}</Badge>
                    <Badge className="bg-slate-700 text-slate-200">reports: {post.reports_count ?? 0}</Badge>
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-sm italic">Post no longer exists.</p>
              )}
            </div>

            {/* Evidence carousel */}
            {evidenceUrls.length > 0 && (
              <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wide text-slate-400 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Evidence ({evidenceUrls.length})
                  </span>
                </div>
                <Carousel className="w-full">
                  <CarouselContent>
                    {evidenceUrls.map((url, i) => {
                      const isImage = IMAGE_EXT.test(url);
                      return (
                        <CarouselItem key={i}>
                          <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 min-h-[200px] flex flex-col">
                            <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
                              <span>{i + 1} / {evidenceUrls.length}</span>
                              <a href={url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                                Open <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            {isImage ? (
                              <img
                                src={url}
                                alt={`Evidence ${i + 1}`}
                                loading="lazy"
                                className="max-h-[320px] w-auto mx-auto rounded object-contain"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div className="flex-1 flex items-center justify-center text-slate-300 text-sm break-all p-4">
                                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                                {url}
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  {evidenceUrls.length > 1 && (
                    <>
                      <CarouselPrevious className="bg-slate-800 border-slate-600 text-white" />
                      <CarouselNext className="bg-slate-800 border-slate-600 text-white" />
                    </>
                  )}
                </Carousel>
              </div>
            )}

            {/* Resolution timeline */}
            <div className="p-4 rounded-lg bg-slate-800/60 border border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <History className="w-4 h-4 text-slate-400" />
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  Prior actions ({timeline.length})
                </span>
              </div>
              {timeline.length === 0 ? (
                <p className="text-sm text-slate-500 italic">No previous admin actions on this report or post.</p>
              ) : (
                <ol className="space-y-2 max-h-56 overflow-y-auto pr-2">
                  {timeline.map((log) => (
                    <li key={log.id} className="text-xs border-l-2 border-slate-600 pl-3 py-1">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-300">
                          {log.action_type}
                        </Badge>
                        <span className="text-slate-500">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-200 mt-1">{log.summary}</p>
                      {log.metadata?.notes && (
                        <p className="text-slate-400 italic mt-1">"{log.metadata.notes}"</p>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-slate-200">Decision</Label>
              <RadioGroup value={decision} onValueChange={(v) => setDecision(v as Decision)} className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${decision === "approve" ? "border-green-500 bg-green-500/10" : "border-slate-700 bg-slate-800/40"}`}>
                  <RadioGroupItem value="approve" className="border-slate-500" />
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">Approve report</span>
                </label>
                <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${decision === "deny" ? "border-red-500 bg-red-500/10" : "border-slate-700 bg-slate-800/40"}`}>
                  <RadioGroupItem value="deny" className="border-slate-500" />
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-white">Deny report</span>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Resolution reason</Label>
              <RadioGroup value={reasonCode} onValueChange={(v) => setReasonCode(v as ReasonCode)} className="space-y-1">
                {REASON_OPTIONS.filter(r => r.appliesTo.includes(decision)).map((opt) => (
                  <label key={opt.code} className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 cursor-pointer">
                    <RadioGroupItem value={opt.code} className="border-slate-500" />
                    <span className="text-sm text-slate-200">{opt.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any context for the audit trail..."
                className="bg-slate-800 border-slate-600 text-white min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-slate-500">{notes.length}/500</p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!report || submitting}
            className={decision === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {decision === "approve" ? "Uphold report" : "Dismiss report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewReportModal;
