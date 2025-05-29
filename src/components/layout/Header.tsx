
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { stickerTypes } from '@/data/stickerData';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStickersDropdownOpen, setIsStickersDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleStickersDropdown = () => {
    setIsStickersDropdownOpen(!isStickersDropdownOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button 
                onClick={toggleStickersDropdown}
                className="flex items-center font-medium hover:text-istickers-orange transition-colors"
              >
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isStickersDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                  <div className="py-2">
                    {stickerTypes.map((type) => (
                      <Link 
                        key={type.id} 
                        to={`/product/${type.id}`} 
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setIsStickersDropdownOpen(false)}
                      >
                        {type.name}
                      </Link>
                    ))}
                    <Link 
                      to="/catalog" 
                      className="block px-4 py-2 mt-1 border-t text-sm font-medium text-istickers-orange"
                      onClick={() => setIsStickersDropdownOpen(false)}
                    >
                      View All Stickers
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link to="/about" className="font-medium hover:text-istickers-orange transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-istickers-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-istickers-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <div className="py-2 border-b">
              <div className="font-medium py-2 mb-2">Stickers</div>
              <div className="ml-4 flex flex-col gap-2">
                {stickerTypes.map((type) => (
                  <Link 
                    key={type.id} 
                    to={`/product/${type.id}`} 
                    className="text-sm py-1"
                    onClick={toggleMenu}
                  >
                    {type.name}
                  </Link>
                ))}
                <Link 
                  to="/catalog" 
                  className="text-sm py-1 font-medium text-istickers-orange"
                  onClick={toggleMenu}
                >
                  View All Stickers
                </Link>
              </div>
            </div>
            
            <Link 
              to="/about" 
              className="font-medium py-2 hover:text-istickers-orange"
              onClick={toggleMenu}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
