import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/travelersUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/travelersUI/card";
import { Badge } from "@/components/ui/travelersUI/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/travelersUI/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/travelersUI/avatar";
import { Separator } from "@/components/ui/travelersUI/separator";
import { Calendar as CalendarComponent } from "@/components/ui/travelersUI/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/travelersUI/popover";

import { 
  Star, 
  Heart, 
  MapPin, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  CalendarIcon,
  Users,
  Wifi,
  Coffee,
  Car,
  Leaf,
  Shield,
  Award,
  Plus,
  Minus
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

import type { Listing } from "@shared/schema";

export default function ListingDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);

  // Fetch listing details
  const { data: listing, isLoading, error } = useQuery<Listing>({
    queryKey: ['/api/listings', id],
    enabled: !!id,
  });

  // Check if listing is wishlisted
  const { data: wishlistItems = [] } = useQuery({
    queryKey: ['/api/wishlist'],
  });

  const isWishlisted = wishlistItems.some((item: Listing) => item.id === parseInt(id || ''));

  // Wishlist mutation
  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/wishlist/${listing?.id}`, {
        method: isWishlisted ? 'DELETE' : 'POST',
      });
      if (!response.ok) throw new Error('Failed to update wishlist');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({
        title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
        description: isWishlisted 
          ? "Listing removed from your wishlist" 
          : "Listing added to your wishlist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    },
  });

  const handleWishlistClick = () => {
    wishlistMutation.mutate();
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return differenceInDays(checkOut, checkIn);
  };

  const calculateTotalPrice = () => {
    if (!listing?.price || !checkIn || !checkOut) return 0;
    const nights = calculateNights();
    const basePrice = parseFloat(listing.price) * nights;
    const cleaningFee = listing.category === 'accommodations' ? 200 : 0;
    const serviceFee = 150;
    return basePrice + cleaningFee + serviceFee;
  };

  const handleBookNow = () => {
    // Pass dates and guest count to booking page via URL params
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn.toISOString());
    if (checkOut) params.set('checkOut', checkOut.toISOString());
    if (guests > 1) params.set('guests', guests.toString());
    
    const queryString = params.toString();
    setLocation(`/booking/${id}${queryString ? `?${queryString}` : ''}`);
  };

  const nextImage = () => {
    if (listing?.images && listing.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % (listing.images?.length || 1));
    }
  };

  const prevImage = () => {
    if (listing?.images && listing.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? (listing.images?.length || 1) - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading listing details...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Listing Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/explore">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Browse Listings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : [listing.imageUrl].filter(Boolean);

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Coffee': Coffee,
    'Parking': Car,
    'Eco-Friendly': Leaf,
    'Safety': Shield,
    'Certified': Award,
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {/* Image Gallery */}
      <div className="relative h-[400px] md:h-[500px] bg-gray-200">
        {images.length > 0 && (
          <>
            <img
              src={images[currentImageIndex]}
              alt={listing.title || 'Listing image'}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/80 hover:bg-white rounded-full p-2"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleWishlistClick}
                disabled={wishlistMutation.isPending}
                className="bg-white/80 hover:bg-white rounded-full p-2"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {listing.title}
                </h1>
                {listing.rating && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold ml-1">{listing.rating}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{listing.location}</span>
              </div>

              {listing.ecoFeatures && listing.ecoFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.ecoFeatures.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-50 text-gray-900"
                    >
                      <Leaf className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="host">Host</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-700 leading-relaxed">
                      {listing.description || "This sustainable accommodation offers a unique eco-friendly experience in the heart of South Africa's natural beauty. Enjoy modern comfort while supporting local conservation efforts and sustainable tourism practices."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {listing.amenities && listing.amenities.length > 0 ? (
                        listing.amenities.map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity] || Leaf;
                          return (
                            <div key={index} className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700">{amenity}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="col-span-full text-gray-500">
                          Amenity information not available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="host" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="/api/placeholder/64/64" />
                        <AvatarFallback className="bg-green-600 text-white">
                          EH
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Eco Host
                        </h3>
                        <p className="text-gray-600">Joined in 2020</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">4.9 · 127 reviews</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Passionate about sustainable tourism and conservation. Committed to providing guests with authentic eco-friendly experiences while supporting local communities.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500">
                      Reviews are coming soon. This feature will display guest feedback and ratings.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-green-200">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    {listing.price ? `R${listing.price}` : 'Price on request'}
                  </span>
                  {listing.price && (
                    <span className="text-gray-500 font-normal text-base">
                      / {listing.priceUnit || 'night'}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {listing.category === 'accommodations' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Check-in Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="border border-green-200 rounded-lg p-3 h-auto flex-col items-start justify-start hover:border-green-600"
                          >
                            <label className="text-xs text-gray-600 uppercase mb-1">Check in</label>
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm">
                                {checkIn ? format(checkIn, "MMM d") : "Add date"}
                              </span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {/* Check-out Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="border border-green-200 rounded-lg p-3 h-auto flex-col items-start justify-start hover:border-green-600"
                          >
                            <label className="text-xs text-gray-600 uppercase mb-1">Check out</label>
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm">
                                {checkOut ? format(checkOut, "MMM d") : "Add date"}
                              </span>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today || (checkIn && date <= checkIn);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    {/* Guests Selector */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border border-green-200 rounded-lg p-3 h-auto flex-col items-start justify-start hover:border-green-600"
                        >
                          <label className="text-xs text-gray-600 uppercase mb-1">Guests</label>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Adults</div>
                              <div className="text-sm text-gray-500">Ages 13 or above</div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-green-200"
                                onClick={() => setGuests(Math.max(1, guests - 1))}
                                disabled={guests <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{guests}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-green-200"
                                onClick={() => setGuests(guests + 1)}
                                disabled={guests >= 16}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </>
                )}

                <Button
                  onClick={handleBookNow}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                >
                  {listing.category === 'accommodations' ? 'Reserve' : 
                   listing.category === 'restaurants' ? 'Reserve Table' :
                   'Book Now'}
                </Button>

                {listing.category === 'accommodations' && listing.price && (
                  <>
                    <p className="text-center text-sm text-gray-600">
                      You won't be charged yet
                    </p>
                    
                    <Separator />
                    
                    {checkIn && checkOut ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>R{listing.price} x {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}</span>
                          <span>R{parseFloat(listing.price) * calculateNights()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>R200</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service fee</span>
                          <span>R150</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>R{calculateTotalPrice()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-sm text-gray-500">
                        Select dates to see total price
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}