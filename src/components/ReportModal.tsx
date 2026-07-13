import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Loader2 } from "lucide-react";

const REASONS = [
  "Hateful or harassing content",
  "Personal information / doxing",
  "Sexual or explicit content",
  "Spam or misleading",
  "Threat or self-harm",
  "Other (describe below)",
];

interface Props {
  open: boolean;
  onClose: () => void;
  postId: string;
  userId?: string | null;
}

const ReportModal = ({ open, onClose, postId, userId }: Props) => {
  const [reason, setReason] = useState(REASONS[0]);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const submit = async () => {
    if (!userId) {
      toast({ title: "Login required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const full = note.trim() ? `${reason} — ${note.trim().slice(0, 500)}` : reason;
    const { error } = await supabase.from("reports").insert({
      post_id: postId,
      reporter_id: userId,
      reason: full,
      status: "pending",
    });
    // bump post reports_count so admin can see flagged content
    if (!error) {
      await (supabase.rpc as any)("noop"); // ignore
      await supabase
        .from("posts")
        .update({ reports_count: (await supabase.from("posts").select("reports_count").eq("id", postId).single()).data?.reports_count + 1 || 1 })
        .eq("id", postId);
    }
    setSubmitting(false);
    if (error) {
      toast({ title: "Report failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Reported", description: "Thanks. Our admins will review this post." });
    setNote("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Report this post
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            {REASONS.map((r) => (
              <div key={r} className="flex items-center gap-2">
                <RadioGroupItem value={r} id={r} />
                <Label htmlFor={r} className="text-slate-200 text-sm">{r}</Label>
              </div>
            ))}
          </RadioGroup>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add details (optional)"
            maxLength={500}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-600">Cancel</Button>
          <Button onClick={submit} disabled={submitting} className="bg-red-600 hover:bg-red-700">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
