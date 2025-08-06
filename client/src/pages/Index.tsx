import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="min-h-screen pb-20">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Index;