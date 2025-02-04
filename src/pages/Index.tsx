import { Link } from "react-router-dom";
import { Plus, List, FilePlus, Database, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center">
      <div className="flex flex-col gap-4 w-64">
        <Link to="/watches/new">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Add New Watch</span>
          </Button>
        </Link>
        
        <Link to="/watch-list">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <List className="w-5 h-5" />
            <span>Watch List</span>
          </Button>
        </Link>
        
        <Link to="/reference-descriptions/new">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <FilePlus className="w-5 h-5" />
            <span>Add New Reference</span>
          </Button>
        </Link>
        
        <Link to="/reference-descriptions">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <Database className="w-5 h-5" />
            <span>Reference List</span>
          </Button>
        </Link>
        
        <Link to="/edit-ai-prompts">
          <Button variant="outline" className="w-full h-16 flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Edit AI Prompts</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;