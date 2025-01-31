import { Link } from "react-router-dom";
import { List, Database, Plus, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center">
      <div className="grid grid-cols-2 gap-6 max-w-2xl p-6">
        <Link to="/watch-list">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
            <List className="w-8 h-8" />
            <span>View Watch List</span>
          </Button>
        </Link>
        <Link to="/reference-descriptions">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
            <Database className="w-8 h-8" />
            <span>View Reference Descriptions</span>
          </Button>
        </Link>
        <Link to="/watches/new">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
            <Plus className="w-8 h-8" />
            <span>Add New Watch</span>
          </Button>
        </Link>
        <Link to="/reference-descriptions/new">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
            <FilePlus className="w-8 h-8" />
            <span>Add New Reference Description</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;