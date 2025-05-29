
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">StickerStore</h3>
            <p className="text-gray-300 mb-4">
              High-quality custom stickers for all your needs. From personal designs to business branding, we've got you covered.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-orange-500 transition-colors">Blog</Link></li>
              <li><Link to="/track-order" className="text-gray-300 hover:text-orange-500 transition-colors">Track Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300">Email: info@stickerstore.com</p>
            <p className="text-gray-300">Phone: (555) 123-4567</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">&copy; 2025 StickerStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
