import { useState, useEffect } from "react";
import { User, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AccommodationAdminSidebar from "@/components/AccommodationAdminSidebar";
import DiningAdminSidebar from "@/components/DiningAdminSidebar";
import AdminDashboard from "@/components/AdminDashboard";
import DiningAdminDashboard from "@/components/DiningAdminDashboard";
import AddRoom from "@/components/AddRoom";
import ListRooms from "@/components/ListRooms";
import MenuManagement from "@/components/MenuManagement";
import AddMenuItem from "@/components/AddMenuItem";
import OrdersManagement from "@/components/OrdersManagement";
import CustomerManagement from "@/components/CustomerManagement";
import ReviewsRatings from "@/components/ReviewsRatings";
import RestaurantSettings from "@/components/RestaurantSettings";
import ReservationsManagement from "@/components/ReservationManagement";
import GuestManagement from "@/components/GuestManagement";
import PropertySettings from "@/components/PropertySettings";
import { getPropertyType, getPropertyCategory } from "@/utils/propertyTypeUtils";

const Admin = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [propertyCategory, setPropertyCategory] = useState<'accommodation' | 'dining' | 'unknown'>('unknown');
  const navigate = useNavigate();

  useEffect(() => {
    const propertyType = getPropertyType();
    if (propertyType) {
      setPropertyCategory(getPropertyCategory(propertyType));
    }
  }, []);

  const renderContent = () => {
    if (propertyCategory === 'dining') {
      switch (activeView) {
        case "dashboard":
          return <DiningAdminDashboard />;
        case "menu-management":
          return <MenuManagement />;
        case "add-menu-item":
          return <AddMenuItem />;
        case "orders":
          return <OrdersManagement />;
        case "customers":
          return <CustomerManagement />;
        case "reviews":
          return <ReviewsRatings />;
        case "settings":
          return <RestaurantSettings />;
        default:
          return <DiningAdminDashboard />;
      }
    } else {
      // Accommodation properties
      switch (activeView) {
        case "dashboard":
          return <AdminDashboard />;
        case "add-room":
          return <AddRoom />;
        case "list-rooms":
          return <ListRooms />;
        case "reservations":
          return <ReservationsManagement />;
        case "guests":
          return <GuestManagement />;
        case "settings":
          return <PropertySettings />;
        default:
          return <AdminDashboard />;
      }
    }
  };

  const renderSidebar = () => {
    if (propertyCategory === 'dining') {
      return <DiningAdminSidebar activeView={activeView} setActiveView={setActiveView} />;
    } else {
      return <AccommodationAdminSidebar activeView={activeView} setActiveView={setActiveView} />;
    }
  };

  const getAdminTitle = () => {
    if (propertyCategory === 'dining') {
      return 'Restaurant Admin Panel';
    }
    return 'Property Admin Panel';
  };

  const getAdminDescription = () => {
    if (propertyCategory === 'dining') {
      return 'Manage your restaurant operations and menu';
    }
    return 'Manage your accommodation property';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {renderSidebar()}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getAdminTitle()}</h1>
                <p className="text-gray-600">{getAdminDescription()}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;