import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Registration from "./pages/Registration";
import Services from "./pages/Services";
import Contact from "./pages/contact";
import Profile from "./pages/Profile";
import LearnMore from "./pages/LearnMore";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <Toaster />
        <Sonner />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/admindashboard" element={<Admin/>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;