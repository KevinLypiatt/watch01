import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { ReferenceDescriptionForm } from "@/components/reference-descriptions/ReferenceDescriptionForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const EditReferenceDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const [brand, setBrand] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [description, setDescription] = useState("");

  // Fetch existing reference data
  const { data: reference } = useQuery({
    queryKey: ['reference', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reference_descriptions')
        .select('*')
        .eq('reference_id', id)
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
        .eq('reference_id', id);

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
          referenceId: id,
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
      <PageHeaderWithModel title="Edit Reference Description" />
      <div className="container mx-auto pt-24 pb-12">
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