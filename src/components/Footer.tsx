import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-100 text-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-gray-600 mb-4">
              Creating premium custom stickers that bring your designs to life. Express yourself with the highest quality materials and printing.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-orange-600" />
                <span>+1 801-783-4566</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-orange-600" />
                <a href="mailto:sales@luvstickers.com" className="text-gray-600 hover:text-orange-600 transition-colors">
                  sales@luvstickers.com
                </a>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-gray-600 hover:text-orange-600 transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-orange-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/returns" className="text-gray-600 hover:text-orange-600 transition-colors">Returns</Link></li>
              
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-600 hover:text-orange-600 transition-colors">About Us</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-orange-600 transition-colors">Products</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-orange-600 transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Luvstickers. {' '}
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;