import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ReferenceDescriptions = () => {
  const navigate = useNavigate();
  const [brandFilter, setBrandFilter] = useState("");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: references, isLoading } = useQuery({
    queryKey: ["references", brandFilter, referenceFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("reference_descriptions")
        .select("*");

      if (brandFilter) {
        query = query.ilike("brand", `%${brandFilter}%`);
      }
      if (referenceFilter) {
        query = query.ilike("reference_name", `%${referenceFilter}%`);
      }
      if (searchQuery) {
        query = query.or(`brand.ilike.%${searchQuery}%,reference_name.ilike.%${searchQuery}%,reference_description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching references:", error);
        throw error;
      }
      
      return data || [];
    },
  });

  const handleEdit = (referenceId: number) => {
    navigate(`/reference-descriptions/${referenceId}`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Reference Descriptions</h1>
      
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <Input
            placeholder="Filter by brand..."
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Filter by reference..."
            value={referenceFilter}
            onChange={(e) => setReferenceFilter(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <Input
          placeholder="Search all fields..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Reference Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {references && references.length > 0 ? (
              references.map((reference) => (
                <TableRow key={reference.reference_id}>
                  <TableCell>{reference.brand || "-"}</TableCell>
                  <TableCell>{reference.reference_name || "-"}</TableCell>
                  <TableCell>{reference.reference_description || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(reference.reference_id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No references found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReferenceDescriptions;