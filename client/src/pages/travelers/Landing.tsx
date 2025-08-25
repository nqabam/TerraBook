import { useState } from "react";
import { Button } from "@/components/ui/travelersUI/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SearchBar, { type SearchParams } from "@/components/travelersComponents/SearchBar";
import CategoryTabs from "@/components/travelersComponents/CategoryTabs";
import ListingCard from "@/components/travelersComponents/ListingCard";
import { Leaf, Heart, Shield, Plus, Handshake } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/travelersComponents/Navigation"; // Import the Navigation component

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState("accommodations");
  const [activeSubcategory, setActiveSubcategory] = useState("Hotels");
  const navigate = useNavigate();

  // Fetch listings for active category - fixed query key format
  const { data: listings = [], isLoading: isLoadingListings } = useQuery<Listing[]>({
    queryKey: ['/api/accommodations', activeCategory, activeSubcategory],
    enabled: !!activeCategory && !!activeSubcategory,
  });

  // Fetch events - fixed query key format
  const { data: events = [], isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const handleSearch = (params: SearchParams) => {
    toast("Search initiated", {
      description: `Searching for accommodations in ${params.location}`,
    });
    // In a real app, this would navigate to search results or filter listings
  };

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Navigation Component */}
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[600px] relative" style={heroStyle}>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl">
              Welcome to TerraBook
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
              Your gateway to unique stays, dining, and adventures in South Africa
            </p>
            
            <SearchBar
              onSearch={handleSearch}
              className="max-w-4xl w-full"
            />
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TerraBook?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience South Africa's natural beauty while supporting sustainable tourism and local communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                100% Eco-Certified
              </h3>
              <p className="text-gray-600">
                All our partners meet strict environmental standards
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Support Local
              </h3>
              <p className="text-gray-600">
                Directly benefit local communities and conservation efforts
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trusted & Safe
              </h3>
              <p className="text-gray-600">
                Verified accommodations with 24/7 customer support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation and Listings */}
      <CategoryTabs
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategoryChange={setActiveCategory}
        onSubcategoryChange={setActiveSubcategory}
      />

      {/* Listings Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {activeCategory === 'accommodations' && 'Eco-Friendly Accommodations'}
            {activeCategory === 'restaurants' && 'Sustainable Dining Experiences'}
            {activeCategory === 'activities' && 'Eco-Conscious Activities'}
            {activeCategory === 'eco-reads' && 'Eco-Conscious Reading'}
          </h3>
          
          {isLoadingListings ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading listings...</div>
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-4">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <div key={listing.id} className="flex-shrink-0 w-80 h-[420px]">
                    <ListingCard listing={listing} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-500">
                  No listings available for this category.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Partner With Us Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Partner With Us
            </h2>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Join our network of eco-conscious hosts and share your sustainable spaces with travelers who care
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-green-300">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Become a Partner</h3>
              <p className="text-gray-600 mb-6">Join our network of eco-conscious businesses and share your sustainable spaces, dining experiences, and activities with travelers who care about the environment</p>
              
              <Button 
                onClick={() => navigate('/business')}
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3"
              >
                Partner With Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* List Your Event Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              List Your Eco Event
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Share your eco-conscious events with our community of environmentally minded travelers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Event Categories */}
            {[
              {
                title: "Festivals",
                description: "Sustainable music & cultural events",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                title: "Workshops", 
                description: "Educational & skill-building sessions",
                image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                title: "Conservation",
                description: "Community action & cleanup events", 
                image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                title: "Markets",
                description: "Local & sustainable marketplaces",
                image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-green-200">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4 text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/list-event">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                List Your Event
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}