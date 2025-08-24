import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Badge } from "@/components/ui/travelersUI/badge";
import CategoryTabs from "@/components/travelersComponents/CategoryTabs";
import ListingCard from "@/components/travelersComponents/ListingCard";
import SearchBar from "@/components/travelersComponents/SearchBar";
import { 
  Star,
  Award,
  Shield,
  Leaf,
  MapPin,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Listing, Event } from "@shared/schema";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("accommodations");
  const [activeSubcategory, setActiveSubcategory] = useState("Hotels");
  const isMobile = useIsMobile();

  // Fetch featured listings for homepage - fixed query key format
  const { data: featuredListings = [], isLoading: isLoadingListings } = useQuery<Listing[]>({
    queryKey: ['/api/listings', activeCategory, activeSubcategory],
    enabled: !!activeCategory && !!activeSubcategory,
  });

  // Fetch upcoming events for general display - fixed query key format
  const { data: upcomingEvents = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const heroStyle = {
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <div className="relative">
        <div className="h-[600px] relative" style={heroStyle}>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
              Discover Sustainable Travel in South Africa
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
              Experience eco-friendly accommodations, dining, and eco-actions while supporting conservation and local communities
            </p>
            
            {/* Hero Search Bar */}
            <div className="w-full max-w-4xl">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Eco-Partners</h3>
              <p className="text-gray-600">All listings are verified for authentic sustainability practices</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">5-Star Experiences</h3>
              <p className="text-gray-600">Curated high-quality sustainable travel experiences</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Carbon Neutral</h3>
              <p className="text-gray-600">Every booking contributes to environmental conservation</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">Supporting local communities and conservation efforts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation and Featured Listings */}
      <CategoryTabs
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategoryChange={setActiveCategory}
        onSubcategoryChange={setActiveSubcategory}
      />

      {/* Featured Listings */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                <TrendingUp className="w-8 h-8 inline mr-3" />
                Featured {activeCategory === 'accommodations' ? 'Stays' : 
                          activeCategory === 'restaurants' ? 'Dining' :
                          activeCategory === 'eco-actions' ? 'Eco Actions' : 'Reads'}
              </h2>
              <p className="text-gray-600">Hand-picked sustainable options for your perfect trip</p>
            </div>
            <Link href="/explore">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {isLoadingListings ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.length > 0 ? (
                featuredListings.slice(0, 6).map((listing) => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing}
                    isWishlisted={false}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No featured listings available for this category.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Eco-Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore South Africa's most beautiful and sustainable destinations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Kruger National Park",
                image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                description: "World-renowned wildlife sanctuary",
                listings: "12 eco-lodges"
              },
              {
                name: "Cape Winelands",
                image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                description: "Sustainable wine estates and vineyards",
                listings: "8 organic wineries"
              },
              {
                name: "Garden Route",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                description: "Scenic coastal route with eco-activities",
                listings: "15 eco-accommodations"
              }
            ].map((destination) => (
              <Link key={destination.name} href="/explore">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 group">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-green-100 text-gray-900">
                        {destination.listings}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How TerraBook Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book sustainable travel experiences in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Search & Discover",
                description: "Browse verified eco-friendly accommodations, restaurants, and eco-actions across South Africa.",
                icon: <Leaf className="w-6 h-6" />
              },
              {
                step: "2", 
                title: "Book with Confidence",
                description: "Secure your sustainable travel experience with our verified eco-partners and transparent pricing.",
                icon: <Shield className="w-6 h-6" />
              },
              {
                step: "3",
                title: "Travel & Impact",
                description: "Enjoy your eco-friendly experience knowing you're supporting conservation and local communities.",
                icon: <CheckCircle className="w-6 h-6" />
              }
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}