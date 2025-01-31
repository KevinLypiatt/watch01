import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const EditReferenceDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNewReference = !id;

  const { data: reference, isLoading } = useQuery({
    queryKey: ["reference", id],
    queryFn: async () => {
      if (isNewReference) return null;
      
      const { data, error } = await supabase
        .from("reference_descriptions")
        .select("*")
        .eq("reference_id", parseInt(id as string))
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !isNewReference, // Only run query if we're editing an existing reference
  });

  const mutation = useMutation({
    mutationFn: async (updatedReference: any) => {
      if (isNewReference) {
        const { error } = await supabase
          .from("reference_descriptions")
          .insert(updatedReference);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("reference_descriptions")
          .update(updatedReference)
          .eq("reference_id", parseInt(id as string));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reference", id] });
      toast({
        title: "Success",
        description: isNewReference 
          ? "Reference description created successfully"
          : "Reference description updated successfully",
      });
      navigate("/reference-descriptions");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: isNewReference
          ? "Failed to create reference description"
          : "Failed to update reference description",
        variant: "destructive",
      });
      console.error("Error with reference:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const updatedReference = {
      brand: formData.get("brand"),
      reference_name: formData.get("reference_name"),
      reference_description: formData.get("reference_description"),
    };
    mutation.mutate(updatedReference);
  };

  if (isLoading && !isNewReference) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageHeader />
      <div className="container mx-auto py-20">
        <Button
          variant="ghost"
          onClick={() => navigate("/reference-descriptions")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to References
        </Button>
        <h1 className="text-2xl font-bold mb-6">
          {isNewReference ? "New Reference Description" : "Edit Reference Description"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <Input
              name="brand"
              defaultValue={reference?.brand || ""}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reference Name</label>
            <Input
              name="reference_name"
              defaultValue={reference?.reference_name || ""}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              name="reference_description"
              defaultValue={reference?.reference_description || ""}
              className="w-full min-h-[200px]"
            />
          </div>
          <Button type="submit">
            {isNewReference ? "Create Reference" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditReferenceDescription;