
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  const benefits = [
    "Free Shipping on $35+",
    "Premium Materials",
    "100% Satisfaction"
  ];

  return (
    <div className="relative overflow-hidden bg-istickers-orange">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 space-y-6 animate-fade-in">
            <div className="inline-block px-4 py-1 rounded-full bg-white/20 text-white font-medium text-sm mb-2">
              Custom Sticker Printing
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Turn Your Designs Into Amazing <span className="text-white">Custom Stickers</span>
            </h1>
            
            <p className="text-lg text-white/90 max-w-lg">
              High-quality, durable stickers in any shape, size, or material. Perfect for personal use, branding, events, or just for fun!
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/catalog" className="bg-white text-istickers-orange font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all shadow-md inline-flex items-center gap-2">
                Browse Designs
                <ArrowRight size={18} />
              </Link>
              
            </div>
            
            <div className="pt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-white mr-2" />
                  <span className="text-sm font-medium text-white">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center md:justify-end animate-slide-up">
            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-1 rounded-3xl bg-white opacity-75 blur-lg"></div>
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
                <img 
                  src="/hero.png"
                  alt="Colorful sticker collection" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating element */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 w-40">
                <div className="text-sm font-bold text-istickers-orange">4.9/5</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">5,000+ Happy Customers</div>
              </div>
              
              {/* Floating element */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 w-32">
                <div className="flex items-center justify-center">
                  <div className="text-xs font-bold text-gray-800">24hr Turnaround</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full">
          <path fill="#f1f1f1" fillOpacity="1" d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,37.3C1120,21,1280,11,1440,21.3L1440,80L0,80Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
