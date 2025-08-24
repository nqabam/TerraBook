import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationModalProps {
  onClose: () => void;
}

export default function LocationModal({ onClose }: LocationModalProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleAllowLocation = async () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location accessed:', position.coords);
          localStorage.setItem('terrabook-location', JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setIsGettingLocation(false);
          onClose();
        },
        (error) => {
          console.log('Location access denied:', error);
          setIsGettingLocation(false);
          onClose();
        }
      );
    } else {
      setIsGettingLocation(false);
      onClose();
    }
  };

  const handleDenyLocation = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
        <div className="w-16 h-16 bg-terra-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-terra-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-terra-darker mb-3">
          Enable Location Services
        </h3>
        
        <p className="text-gray-600 mb-6">
          We'll use your location to show you personalized eco-friendly accommodations and experiences nearby.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={handleAllowLocation}
            disabled={isGettingLocation}
            className="w-full bg-terra-primary hover:bg-terra-dark text-white font-medium py-3 px-6 rounded-xl"
          >
            {isGettingLocation ? "Getting Location..." : "Allow Location Access"}
          </Button>
          
          <Button
            onClick={handleDenyLocation}
            variant="outline"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl border-gray-200"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </div>
  );
}
