import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, Plane, User } from "lucide-react";
import { useMockAuth } from "@/hooks/useMockAuth";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { isAuthenticated } = useMockAuth();

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      active: location === "/",
    },
    {
      href: "/explore", 
      icon: Search,
      label: "Explore",
      active: location === "/explore" || location.startsWith("/listing/"),
    },
    {
      href: "/wishlist",
      icon: Heart,
      label: "Wishlist", 
      active: location === "/wishlist",
      requireAuth: true,
    },
    {
      href: "/trips",
      icon: Plane,
      label: "Trips",
      active: location === "/trips" || location.startsWith("/booking"),
      requireAuth: true,
    },
    {
      href: isAuthenticated ? "/profile" : "/auth",
      icon: User,
      label: isAuthenticated ? "Profile" : "Login",
      active: location === "/profile" || location === "/auth",
    },
  ];

  // Filter items based on authentication
  const filteredItems = navItems.filter(item => !item.requireAuth || isAuthenticated);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 h-16">
      <div className="flex justify-around items-center h-full px-1">
        {filteredItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors",
                  "min-w-0 w-full h-full text-xs font-medium",
                  item.active
                    ? "text-terra-primary bg-terra-light"
                    : "text-gray-600 hover:text-terra-primary hover:bg-terra-light/50"
                )}
              >
                <IconComponent className={cn(
                  "w-4 h-4 mb-1",
                  item.active ? "text-terra-primary" : "text-gray-600"
                )} />
                <span className="truncate text-xs leading-none">
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}