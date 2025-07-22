
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Phone, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <div>
      {/* Top contact bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-10 text-sm">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                <span>Call us: +1 801-783-4566</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                <a href="mailto:sales@luvstickers.com" className="hover:text-orange-600 transition-colors">
                  sales@luvstickers.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-orange-600 transition-colors">
                Products
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-orange-600 transition-colors">
                Blog
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-orange-600 transition-colors">
                  Support
                  <ChevronDown className="ml-1 w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/about">About Us</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/faq">FAQ</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/contact">Contact Us</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/returns">Returns</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/track-order">Track Order</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <Link to="/products">Get Quote</Link>
              </Button>
            </div>
            
            <div className="md:hidden">
              <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                <Link to="/products">Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
