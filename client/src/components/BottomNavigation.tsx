import { Home, Briefcase, Phone, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

type NavItem =
  | {
      id: string;
      label: string;
      icon: React.ElementType;
      path: string;
      action?: never;
    }
  | {
      id: string;
      label: string;
      icon: React.ElementType;
      action: () => void;
      path?: never;
    };

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();


  const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'services', label: 'Services', icon: Briefcase, path: '/services' },
  { id: 'contact', label: 'Contact', icon: Phone, path: '/contact' },
  ...(user
  ? [{
      id: 'profile',
      label: 'Profile',
      icon: User,
      action: () => {
        const hasRegisteredProperty = user?.publicMetadata?.hasRegisteredProperty;
        navigate(hasRegisteredProperty ? '/profile' : '/profile');
      },
    }]
  : []),

];


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 z-50 px-4 py-2">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = "path" in item && location.pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if ("action" in item) {
                    item.action?.();
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;