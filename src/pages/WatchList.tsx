import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Plus, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const WatchList = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: watches, isLoading } = useQuery({
    queryKey: ["watches", searchTerm, brandFilter, modelFilter, sortColumn, sortDirection],
    queryFn: async () => {
      let query = supabase.from("watches").select("*");

      if (brandFilter) {
        query = query.ilike("brand", `%${brandFilter}%`);
      }
      if (modelFilter) {
        query = query.ilike("model_reference", `%${modelFilter}%`);
      }
      if (searchTerm) {
        query = query.or(
          `brand.ilike.%${searchTerm}%,model_name.ilike.%${searchTerm}%,model_reference.ilike.%${searchTerm}%`
        );
      }
      if (sortColumn) {
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
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
    setModelFilter(modelInput);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading watches...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader />
      <div className="container mx-auto py-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Watch List</h1>
          <Button onClick={() => navigate("/watches/new")}>
            <Plus className="mr-2" />
            Add New Watch
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Filter by brand..."
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Input
              placeholder="Filter by model reference..."
              value={modelInput}
              onChange={(e) => setModelInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Input
              placeholder="Search all fields..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              variant="outline"
              className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('brand')} className="cursor-pointer hover:bg-muted/50">
                  Brand
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort('model_reference')} className="cursor-pointer hover:bg-muted/50">
                  Model Reference
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort('model_name')} className="cursor-pointer hover:bg-muted/50">
                  Model Name
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort('case_material')} className="cursor-pointer hover:bg-muted/50">
                  Case Material
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort('year')} className="cursor-pointer hover:bg-muted/50">
                  Year
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort('movement_type')} className="cursor-pointer hover:bg-muted/50">
                  Movement Type
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort('condition')} className="cursor-pointer hover:bg-muted/50">
                  Condition
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {watches && watches.length > 0 ? (
                watches.map((watch) => (
                  <TableRow key={watch.id}>
                    <TableCell>{watch.brand || "-"}</TableCell>
                    <TableCell>{watch.model_reference || "-"}</TableCell>
                    <TableCell>{watch.model_name || "-"}</TableCell>
                    <TableCell>{watch.case_material || "-"}</TableCell>
                    <TableCell>{watch.year || "-"}</TableCell>
                    <TableCell>{watch.movement_type || "-"}</TableCell>
                    <TableCell>{watch.condition || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/watches/${watch.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No watches found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default WatchList;