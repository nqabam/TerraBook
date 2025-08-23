import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "@/context/appContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openSignIn } = useClerk();

  const { user, navigate } = useAppContext()



  return (
    <nav className="bg-white backdrop-blur-sm border-b border-green-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-green p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-green-700" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              <span className="text-black">Terra</span><span className="text-green-700">Book</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a onClick = { () => navigate('/features') } className="text-black hover:text-green-700 transition-colors">
              Features
            </a>
            <a onClick = { () => navigate('pricing') } className="text-black hover:text-green-700 transition-colors">
              Pricing
            </a>
            <a onClick = { () => navigate('/support') }  className="text-black hover:text-green-700 transition-colors">
              Support
            </a>
            {user ? 
            (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action label="My Property" labelIcon={<Building2></Building2>} onClick={() => navigate('/admin')} />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <Button
                variant="outline" 
                className="w-fit border-green-100 bg-green-600 text-white hover:bg-green-200"
                onClick={() => openSignIn()}
              >
                Sign In
              </Button>
            )
            }
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="space-y-2">
              <a onClick = { () => navigate('/features') } className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Features
              </a>
              <a onClick = { () => navigate('/prices') } className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Pricing
              </a>
              <a onClick = { () => navigate('/support') } className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Support
              </a>
                <Button 
                  variant="outline" 
                  className="w-fit border-white bg-green-600 text-white hover:bg-green-200"
                  onClick={() => openSignIn()}

                >
                  Sign In
                </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;