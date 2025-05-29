
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import StickerShowcase from "@/components/home/StickerShowcase";
import Testimonials from "@/components/home/Testimonials";
import VideoSection from "@/components/home/VideoSection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Luvstickers | Custom Sticker Design and Printing</title>
        <meta 
          name="description" 
          content="Create and order high-quality custom stickers online. Choose from various materials and finishes. Fast shipping and 100% satisfaction guaranteed."
        />
      </Helmet>
      <Header />
      <main>
        <Hero />
        <StickerShowcase />
        <VideoSection />
        <Testimonials />
        
        {/* CTA Section - with orange background */}
        <section className="py-20 bg-istickers-orange text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Explore Our Catalog and Get Your Prints</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Browse a wide range of custom sticker styles and printing options. Find the perfect fit for your brand or project—fast turnaround, no minimums!
            </p>
            <a 
              href="/catalog" 
              className="bg-white text-istickers-orange font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all shadow-md inline-flex items-center gap-2"
            >
              Explore Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
