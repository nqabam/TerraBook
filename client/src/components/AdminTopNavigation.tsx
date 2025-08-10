import { User, Settings, Bell, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface AdminTopNavigationProps {
  businessName?: string;
  propertyType: string;
  className?: string;
  onSettingsClick?: () => void;
}

const AdminTopNavigation = ({ 
  businessName = "My Business", 
  propertyType,
  className = "",
  onSettingsClick
}: AdminTopNavigationProps) => {
  const navigate = useNavigate();

  const getPropertyTypeDisplay = (type: string) => {
    switch(type) {
      case 'hotel': return 'Hotel';
      case 'guesthouse': return 'Guesthouse';
      case 'resort': return 'Resort';
      case 'hostel': return 'Hostel';
      case 'restaurant': return 'Restaurant';
      case 'cafe': return 'Café';
      default: return 'Property';
    }
  };

  const getPropertyTypeColor = (type: string) => {
    if (['restaurant', 'cafe'].includes(type)) {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left Side - Business Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-gray-600" />
            <h1 className="text-xl font-semibold text-gray-900">{businessName}</h1>
          </div>
          <Badge variant="secondary" className={getPropertyTypeColor(propertyType)}>
            {getPropertyTypeDisplay(propertyType)}
          </Badge>
        </div>

        {/* Right Side - Action Icons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            title="Settings"
            onClick={onSettingsClick}
          >
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/profile')}
            title="Profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminTopNavigation;