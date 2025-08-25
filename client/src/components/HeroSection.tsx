import { ArrowRight, Leaf, TreePine, Recycle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useClerk, useUser } from "@clerk/clerk-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { user, isLoaded } = useUser();

  const handleRegisterClick = () => {
    if (!isLoaded) return; // optional: prevent premature clicks while Clerk is loading

    if (user) {
      navigate("/business/register");
    } else {
      openSignIn({});
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-100 via-gray-100 to-green-100 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 opacity-10">
        <TreePine className="h-32 w-32 text-green-700" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <Leaf className="h-24 w-24 text-green-600" />
      </div>
      <div className="absolute top-1/2 right-1/4 opacity-5">
        <Recycle className="h-40 w-40 text-green-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-in-left">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-green-700">
                  🌱 Eco-Friendly Business Platform
                </span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Register Your
              <span className="block bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Sustainable
              </span>
              Property Today
            </h1>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Join the green hospitality revolution. Whether you own an eco-friendly hotel,
              sustainable restaurant, or environmentally conscious accommodation,
              showcase your commitment to sustainability on our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="bg-gradient-green bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg px-8 py-6"
                onClick={handleRegisterClick} // ✅ Use handler
              >
                Register Your Property
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-green-500 text-green-600 hover:bg-green-50 text-lg px-8 py-6"
                onClick={() => navigate("/learn-more")}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-green-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,247+</div>
                <div className="text-sm text-gray-600">Eco Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">25M+</div>
                <div className="text-sm text-gray-600">CO₂ Saved (kg)</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative animate-fade-in">
            <div className="bg-green-100 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="bg-white rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-800">Eco-Certified Property</span>
                </div>
                <div className="h-40 bg-gradient-green-light rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <TreePine className="h-16 w-16 text-green-600 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">Your Sustainable Business</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Carbon Neutral</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
