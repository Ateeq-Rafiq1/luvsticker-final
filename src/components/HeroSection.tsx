
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const { data: heroSettings } = useQuery({
    queryKey: ['hero-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['hero_title', 'hero_subtitle']);
      
      return data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>) || {};
    }
  });

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-orange-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {heroSettings?.hero_title || 'Turn Your Designs Into Amazing Custom Stickers'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {heroSettings?.hero_subtitle || 'High-quality, durable stickers in any shape, size, or material. Perfect for personal use, branding, events, or just for fun!'}
          </p>
          <Button 
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg"
            onClick={scrollToProducts}
          >
            Start Designing Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
