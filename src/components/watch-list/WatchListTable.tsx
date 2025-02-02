import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowUpDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

interface Watch {
  id: number;
  brand: string;
  model_name: string;
  model_reference: string;
  case_material: string;
  year: number;
  movement_type: string;
  listing_reference: string;
  condition: string;
  description: string;
  additional_information: string;
}

interface WatchListTableProps {
  watches: Watch[];
  handleSort: (column: string) => void;
  handleDelete: (id: number) => void;
}

export const WatchListTable = ({
  watches,
  handleSort,
  handleDelete,
}: WatchListTableProps) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWatchId, setSelectedWatchId] = useState<number | null>(null);

  const onDeleteClick = (id: number) => {
    setSelectedWatchId(id);
    setDeleteDialogOpen(true);
  };

  const onDeleteConfirm = () => {
    if (selectedWatchId) {
      handleDelete(selectedWatchId);
      setDeleteDialogOpen(false);
      setSelectedWatchId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('brand')} className="cursor-pointer hover:bg-muted/50">
                Brand
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('model_name')} className="cursor-pointer hover:bg-muted/50">
                Model Name
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('model_reference')} className="cursor-pointer hover:bg-muted/50">
                Reference
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
              <TableHead onClick={() => handleSort('description')} className="cursor-pointer hover:bg-muted/50">
                Description
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watches && watches.length > 0 ? (
              watches.map((watch) => (
                <TableRow key={watch.id}>
                  <TableCell>{watch.brand || "-"}</TableCell>
                  <TableCell>{watch.model_name || "-"}</TableCell>
                  <TableCell>{watch.model_reference || "-"}</TableCell>
                  <TableCell>{watch.case_material || "-"}</TableCell>
                  <TableCell>{watch.year || "-"}</TableCell>
                  <TableCell>
                    {watch.description ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/watches/${watch.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteClick(watch.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No watches found
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
              This action cannot be undone. This will permanently delete the watch from your database.
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