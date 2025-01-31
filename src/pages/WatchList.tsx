import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const WatchList = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");

  const { data: watches, isLoading } = useQuery({
    queryKey: ["watches", searchTerm, brandFilter, modelFilter],
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

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

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
                <TableHead>Brand</TableHead>
                <TableHead>Model Reference</TableHead>
                <TableHead>Model Name</TableHead>
                <TableHead>Case Material</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Movement Type</TableHead>
                <TableHead>Condition</TableHead>
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
