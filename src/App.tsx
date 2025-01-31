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
          <Route path="/watches/:id/edit" element={<EditWatch />} />
          <Route path="/watches/new" element={<NewWatch />} />
          <Route path="/reference-descriptions" element={<ReferenceDescriptions />} />
          <Route path="/reference-descriptions/:id" element={<EditReferenceDescription />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;