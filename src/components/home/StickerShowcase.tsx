
import { Link } from 'react-router-dom';
import { stickerTypes } from '@/data/stickerData';
import { ArrowRight } from 'lucide-react';

const StickerShowcase = () => {
  return (
    <section className="py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-istickers-orange/10 text-istickers-orange font-medium text-sm mb-4">Premium Quality</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-istickers-dark">
            Express Yourself With Premium Stickers
          </h2>
          <p className="text-xl text-gray-700">
            Choose from a variety of high-quality sticker types for every use. Our premium stickers are designed to make your ideas stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stickerTypes.slice(0, 3).map((type) => (
            <div 
              key={type.id}
              className="group relative overflow-hidden rounded-2xl shadow-xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-96 overflow-hidden">
                <img 
                  src={type.image} 
                  alt={type.name} 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">{type.name}</h3>
                  <p className="text-white/90 mb-6">{type.description}</p>
                  <Link 
                    to={`/product/${type.id}`} 
                    className="inline-flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-all"
                  >
                    Explore 
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 space-y-6">
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            From holographic to vinyl, matte to glossy - we have the perfect sticker material for your needs.
          </p>
          <Link 
            to="/catalog" 
            className="bg-istickers-orange hover:bg-istickers-orange/90 text-white font-semibold py-4 px-10 rounded-lg shadow-lg transition-all inline-flex items-center gap-2 hover:gap-3"
          >
            View All Sticker Types
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StickerShowcase;
