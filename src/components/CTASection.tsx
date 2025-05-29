
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CTASection = () => {
  const { data: ctaSettings } = useQuery({
    queryKey: ['cta-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'cta_text')
        .single();
      
      return data?.value || 'Explore Our Catalog and Get Your Prints';
    }
  });

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-orange-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          {ctaSettings}
        </h2>
        <Button 
          size="lg" 
          className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg"
          onClick={scrollToProducts}
        >
          Explore Now
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
