import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WatchListHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Watch List</h1>
      <Button onClick={() => navigate("/watches/new")}>
        <Plus className="mr-2" />
        Add New Watch
      </Button>
    </div>
  );
};