import { LayoutDashboard, Plus, ChefHat, ClipboardList, Users, Star, Settings } from "lucide-react";
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

interface DiningAdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const DiningAdminSidebar = ({ activeView, setActiveView }: DiningAdminSidebarProps) => {
  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "menu-management",
      title: "Menu Management",
      icon: ClipboardList,
    },
    {
      id: "add-menu-item",
      title: "Add Menu Item",
      icon: Plus,
    },
    {
      id: "orders",
      title: "Orders",
      icon: ChefHat,
    },
    {
      id: "customers",
      title: "Customer Management",
      icon: Users,
    },
    {
      id: "reviews",
      title: "Reviews & Ratings",
      icon: Star,
    },
    {
      id: "settings",
      title: "Restaurant Settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dining Admin</SidebarGroupLabel>
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

export default DiningAdminSidebar;