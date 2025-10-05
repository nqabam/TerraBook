import React from 'react';
import { MapPin, Clock, Star, Share2, Heart, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";

interface ItineraryItem {
  id: string;
  type: 'accommodation' | 'restaurant' | 'activity' | 'eco-read';
  name: string;
  description: string;
  price: string;
  rating: number;
  walkingDistance: string;
  image: string;
  bookingUrl?: string;
  time?: string;
  day?: number;
}

interface ItineraryVisualBuilderProps {
  itinerary: ItineraryItem[];
  view: 'timeline' | 'map';
  onViewChange: (view: 'timeline' | 'map') => void;
  onBack: () => void;
}

const ItineraryVisualBuilder: React.FC<ItineraryVisualBuilderProps> = ({
  itinerary,
  view,
  onViewChange,
  onBack
}) => {
  const accommodation = itinerary.find(item => item.type === 'accommodation');
  const restaurants = itinerary.filter(item => item.type === 'restaurant');
  const activities = itinerary.filter(item => item.type === 'activity');
  const ecoReads = itinerary.filter(item => item.type === 'eco-read');

  // Group items by day for better timeline organization
  const getItemsForDay = (day: number) => {
    const dayActivities = activities.slice((day-1), day+1); // Get 2 activities per day
    const dayRestaurants = restaurants.slice((day-1), day+1); // Get 2 restaurants per day
    const dayEcoReads = ecoReads.slice((day-1), day); // Get 1 eco-read per day
    
    return {
      activities: dayActivities,
      restaurants: dayRestaurants,
      ecoReads: dayEcoReads
    };
  };

  const handleBooking = (item: ItineraryItem) => {
    toast.success(`Booking ${item.name}...`, {
      description: "Redirecting to booking platform",
    });
    // Simulate booking process
    setTimeout(() => {
      toast.success(`Booking confirmed for ${item.name}!`);
    }, 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Terrabook Itinerary',
        text: `Check out my personalized travel itinerary for ${accommodation?.name}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Itinerary link copied to clipboard!");
    }
  };

  const handleSaveItinerary = () => {
    toast.success("Itinerary saved to your favorites!");
  };

  const renderTimelineView = () => (
    <div className="space-y-6">
      {/* Primary Accommodation */}
      {accommodation && (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Your Base: {accommodation.name}</h3>
          <Card className="max-w-md mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  Primary Stay
                </Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{accommodation.rating}</span>
                </div>
              </div>
              <CardTitle className="text-lg text-green-900">{accommodation.name}</CardTitle>
              <CardDescription className="text-green-700">{accommodation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-600">{accommodation.price}</span>
                <Button 
                  onClick={() => handleBooking(accommodation)} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timeline Days */}
      {[1, 2, 3].map(day => {
        const dayItems = getItemsForDay(day);
        
        return (
          <div key={day} className="relative">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-sm">
                {day}
              </div>
              <h4 className="ml-3 text-lg font-semibold text-gray-800">Day {day}</h4>
            </div>
            
            <div className="ml-6 border-l-2 border-green-200 pl-6 space-y-6">
              {/* Morning Activities */}
              {dayItems.activities.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-green-700 font-medium">
                    <Clock className="h-4 w-4 mr-2" />
                    Morning (9:00 AM - 12:00 PM)
                  </div>
                  {dayItems.activities.map((activity, index) => (
                    <Card key={activity.id} className="hover:shadow-md transition-all duration-200 border-green-100">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h5 className="font-medium text-gray-900">{activity.name}</h5>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                Activity
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
                            <div className="flex items-center mt-3 text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {activity.walkingDistance} walk
                              <Star className="h-3 w-3 ml-3 mr-1 text-yellow-500" />
                              {activity.rating}
                            </div>
                          </div>
                          <div className="text-right ml-4 flex flex-col items-end">
                            <div className="font-semibold text-green-600">{activity.price}</div>
                            <Button 
                              size="sm" 
                              onClick={() => handleBooking(activity)} 
                              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                              Reserve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Lunch */}
              {dayItems.restaurants.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-green-700 font-medium">
                    <Clock className="h-4 w-4 mr-2" />
                    Lunch (1:00 PM - 2:00 PM)
                  </div>
                  {dayItems.restaurants.map((restaurant, index) => (
                    <Card key={restaurant.id} className="hover:shadow-md transition-all duration-200 border-orange-100">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h5 className="font-medium text-gray-900">{restaurant.name}</h5>
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                Restaurant
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{restaurant.description}</p>
                            <div className="flex items-center mt-3 text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {restaurant.walkingDistance} walk
                              <Star className="h-3 w-3 ml-3 mr-1 text-yellow-500" />
                              {restaurant.rating}
                            </div>
                          </div>
                          <div className="text-right ml-4 flex flex-col items-end">
                            <div className="font-semibold text-green-600">{restaurant.price}</div>
                            <Button 
                              size="sm" 
                              onClick={() => handleBooking(restaurant)} 
                              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                              Book Table
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Evening Eco-Read */}
              {dayItems.ecoReads.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-green-700 font-medium">
                    <Clock className="h-4 w-4 mr-2" />
                    Evening (7:00 PM - 9:00 PM)
                  </div>
                  {dayItems.ecoReads.map(ecoRead => (
                    <Card key={ecoRead.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h5 className="font-medium text-green-900">{ecoRead.name}</h5>
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
                                Eco-Read
                              </Badge>
                            </div>
                            <p className="text-sm text-green-700 mt-2">{ecoRead.description}</p>
                            <div className="flex items-center mt-3 text-sm text-green-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              {ecoRead.walkingDistance} walk
                            </div>
                          </div>
                          <div className="text-right ml-4 flex flex-col items-end">
                            <div className="font-semibold text-green-600">{ecoRead.price}</div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleBooking(ecoRead)} 
                              className="mt-2 border-green-300 text-green-700 hover:bg-green-50"
                            >
                              Visit Location
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMapView = () => (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 text-center border border-green-200">
      <MapPin className="h-16 w-16 mx-auto mb-4 text-green-600" />
      <h3 className="text-xl font-semibold mb-2 text-gray-800">Interactive Map View</h3>
      <p className="text-gray-600 mb-6">Map integration coming soon! All recommendations are within walking distance of your accommodation.</p>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {itinerary.slice(0, 4).map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <h5 className="font-medium text-sm text-gray-900 mb-1">{item.name}</h5>
            <p className="text-xs text-green-600 font-medium">{item.walkingDistance}</p>
            <div className="flex items-center justify-center mt-2">
              <Star className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-xs text-gray-500">{item.rating}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-white rounded-lg border border-green-200 max-w-md mx-auto">
        <div className="flex items-center justify-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 text-green-600" />
          All locations within 10-minute walk from your accommodation
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-green-500 to-green-900 text-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
          <div className="flex space-x-2">
            <Button
              variant={view === 'timeline' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('timeline')}
              className={view === 'timeline' ? 'bg-white text-green-800 hover:bg-white/90' : 'text-white hover:bg-white/20'}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Timeline
            </Button>
            <Button
              variant={view === 'map' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('map')}
              className={view === 'map' ? 'bg-white text-green-800 hover:bg-white/90' : 'text-white hover:bg-white/20'}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Map
            </Button>
          </div>
        </div>
        <h2 className="text-xl font-semibold">Your Personalized Itinerary</h2>
        <p className="text-sm text-green-100 mt-1">Everything within walking distance of your accommodation</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {view === 'timeline' ? renderTimelineView() : renderMapView()}
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-green-200 shadow-sm">
        <div className="flex space-x-3">
          <Button 
            onClick={handleShare} 
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share My Itinerary
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSaveItinerary}
            className="px-4 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          All bookings are processed securely. No need to leave the chat!
        </p>
      </div>
    </div>
  );
};

export default ItineraryVisualBuilder;