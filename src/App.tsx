import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Diagnostic from "./pages/Diagnostic";
import Results from "./pages/Results";
import Profil from "./pages/Profil";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import Privacy from "./pages/Privacy";
import CGV from "./pages/CGV";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NosSolutions from "./pages/NosSolutions";
import FAQ from "./pages/FAQ";
import About from "./pages/About";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/resultats" element={<Results />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/admin" element={<Navigate to="/profil" replace />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cgv" element={<CGV />} />
            <Route path="/nos-solutions" element={<NosSolutions />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/about" element={<Navigate to="/a-propos" replace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
