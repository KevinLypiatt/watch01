import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WatchList from "./pages/WatchList";
import ReferenceDescriptions from "./pages/ReferenceDescriptions";
import EditReferenceDescription from "./pages/EditReferenceDescription";
import EditWatch from "./pages/EditWatch";
import NewWatch from "./pages/NewWatch";
import NewReferenceDescription from "./pages/NewReferenceDescription";
import StyleGuides from "./pages/StyleGuides";
import SystemPrompts from "./pages/SystemPrompts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/watch-list" element={<WatchList />} />
          <Route path="/edit-watch/:id" element={<EditWatch />} />
          <Route path="/watches/new" element={<NewWatch />} />
          <Route path="/reference-descriptions" element={<ReferenceDescriptions />} />
          <Route path="/reference-descriptions/:id" element={<EditReferenceDescription />} />
          <Route path="/reference-descriptions/new" element={<NewReferenceDescription />} />
          <Route path="/style-guides" element={<StyleGuides />} />
          <Route path="/system-prompts" element={<SystemPrompts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;