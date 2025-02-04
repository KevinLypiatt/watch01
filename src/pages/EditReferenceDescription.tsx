import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { ReferenceDescriptionForm } from "@/components/reference-descriptions/ReferenceDescriptionForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const EditReferenceDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGenerationModel, setActiveGenerationModel] = useState<string>(() => {
    const saved = localStorage.getItem("activeGenerationModel");
    return saved || "claude-3-opus-20240229";
  });

  const [brand, setBrand] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [description, setDescription] = useState("");

  // Validate ID is a valid number
  const numericId = id ? parseInt(id) : null;
  if (!numericId || isNaN(numericId)) {
    toast({
      title: "Error",
      description: "Invalid reference ID",
      variant: "destructive",
    });
    navigate("/reference-descriptions");
    return null;
  }

  // Fetch existing reference data
  const { data: reference } = useQuery({
    queryKey: ['reference', numericId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reference_descriptions')
        .select('*')
        .eq('reference_id', numericId)
        .single();
      
      if (error) throw error;
      
      // Update local state with fetched data
      setBrand(data.brand || "");
      setReferenceName(data.reference_name || "");
      setDescription(data.reference_description || "");
      
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('reference_descriptions')
        .update({
          brand,
          reference_name: referenceName,
          reference_description: description,
        })
        .eq('reference_id', numericId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reference description updated successfully",
      });
      navigate("/reference-descriptions");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update reference description",
        variant: "destructive",
      });
    },
  });

  const generateDescriptionMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-reference-descriptions', {
        body: { 
          referenceId: numericId,
          brand,
          reference_name: referenceName
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setDescription(data.description);
      toast({
        title: "Success",
        description: "Generation finished...",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  const handleGenerateDescription = () => {
    setIsGenerating(true);
    generateDescriptionMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeaderWithModel activeModel={activeGenerationModel} title="Edit Reference Description" />
      <div className="container mx-auto pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/reference-descriptions")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to References
        </Button>
        <ReferenceDescriptionForm
          id={id}
          brand={brand}
          referenceName={referenceName}
          description={description}
          isGenerating={isGenerating}
          handleBrandChange={(e) => setBrand(e.target.value)}
          handleReferenceNameChange={(e) => setReferenceName(e.target.value)}
          handleDescriptionChange={(e) => setDescription(e.target.value)}
          handleSubmit={handleSubmit}
          handleGenerateDescription={handleGenerateDescription}
        />
      </div>
    </div>
  );
};

export default EditReferenceDescription;
