import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Reference {
  reference_id: number;
  brand: string;
  reference_name: string;
  reference_description: string;
}

interface ReferenceDescriptionTableProps {
  references: Reference[];
  handleSort: (column: string) => void;
  handleDelete: (id: number) => void;
}

export const ReferenceDescriptionTable = ({
  references,
  handleSort,
  handleDelete,
}: ReferenceDescriptionTableProps) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReferenceId, setSelectedReferenceId] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastEditedId = sessionStorage.getItem('lastEditedReferenceId');
    if (lastEditedId) {
      const row = document.getElementById(`reference-${lastEditedId}`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the row briefly
        row.classList.add('bg-muted/50');
        setTimeout(() => {
          row.classList.remove('bg-muted/50');
        }, 2000);
      }
      sessionStorage.removeItem('lastEditedReferenceId');
    }
  }, [references]);

  const onDeleteClick = (id: number) => {
    setSelectedReferenceId(id);
    setDeleteDialogOpen(true);
  };

  const onDeleteConfirm = () => {
    if (selectedReferenceId) {
      handleDelete(selectedReferenceId);
      setDeleteDialogOpen(false);
      setSelectedReferenceId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border" ref={tableRef}>
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
                <TableRow 
                  key={reference.reference_id}
                  id={`reference-${reference.reference_id}`}
                  className="transition-colors duration-200"
                >
                  <TableCell>{reference.brand || "-"}</TableCell>
                  <TableCell>{reference.reference_name || "-"}</TableCell>
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
                        onClick={() => onDeleteClick(reference.reference_id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the reference from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};