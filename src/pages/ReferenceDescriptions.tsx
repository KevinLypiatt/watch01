import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { ReferenceDescriptionHeader } from "@/components/reference-descriptions/ReferenceDescriptionHeader";
import { ReferenceDescriptionFilters } from "@/components/reference-descriptions/ReferenceDescriptionFilters";
import { ReferenceDescriptionTable } from "@/components/reference-descriptions/ReferenceDescriptionTable";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [styleGuide, setStyleGuide] = useState("");
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isEditingGuide, setIsEditingGuide] = useState(false);

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
      
      query = query.order('brand', { ascending: true }).order('reference_name', { ascending: true });
      
      if (sortColumn) {
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: styleGuides } = useQuery({
    queryKey: ["styleGuides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*")
        .in("id", [4, 5]);
      if (error) throw error;
      
      // Set the content for system prompt (id: 5) and style guide (id: 4)
      const systemPromptGuide = data?.find(guide => guide.id === 5);
      const styleGuideContent = data?.find(guide => guide.id === 4);
      
      if (systemPromptGuide) setSystemPrompt(systemPromptGuide.content);
      if (styleGuideContent) setStyleGuide(styleGuideContent.content);
      
      return data || [];
    },
  });

  const updateStyleGuideMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Style guide updated successfully",
      });
      setIsEditingPrompt(false);
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

  const handleSystemPromptSave = () => {
    updateStyleGuideMutation.mutate({
      id: 5,
      content: systemPrompt,
    });
  };

  const handleStyleGuideSave = () => {
    updateStyleGuideMutation.mutate({
      id: 4,
      content: styleGuide,
    });
  };

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
    setIsGenerating(true);
    generateMutation.mutate();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <PageHeader />
      <div className="container mx-auto py-20">
        <ReferenceDescriptionHeader
          isGenerating={isGenerating}
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
