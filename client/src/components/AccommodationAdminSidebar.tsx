import { LayoutDashboard, Plus, Bed, Users, Calendar, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AccommodationAdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const AccommodationAdminSidebar = ({ activeView, setActiveView }: AccommodationAdminSidebarProps) => {
  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "add-room",
      title: "Add Room",
      icon: Plus,
    },
    {
      id: "list-rooms",
      title: "Manage Rooms",
      icon: Bed,
    },
    {
      id: "reservations",
      title: "Reservations",
      icon: Calendar,
    },
    {
      id: "guests",
      title: "Guest Management",
      icon: Users,
    },
    {
      id: "settings",
      title: "Property Settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Accommodation Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => setActiveView(item.id)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AccommodationAdminSidebar;