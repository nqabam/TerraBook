import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/travelersUI/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/travelersUI/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/travelersUI/dropdown-menu";
import { Menu, User, Leaf, Heart, Plane, Settings, BarChart3, LogOut } from "lucide-react";
import { useAppContext } from "@/context/AppContext"; // Adjust the import path as needed

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isOwner } = useAppContext();
  const navigate = useNavigate();
  
  // Authentication state from context
  const isAuthenticated = !!user;
  const isLoading = false; // You might want to add loading state to your context

  const handleLogout = () => {
    // Implement actual logout logic here using your context
    console.log("Logout clicked");
    // Example: navigate('/auth?logout=true');
  };

  return (
    <nav className="border-b border-green-200 bg-gradient-to-r from-green-50 via-white to-green-50/60 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
            <div className="bg-green-600 p-2 rounded-lg shadow-md">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-gray-900">Terra</span>
              <span className="text-green-600">Book</span>
            </span>
          </Link>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/explore">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-900 hover:text-green-600 hover:bg-green-50/50 transition-all duration-200 font-medium">
                Explore
              </Button>
            </Link>
            
            {/* Business Owner Dashboard Link */}
            {isOwner && (
              <Link to="/business">
                <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-900 hover:text-green-600 hover:bg-green-50/50 transition-all duration-200 font-medium">
                  Business Dashboard
                </Button>
              </Link>
            )}
            
            {!isLoading && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-green-600/10 hover:bg-green-600/20 text-gray-900 border border-green-200 transition-all duration-200">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="hidden sm:inline font-medium">
                      {user?.firstName || user?.email || "Profile"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user?.firstName || user?.email || "User"}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {isOwner && (
                        <p className="text-xs text-green-600 font-semibold mt-1">Business Owner</p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/wishlist">
                    <DropdownMenuItem className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Wishlist</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/trips">
                    <DropdownMenuItem className="cursor-pointer">
                      <Plane className="mr-2 h-4 w-4" />
                      <span>My Trips</span>
                    </DropdownMenuItem>
                  </Link>
                  {isOwner && (
                    <Link to="/business">
                      <DropdownMenuItem className="cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Business Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !isLoading ? (
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-600 text-white shadow-md transition-all duration-200 font-medium">
                  Sign In
                </Button>
              </Link>
            ) : null}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {!isLoading && isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="pb-4 border-b">
                          <p className="text-sm text-gray-600">Welcome back,</p>
                          <p className="font-semibold text-gray-900">
                            {user?.firstName || user?.email || "User"}
                          </p>
                          {isOwner && (
                            <p className="text-xs text-green-600 font-semibold mt-1">Business Owner</p>
                          )}
                        </div>
                        <Link to="/wishlist" className="block">
                          <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                            Wishlist
                          </Button>
                        </Link>
                        <Link to="/trips" className="block">
                          <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                            My Trips
                          </Button>
                        </Link>
                        <Link to="/profile" className="block">
                          <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                            Profile
                          </Button>
                        </Link>
                        {isOwner && (
                          <Link to="/business" className="block">
                            <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                              Business Dashboard
                            </Button>
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="pt-4 border-t space-y-2">
                        <Link to="/auth" className="block">
                          <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                            Log in
                          </Button>
                        </Link>
                          <Button className="w-full bg-green-600 hover:bg-green-600/90" onClick={() => setIsOpen(false)}>
                            <a onClick ={() => navigate('/auth')}>
                              Sign up
                            </a>
                          </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}