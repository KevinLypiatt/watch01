import { Link } from "react-router-dom";
import { Plus, List, FilePlus, Database, BookOpen, FileText, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [introContent, setIntroContent] = useState("");

  const { data: introGuide } = useQuery({
    queryKey: ["introGuide"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("content")
        .eq("id", 6)
        .maybeSingle();
      
      if (error) throw error;
      if (data) setIntroContent(data.content);
      return data;
    },
  });

  const updateIntroMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content })
        .eq("id", 6);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Introduction guide updated successfully",
      });
      setIsEditingIntro(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update introduction guide",
        variant: "destructive",
      });
      console.error("Error updating introduction guide:", error);
    },
  });

  const handleIntroSave = () => {
    updateIntroMutation.mutate(introContent);
  };

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center">
      <div className="flex flex-col gap-4 w-64">
        <Link to="/watches/new">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Add New Watch</span>
          </Button>
        </Link>
        
        <Link to="/watch-list">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <List className="w-5 h-5" />
            <span>Watch List</span>
          </Button>
        </Link>
        
        <Link to="/reference-descriptions/new">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <FilePlus className="w-5 h-5" />
            <span>Add New Reference</span>
          </Button>
        </Link>
        
        <Link to="/reference-descriptions">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <Database className="w-5 h-5" />
            <span>Reference List</span>
          </Button>
        </Link>
        
        <Link to="/system-prompts">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            <span>System Prompts</span>
          </Button>
        </Link>
        
        <Link to="/style-guides">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <Book className="w-5 h-5" />
            <span>Style Guides</span>
          </Button>
        </Link>
        
        <Dialog open={isEditingIntro} onOpenChange={setIsEditingIntro}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Instructions and Guide</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Instructions and Guide</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto">
              <Textarea
                value={introContent}
                onChange={(e) => setIntroContent(e.target.value)}
                className="min-h-[400px]"
              />
            </div>
            <Button onClick={handleIntroSave}>Save Changes</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;