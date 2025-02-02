import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { WatchForm } from "@/components/watch/WatchForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const EditWatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const watchId = id ? parseInt(id) : undefined;

  const { data: watch, isLoading } = useQuery({
    queryKey: ["watch", watchId],
    queryFn: async () => {
      if (!watchId) throw new Error("Watch ID is required");
      
      const { data, error } = await supabase
        .from("watches")
        .select("*")
        .eq("id", watchId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!watchId,
  });

  const mutation = useMutation({
    mutationFn: async (updatedWatch: any) => {
      if (!watchId) throw new Error("Watch ID is required");
      
      // Remove the id field from the update data
      const { id: _, ...updateData } = updatedWatch;
      
      const { error } = await supabase
        .from("watches")
        .update(updateData)
        .eq("id", watchId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watch", watchId] });
      toast({
        title: "Success",
        description: "Watch updated successfully",
      });
      // Store the watch ID before navigation
      sessionStorage.setItem('lastEditedWatchId', watchId?.toString() || '');
      navigate("/watch-list");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update watch",
        variant: "destructive",
      });
      console.error("Error updating watch:", error);
    },
  });

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
      console.error("Error generating description:", error);
    },
  });

  const [formData, setFormData] = useState<any>(watch || {});

  useEffect(() => {
    if (watch) {
      setFormData(watch);
    }
  }, [watch]);

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
    mutation.mutate(formData);
  };

  if (!watchId) {
    return <div>Invalid watch ID</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageHeader />
      <div className="container mx-auto py-20">
        <Button
          variant="ghost"
          onClick={() => navigate("/watch-list")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to Watch List
        </Button>
        <h1 className="text-2xl font-bold mb-6">Edit Watch</h1>
        
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

export default EditWatch;