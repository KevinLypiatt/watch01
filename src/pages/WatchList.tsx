
import { useState, useEffect } from "react";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { WatchListHeader } from "@/components/watch-list/WatchListHeader";
import { WatchListTable } from "@/components/watch-list/WatchListTable";
import { WatchListFilters } from "@/components/watch-list/WatchListFilters";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const WatchList = () => {
  const [sortColumn, setSortColumn] = useState<string>('brand');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [brandInput, setBrandInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeGenerationModel, setActiveGenerationModel] = useState<string>(() => {
    const saved = localStorage.getItem("activeGenerationModel");
    return saved || "claude-3-opus-20240229";
  });

  useEffect(() => {
    localStorage.setItem("activeGenerationModel", activeGenerationModel);
  }, [activeGenerationModel]);

  const { data: watches = [], refetch } = useQuery({
    queryKey: ['watches', sortColumn, sortDirection, brandInput, modelInput, searchInput],
    queryFn: async () => {
      let query = supabase
        .from('watches')
        .select('*')
        .order(sortColumn, { ascending: sortDirection === 'asc' });

      if (brandInput) {
        query = query.ilike('brand', `%${brandInput}%`);
      }
      if (modelInput) {
        query = query.ilike('model_reference', `%${modelInput}%`);
      }
      if (searchInput) {
        query = query.or(`brand.ilike.%${searchInput}%,model_name.ilike.%${searchInput}%,model_reference.ilike.%${searchInput}%,description.ilike.%${searchInput}%`);
      }
      
      const { data, error } = await query;
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
      .from('watches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting watch:', error);
      return;
    }

    refetch();
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeaderWithModel 
        activeModel={activeGenerationModel}
        title="Watch List" 
      />
      <div className="pt-16">
        <WatchListHeader />
        <WatchListFilters
          brandInput={brandInput}
          modelInput={modelInput}
          searchInput={searchInput}
          setBrandInput={setBrandInput}
          setModelInput={setModelInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />
        <WatchListTable 
          watches={watches}
          handleSort={handleSort}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default WatchList;
