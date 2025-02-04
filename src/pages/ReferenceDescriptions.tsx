import { useState, useEffect } from "react";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { ReferenceDescriptionHeader } from "@/components/reference-descriptions/ReferenceDescriptionHeader";
import { ReferenceDescriptionTable } from "@/components/reference-descriptions/ReferenceDescriptionTable";
import { useGenerateDescriptions } from "@/hooks/useGenerateDescriptions";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ReferenceDescriptions = () => {
  const [sortColumn, setSortColumn] = useState<string>('brand');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeGenerationModel, setActiveGenerationModel] = useState<string>(() => {
    const saved = localStorage.getItem("activeGenerationModel");
    return saved || "claude-3-opus-20240229";
  });

  useEffect(() => {
    localStorage.setItem("activeGenerationModel", activeGenerationModel);
  }, [activeGenerationModel]);

  const { data: references = [], refetch } = useQuery({
    queryKey: ['references'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reference_descriptions')
        .select('*')
        .order(sortColumn, { ascending: sortDirection === 'asc' });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('reference_descriptions')
      .delete()
      .eq('reference_id', id);

    if (error) {
      console.error('Error deleting reference:', error);
      return;
    }

    refetch();
  };

  const generateMutation = useGenerateDescriptions();

  return (
    <div className="container mx-auto py-8">
      <PageHeaderWithModel 
        activeModel={activeGenerationModel}
        title="Reference Descriptions" 
      />
      <div className="pt-16">
        <ReferenceDescriptionHeader
          isGenerating={generateMutation.isPending}
          handleGenerateAll={() => generateMutation.mutate()}
        />
        <ReferenceDescriptionTable 
          references={references}
          handleSort={handleSort}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ReferenceDescriptions;
