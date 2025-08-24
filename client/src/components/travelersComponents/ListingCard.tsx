import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Listing } from "@shared/schema";

interface ListingCardProps {
  listing: Listing;
  isWishlisted?: boolean;
}

export default function ListingCard({ listing, isWishlisted = false }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const images = listing.images && listing.images.length > 0 
    ? listing.images.filter(Boolean)
    : [listing.imageUrl].filter(Boolean);

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/wishlist/${listing.id}`, {
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

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    wishlistMutation.mutate();
  };

  const handleImageHover = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  // For eco-reads articles, link to external URL instead of internal listing page
  const isEcoRead = listing.category === "eco-reads";
  const linkHref = isEcoRead && listing.url ? listing.url : `/listing/${listing.id}`;
  const linkTarget = isEcoRead && listing.url ? "_blank" : "_self";
  const linkRel = isEcoRead && listing.url ? "noopener noreferrer" : "";

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isEcoRead && listing.url) {
      return (
        <a 
          href={linkHref} 
          target={linkTarget} 
          rel={linkRel || undefined}
          className="block w-full"
        >
          {children}
        </a>
      );
    }
    return (
      <Link to={linkHref} className="block w-full">
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <Card className="w-full h-[400px] flex flex-col overflow-hidden border-2 border-green-200 hover:border-green-600 transition-all cursor-pointer group">
        <div className="relative">
          {images.length > 0 && images[currentImageIndex] && (
            <img
              src={images[currentImageIndex]}
              alt={listing.title}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              onMouseEnter={handleImageHover}
            />
          )}
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full"
            onClick={handleWishlistClick}
            disabled={wishlistMutation.isPending}
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900 line-clamp-2 flex-1 text-sm">
                {listing.title}
              </h4>
              {listing.rating && (
                <div className="flex items-center ml-2 flex-shrink-0">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">
                    {listing.rating}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1 text-xs">{listing.location}</span>
            </div>

            {listing.price && (
              <p className="text-green-600 font-semibold mb-2 text-sm">
                R{listing.price}{" "}
                <span className="text-gray-500 font-normal text-xs">
                  / {listing.priceUnit || 'night'}
                </span>
              </p>
            )}
          </div>

          {/* Eco-reads get a special "Free Article" badge instead of price */}
          {isEcoRead && (
            <div className="flex items-center justify-between mt-auto">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                📖 Free Article
              </Badge>
              <Badge variant="outline" className="text-xs">
                External Link
              </Badge>
            </div>
          )}

          {/* Regular listings show eco features */}
          {!isEcoRead && listing.ecoFeatures && listing.ecoFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto">
              {listing.ecoFeatures.slice(0, 2).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-50 text-gray-900 text-xs"
                >
                  {feature}
                </Badge>
              ))}
              {listing.ecoFeatures.length > 2 && (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-gray-900 text-xs"
                >
                  +{listing.ecoFeatures.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}