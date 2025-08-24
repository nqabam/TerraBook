import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Badge } from "@/components/ui/travelersUI//badge";
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
  CheckCircle,
  Plus,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  images: string[];
  category: string;
  subcategory: string;
  ecoFeatures?: string[];
  rating?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("accommodations");
  const [activeSubcategory, setActiveSubcategory] = useState("Hotels");
  const isMobile = useIsMobile();
  const { user, isLoaded } = useUser();

  // Fetch featured listings for homepage
  const { data: featuredListings = [], isLoading: isLoadingListings } = useQuery<Listing[]>({
    queryKey: ['/api/listings', activeCategory, activeSubcategory],
    enabled: !!activeCategory && !!activeSubcategory,
  });

  // Fetch upcoming events for general display
  const { data: upcomingEvents = [] } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const heroStyle = {
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const isAuthenticated = isLoaded && !!user;

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Hero Section with Search */}
      <div className="relative">
        <div className="h-[600px] relative" style={heroStyle}>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            {isAuthenticated ? (
              <>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
                  Welcome back, {user?.firstName || 'Traveler'}!
                </h1>
                <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
                  Ready for your next adventure? Let's find your perfect eco-friendly escape.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-4xl">
                  Welcome to TerraBook
                </h1>
                <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
                  Your gateway to unique stays, dining, and adventures in South Africa
                </p>
              </>
            )}
            
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
                          activeCategory === 'activities' ? 'Activities' : 'Reads'}
              </h2>
              <p className="text-gray-600">Hand-picked sustainable options for your perfect trip</p>
            </div>
            <Link to="/explore">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {isLoadingListings ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex-shrink-0 w-64">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {featuredListings.length > 0 ? (
                featuredListings.slice(0, 12).map((listing) => (
                  <div key={listing.id} className="flex-shrink-0 w-64 h-[400px]">
                    <ListingCard 
                      listing={listing}
                      isWishlisted={false}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-900 w-full">
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
              <Link key={destination.name} to="/explore">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-gray-300 group h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden rounded-t-lg flex-shrink-0">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity"></div>
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-gray-600 mb-3 flex-1">{destination.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
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

      {/* Partner with Us Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Partner with TerraBook
              </h2>
              <p className="text-xl mb-8 text-green-100">
                Join South Africa's leading eco-friendly travel platform and connect with conscious travelers who value sustainability.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-100" />
                  <span>Reach eco-conscious travelers actively seeking sustainable options</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-100" />
                  <span>Get verified as a sustainable business with our eco-certification</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-100" />
                  <span>Access professional photography and marketing support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-100" />
                  <span>Join a network committed to conservation and communities</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/business">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    Partner With Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div 
                className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-xl w-full h-96 flex flex-col items-center justify-center text-gray-900"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-green-600/30 rounded-lg"></div>
                <div className="relative z-10 text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Partnership</h3>
                  <p className="text-lg">Join Our Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* List Your Event Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div 
                className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-xl w-full h-96 flex flex-col items-center justify-center text-gray-900"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-green-600/20 rounded-lg"></div>
                <div className="relative z-10 text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">List Events</h3>
                  <p className="text-lg">Share Your Story</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                List Your Eco-Event
              </h2>
              <p className="text-xl text-gray-900 mb-8">
                Share your sustainable events with eco-conscious travelers and make a positive impact on conservation and communities.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                  <span className="text-gray-900">Connect with travelers seeking sustainable experiences</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                  <span className="text-gray-900">Get your event featured on our platform at no cost</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                  <span className="text-gray-900">Access marketing resources and promotional materials</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                  <span className="text-gray-900">Support environmental education and conservation</span>
                </div>
              </div>
              <Link to="/list-event">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Submit Your Event
                  <Plus className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
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
                description: "Browse verified eco-friendly accommodations, restaurants, and activities across South Africa.",
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