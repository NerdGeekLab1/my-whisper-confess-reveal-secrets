import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  open: boolean;
  onClose: (gender: string | null) => void;
}

const GenderPrompt = ({ userId, open, onClose }: Props) => {
  const [value, setValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => { if (!open) setValue(""); }, [open]);

  const save = async () => {
    if (!value) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ gender: value as any }).eq("id", userId);
    setSaving(false);
    if (error) {
      toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
      return;
    }
    onClose(value);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose(null)}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>One quick thing 💌</DialogTitle>
          <DialogDescription className="text-slate-400">
            Soul Connect pairs your post with someone of the opposite gender for the first reply. We only use this to match — it stays private.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={value} onValueChange={setValue} className="space-y-2 py-2">
          {[
            { v: "female", l: "Female" },
            { v: "male", l: "Male" },
            { v: "other", l: "Other" },
            { v: "undisclosed", l: "Prefer not to say (can't use Soul Connect)" },
          ].map((o) => (
            <div key={o.v} className="flex items-center space-x-2">
              <RadioGroupItem value={o.v} id={`g-${o.v}`} />
              <Label htmlFor={`g-${o.v}`} className="cursor-pointer">{o.l}</Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(null)} className="border-slate-600">Cancel</Button>
          <Button onClick={save} disabled={!value || saving} className="bg-gradient-to-r from-pink-500 to-purple-500">
            {saving ? "Saving..." : "Save & continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenderPrompt;
