import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/travelersUI/input";
import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent } from "@/components/ui/travelersUI/card";
import { Badge } from "@/components/ui/travelersUI/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/travelersUI/select";
import { Slider } from "@/components/ui/travelersUI/slider";
import { Checkbox } from "@/components/ui/checkbox";
import CategoryTabs from "@/components/travelersComponents/CategoryTabs";
import ListingCard from "@/components/travelersComponents/ListingCard";
import { Search, Filter, Grid, List, MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  createdAt?: string;
}

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("accommodations");
  const [activeSubcategory, setActiveSubcategory] = useState("Hotels");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedEcoFeatures, setSelectedEcoFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("rating");
  const isMobile = useIsMobile();

  // Fetch listings based on current filters
  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ['/api/listings', activeCategory, activeSubcategory],
  });

  // Fetch search results when searching
  const { data: searchResults = [], isLoading: isSearching } = useQuery<Listing[]>({
    queryKey: ['/api/listings/search', searchQuery, activeCategory],
    enabled: searchQuery.length > 0,
  });

  const displayedListings = searchQuery ? searchResults : listings;
  
  // Filter listings based on category - eco-reads don't need price/rating filters
  const filteredListings = displayedListings.filter(listing => {
    // For eco-reads, only apply basic search filtering
    if (activeCategory === "eco-reads") {
      return true; // Search is already handled by the query
    }
    
    // For other categories, apply price and eco-feature filters
    const price = parseFloat(listing.price || "0");
    const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
    
    const hasSelectedEcoFeatures = selectedEcoFeatures.length === 0 || 
      selectedEcoFeatures.some(feature => 
        listing.ecoFeatures?.includes(feature)
      );
    
    return inPriceRange && hasSelectedEcoFeatures;
  });

  // Sort listings - different sorting for eco-reads
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (activeCategory === "eco-reads") {
      // For eco-reads, sort by date or relevance
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "oldest":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        default:
          return 0;
      }
    } else {
      // For other categories, use price and rating sorting
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.price || "0") - parseFloat(b.price || "0");
        case "price-high":
          return parseFloat(b.price || "0") - parseFloat(a.price || "0");
        case "rating":
          return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
        default:
          return 0;
      }
    }
  });

  const ecoFeatures = [
    "Solar Powered",
    "Plastic-free",
    "Local Food",
    "Carbon Neutral",
    "Wildlife Conservation",
    "Ocean Conservation",
    "Farm-to-Table",
    "100% Vegan",
    "Sustainable Seafood",
    "Biodynamic Wines"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query
  };

  const toggleEcoFeature = (feature: string) => {
    setSelectedEcoFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search destinations, activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-green-600"
                />
              </div>
            </form>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-gray-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {activeCategory === "eco-reads" ? (
                    <>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="rating">Best Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategoryChange={setActiveCategory}
        onSubcategoryChange={setActiveSubcategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {(showFilters || !isMobile) && (
            <div className={`${isMobile ? 'fixed inset-0 bg-white z-40 p-4 overflow-y-auto' : 'w-80 flex-shrink-0'}`}>
              {isMobile && (
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    ×
                  </Button>
                </div>
              )}

              <Card className="border-gray-300">
                <CardContent className="p-6 space-y-6">
                  {/* Hide irrelevant filters for eco-reads */}
                  {activeCategory !== "eco-reads" && (
                    <>
                      {/* Price Range */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={5000}
                          step={50}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>R{priceRange[0]}</span>
                          <span>R{priceRange[1]}+</span>
                        </div>
                      </div>

                      {/* Eco Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Eco Features</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {ecoFeatures.map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature}
                                checked={selectedEcoFeatures.includes(feature)}
                                onCheckedChange={() => toggleEcoFeature(feature)}
                              />
                              <label
                                htmlFor={feature}
                                className="text-sm text-gray-700 cursor-pointer"
                              >
                                {feature}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clear Filters */}
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setPriceRange([0, 5000]);
                          setSelectedEcoFeatures([]);
                          setSearchQuery("");
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </>
                  )}

                  {/* Eco-reads specific filters */}
                  {activeCategory === "eco-reads" && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Article Filters</h4>
                      <p className="text-sm text-gray-600">Use the search bar above to find specific articles or topics.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 
                   `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
                </h2>
                <p className="text-gray-600 mt-1">
                  {sortedListings.length} {sortedListings.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
            </div>

            {/* Loading State */}
            {(isLoading || isSearching) && (
              <div className="text-center py-12">
                <div className="text-gray-500">Loading listings...</div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !isSearching && sortedListings.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => {
                    setPriceRange([0, 5000]);
                    setSelectedEcoFeatures([]);
                    setSearchQuery("");
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Results Grid/List */}
            {sortedListings.length > 0 && (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max"
                  : "space-y-4"
              }>
                {sortedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}