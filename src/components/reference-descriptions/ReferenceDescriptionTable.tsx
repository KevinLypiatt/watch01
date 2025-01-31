import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Reference {
  reference_id: number;
  brand: string;
  reference_name: string;
  reference_description: string;
}

interface ReferenceDescriptionTableProps {
  references: Reference[];
  handleSort: (column: string) => void;
}

export const ReferenceDescriptionTable = ({
  references,
  handleSort,
}: ReferenceDescriptionTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('brand')} className="cursor-pointer hover:bg-muted/50">
              Brand
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('reference_name')} className="cursor-pointer hover:bg-muted/50">
              Reference Name
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('reference_description')} className="cursor-pointer hover:bg-muted/50">
              Description
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
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
                    onClick={() => navigate(`/reference-descriptions/${reference.reference_id}`)}
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
  );
};