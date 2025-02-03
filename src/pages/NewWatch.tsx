import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { WatchForm } from "@/components/watch/WatchForm";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";

const NewWatch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDescriptionMutation = useMutation({
    mutationFn: async (watchData: any) => {
      const response = await supabase.functions.invoke('generate-watch-description', {
        body: { watchData },
      });
      
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      setFormData(prev => ({
        ...prev,
        description: data.description,
      }));
      toast({
        title: "Success",
        description: "Description generated successfully",
      });
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const createWatchMutation = useMutation({
    mutationFn: async (newWatch: any) => {
      const { error } = await supabase
        .from("watches")
        .insert([newWatch]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Watch created successfully",
      });
      navigate("/watch-list");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerateDescription = () => {
    setIsGenerating(true);
    generateDescriptionMutation.mutate(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWatchMutation.mutate(formData);
  };

  return (
    <div>
      <PageHeaderWithModel title="New Watch" />
      <div className="container mx-auto py-20">
        <div className="mb-6">
          <Link to="/watch-list" className="text-primary hover:underline">
            To Watch List
          </Link>
        </div>
        
        <WatchForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleGenerateDescription={handleGenerateDescription}
          isGenerating={isGenerating}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default NewWatch;
