import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const EditWatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Convert id to number
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
    enabled: !!watchId, // Only run query if we have a valid ID
  });

  const mutation = useMutation({
    mutationFn: async (updatedWatch: any) => {
      if (!watchId) throw new Error("Watch ID is required");
      
      const { error } = await supabase
        .from("watches")
        .update(updatedWatch)
        .eq("id", watchId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watch", watchId] });
      toast({
        title: "Success",
        description: "Watch updated successfully",
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const updatedWatch = {
      brand: formData.get("brand"),
      model_name: formData.get("model_name"),
      model_reference: formData.get("model_reference"),
      case_material: formData.get("case_material"),
      year: formData.get("year"),
      movement_type: formData.get("movement_type"),
      listing_reference: formData.get("listing_reference"),
      condition: formData.get("condition"),
      additional_information: formData.get("additional_information"),
      description: formData.get("description"),
    };
    mutation.mutate(updatedWatch);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <Input
                name="brand"
                defaultValue={watch?.brand || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model Name</label>
              <Input
                name="model_name"
                defaultValue={watch?.model_name || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Model Reference</label>
              <Input
                name="model_reference"
                defaultValue={watch?.model_reference || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Case Material</label>
              <Input
                name="case_material"
                defaultValue={watch?.case_material || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <Input
                name="year"
                type="number"
                defaultValue={watch?.year || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Movement Type</label>
              <Input
                name="movement_type"
                defaultValue={watch?.movement_type || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Listing Reference</label>
              <Input
                name="listing_reference"
                defaultValue={watch?.listing_reference || ""}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <Input
                name="condition"
                defaultValue={watch?.condition || ""}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Additional Information</label>
            <Textarea
              name="additional_information"
              defaultValue={watch?.additional_information || ""}
              className="min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              name="description"
              defaultValue={watch?.description || ""}
              className="min-h-[200px]"
            />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default EditWatch;