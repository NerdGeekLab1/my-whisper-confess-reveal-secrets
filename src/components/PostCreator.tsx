
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Shield, AlertTriangle, Camera, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PostCreatorProps {
  onClose: () => void;
}

const PostCreator = ({ onClose }: PostCreatorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [includeEvidence, setIncludeEvidence] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: "long-term", label: "Long-term Relationship" },
    { value: "marriage", label: "Marriage" },
    { value: "engagement", label: "Engagement" },
    { value: "dating", label: "Dating" },
    { value: "friends", label: "Friends Involved" },
    { value: "workplace", label: "Workplace" },
    { value: "online", label: "Online/Digital" },
    { value: "other", label: "Other" }
  ];

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to post.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      title,
      content,
      category,
      is_anonymous: true,
      status: "approved",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Story shared!", description: "Your anonymous story has been posted." });
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Share Your Story Anonymously
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-medium text-white mb-1">Complete Privacy Guaranteed</p>
                <p>Your identity is never stored or tracked. All posts are completely anonymous.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Title</label>
            <Input placeholder="Give your story a title..." value={title} onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-slate-700">{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Your Story</label>
            <Textarea placeholder="Share your experience..." value={content} onChange={(e) => setContent(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[150px] resize-none" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Include Evidence</label>
              <Button variant="outline" size="sm" onClick={() => setIncludeEvidence(!includeEvidence)}
                className={cn("border-slate-600", includeEvidence ? "bg-slate-700 text-white" : "text-slate-400")}>
                {includeEvidence ? "Added" : "Add Evidence"}
              </Button>
            </div>
            {includeEvidence && (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-orange-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Evidence Upload</span>
                </div>
                <p className="text-xs text-slate-400">Only upload evidence you own. All identifying information will be automatically blurred.</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Camera className="w-4 h-4 mr-2" />Screenshots
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <FileText className="w-4 h-4 mr-2" />Messages
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Tags (Optional)</label>
            <div className="flex space-x-2">
              <Input placeholder="Add a tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400" />
              <Button onClick={addTag} variant="outline" className="border-slate-600">Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-slate-600 text-slate-300">
                    #{tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:text-white"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1 border-slate-600">Cancel</Button>
            <Button onClick={handleSubmit} disabled={!title || !content || !category || isSubmitting}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
              {isSubmitting ? "Posting..." : "Post Anonymously"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCreator;
