import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReferenceDescription {
  reference_id: number;
  brand: string;
  reference_name: string;
  reference_description: string;
}

interface ReferenceDescriptionTableProps {
  references: ReferenceDescription[];
  handleSort: (column: string) => void;
  handleDelete: (id: number) => void;
}

export const ReferenceDescriptionTable = ({
  references,
  handleSort,
  handleDelete,
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
                <TableCell className="align-top">{reference.brand || "-"}</TableCell>
                <TableCell className="align-top">{reference.reference_name || "-"}</TableCell>
                <TableCell>{reference.reference_description || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/reference-descriptions/${reference.reference_id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reference.reference_id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
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