
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-600">StickerStore</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-orange-600 transition-colors">
              Blog
            </Link>
            <Link to="/track-order" className="text-gray-700 hover:text-orange-600 transition-colors">
              Track Order
            </Link>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link to="#products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
