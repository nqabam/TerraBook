import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Business side pages (your original pages)
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

// New pages from your friend (customer side)
import AuthPage from "./pages/travelers/AuthPage";
import BookingConfirmation from "./pages/travelers/BookingConfirmation";
import BookingPage from "./pages/travelers/BookingPage";
import Explore from "./pages/travelers/Explore";
import Home from "./pages/travelers/Home";
import LandingPage from "./pages/travelers/Landing";
import ListingsDetails from "./pages/travelers/ListingDetails";
import ListYourEvent from "./pages/travelers/ListYourEvent";
import NewHome from "./pages/travelers/NewHome";
import PartnerWithUs from "./pages/travelers/PartnerWithUs";
import PaymentPage from "./pages/travelers/PaymentPage";
import UserProfile from "./pages/travelers/userProfile";
import Trips from "./pages/travelers/Trips";
import WishList from "./pages/travelers/Wishlist";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Customer side routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/new-home" element={<NewHome />} />
        <Route path="/listing/:id" element={<ListingsDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route path="/confirmation/:id" element={<BookingConfirmation />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/list-event" element={<ListYourEvent />} />
        <Route path="/partner" element={<PartnerWithUs />} />
        
        {/* Business partner routes - using /business prefix */}
        <Route path="/business" element={<Index />} />
        <Route path="/business/register" element={<Registration />} />
        <Route path="/business/admindashboard" element={<Admin />} />
        <Route path="/business/admin" element={<Admin />} />
        <Route path="/business/services" element={<Services />} />
        <Route path="/business/contact" element={<Contact />} />
        <Route path="/business/profile" element={<Profile />} />
        <Route path="/business/learn-more" element={<LearnMore />} />
        <Route path="/business/features" element={<Features />} />
        <Route path="/business/pricing" element={<Pricing />} />
        <Route path="/business/support" element={<Support />} />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;