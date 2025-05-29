
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });
      
      return data || [];
    }
  });

  if (isLoading || !testimonials?.length) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="flex-shrink-0 w-80">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {testimonial.image_url && (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.customer_name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.customer_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
