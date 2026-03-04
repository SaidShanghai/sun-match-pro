import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JsonLd from "@/components/seo/JsonLd";
import { defaultSchemas } from "@/config/seoSchemas";
import Index from "./pages/Index";
import Diagnostic from "./pages/Diagnostic";
import Results from "./pages/Results";
import Profil from "./pages/Profil";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NosSolutions from "./pages/NosSolutions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <JsonLd schema={defaultSchemas} />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/resultats" element={<Results />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Navigate to="/profil" replace />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/nos-solutions" element={<NosSolutions />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
