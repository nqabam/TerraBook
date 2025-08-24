import { Link } from "react-router-dom";
import { Leaf, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-terra-darker text-white mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="w-8 h-8 text-terra-primary" />
              <span className="text-2xl font-bold">
                <span className="text-terra-primary">Terra</span>
                <span className="text-white">Book</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              Sustainable travel experiences across South Africa
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-gray-300 hover:text-terra-primary transition-colors text-sm">
                  Explore
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-terra-primary transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <Link href="/business" className="text-gray-300 hover:text-terra-primary transition-colors text-sm">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link href="/list-event" className="text-gray-300 hover:text-terra-primary transition-colors text-sm">
                  List Your Event
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-terra-primary" />
                <span className="text-gray-300 text-sm">support@terrabook.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-terra-primary" />
                <span className="text-gray-300 text-sm">Johannesburg, South Africa</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://facebook.com/terrabook" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow TerraBook on Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-400 hover:text-terra-primary cursor-pointer transition-colors" />
              </a>
              <a 
                href="https://instagram.com/terrabook" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow TerraBook on Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 hover:text-terra-primary cursor-pointer transition-colors" />
              </a>
              <a 
                href="https://twitter.com/terrabook" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow TerraBook on Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-400 hover:text-terra-primary cursor-pointer transition-colors" />
              </a>
              <a 
                href="https://linkedin.com/company/terrabook" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Connect with TerraBook on LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-terra-primary cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <div className="text-sm text-gray-400">
            © 2024 TerraBook. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}