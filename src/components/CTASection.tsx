import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
const CTASection = () => {
  const {
    data: ctaSettings
  } = useQuery({
    queryKey: ['cta-settings'],
    queryFn: async () => {
      const {
        data
      } = await supabase.from('site_settings').select('*').eq('key', 'cta_text').single();
      return data?.value || 'Explore Our Catalog and Get Your Prints';
    }
  });
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="py-20 bg-istickers-orange text-white text-center bg-[#ff7e00]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Explore Our Catalog and Get Your Prints</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Browse a wide range of custom sticker styles and printing options. Find the perfect fit for your brand or project—fast turnaround, no minimums!
            </p>
            <a href="/products" className="bg-white text-orange-600 font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all shadow-md inline-flex items-center gap-2">
              Explore Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </section>

  // <section className="py-16 bg-orange-600">
  //   <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  //     <h2 className="text-3xl font-bold text-white mb-8">
  //       {ctaSettings}
  //     </h2>
  //     <Button 
  //       size="lg" 
  //       className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg"
  //       onClick={scrollToProducts}
  //     >
  //       Explore Now
  //     </Button>
  //   </div>
  // </section>
  ;
};
export default CTASection;