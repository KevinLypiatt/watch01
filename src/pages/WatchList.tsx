import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WatchList = () => {
  const { data: watches, isLoading, error } = useQuery({
    queryKey: ["watches"],
    queryFn: async () => {
      console.log("Fetching watches...");
      const { data, error } = await supabase
        .from("watches")
        .select("*");  // Changed to select all columns

      if (error) {
        console.error("Error fetching watches:", error);
        throw error;
      }
      
      console.log("Fetched watches:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading watches...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error in component:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Error loading watches. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Watch List</h1>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {watches?.map((watch, index) => (
              <TableRow key={index}>
                <TableCell>{watch.brand || "-"}</TableCell>
                <TableCell>{watch.model_reference || "-"}</TableCell>
                <TableCell>{watch.model_name || "-"}</TableCell>
                <TableCell>{watch.case_material || "-"}</TableCell>
                <TableCell>{watch.year || "-"}</TableCell>
                <TableCell>{watch.movement_type || "-"}</TableCell>
                <TableCell>{watch.condition || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        {watches?.length === 0 && "No watches found"}
      </div>
    </div>
  );
};

export default WatchList;