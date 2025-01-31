import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { ReferenceDescriptionHeader } from "@/components/reference-descriptions/ReferenceDescriptionHeader";
import { ReferenceDescriptionFilters } from "@/components/reference-descriptions/ReferenceDescriptionFilters";
import { ReferenceDescriptionTable } from "@/components/reference-descriptions/ReferenceDescriptionTable";
import { useGenerateDescriptions } from "@/hooks/useGenerateDescriptions";
import { useToast } from "@/hooks/use-toast";

const ReferenceDescriptions = () => {
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("brand");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [styleGuide, setStyleGuide] = useState("");

  const generateMutation = useGenerateDescriptions();

  const { data: references, isLoading } = useQuery({
    queryKey: ["references", brandFilter, referenceFilter, searchTerm, sortColumn, sortDirection],
    queryFn: async () => {
      let query = supabase.from("reference_descriptions").select("*");

      if (brandFilter) {
        query = query.ilike("brand", `%${brandFilter}%`);
      }
      if (referenceFilter) {
        query = query.ilike("reference_name", `%${referenceFilter}%`);
      }
      if (searchTerm) {
        query = query.or(
          `brand.ilike.%${searchTerm}%,reference_name.ilike.%${searchTerm}%,reference_description.ilike.%${searchTerm}%`
        );
      }
      
      query = query.order(sortColumn, { ascending: sortDirection === 'asc' });

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: styleGuides } = useQuery({
    queryKey: ["styleGuides"],
    queryFn: async () => {
      const { data: systemPromptData, error: systemPromptError } = await supabase
        .from("style_guides")
        .select("content")
        .eq("id", 5)
        .maybeSingle();

      const { data: styleGuideData, error: styleGuideError } = await supabase
        .from("style_guides")
        .select("content")
        .eq("id", 4)
        .maybeSingle();
      
      if (systemPromptError || styleGuideError) {
        console.error("Error fetching guides:", { systemPromptError, styleGuideError });
        return [];
      }
      
      if (systemPromptData) setSystemPrompt(systemPromptData.content);
      if (styleGuideData) setStyleGuide(styleGuideData.content);
      
      return [systemPromptData, styleGuideData].filter(Boolean);
    },
  });

  const updateSystemPromptMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content: systemPrompt })
        .eq("id", 5);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "System prompt updated successfully",
      });
      setIsEditingPrompt(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update system prompt",
        variant: "destructive",
      });
      console.error("Error updating system prompt:", error);
    },
  });

  const updateStyleGuideMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content: styleGuide })
        .eq("id", 4);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Style guide updated successfully",
      });
      setIsEditingGuide(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update style guide",
        variant: "destructive",
      });
      console.error("Error updating style guide:", error);
    },
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setBrandFilter(brandInput);
    setReferenceFilter(referenceInput);
  };

  const handleGenerateAll = () => {
    generateMutation.mutate();
  };

  const handleSystemPromptSave = () => {
    updateSystemPromptMutation.mutate();
  };

  const handleStyleGuideSave = () => {
    updateStyleGuideMutation.mutate();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <PageHeader />
      <div className="container mx-auto py-20">
        <ReferenceDescriptionHeader
          isGenerating={generateMutation.isPending}
          isEditingPrompt={isEditingPrompt}
          isEditingGuide={isEditingGuide}
          systemPrompt={systemPrompt}
          styleGuide={styleGuide}
          setIsEditingPrompt={setIsEditingPrompt}
          setIsEditingGuide={setIsEditingGuide}
          setSystemPrompt={setSystemPrompt}
          setStyleGuide={setStyleGuide}
          handleSystemPromptSave={handleSystemPromptSave}
          handleStyleGuideSave={handleStyleGuideSave}
          handleGenerateAll={handleGenerateAll}
        />

        <ReferenceDescriptionFilters
          brandInput={brandInput}
          referenceInput={referenceInput}
          searchInput={searchInput}
          setBrandInput={setBrandInput}
          setReferenceInput={setReferenceInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />

        <ReferenceDescriptionTable
          references={references || []}
          handleSort={handleSort}
        />
      </div>
    </div>
  );
};

export default ReferenceDescriptions;