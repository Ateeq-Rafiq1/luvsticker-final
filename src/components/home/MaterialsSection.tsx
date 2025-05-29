
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const MaterialsSection = () => {
  // Featured materials for home page
  const featuredMaterials = [
    {
      id: "vinyl",
      name: "Vinyl Stickers",
      description: "Durable, waterproof stickers for indoor and outdoor use.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      id: "holographic",
      name: "Holographic Stickers",
      description: "Eye-catching rainbow effect stickers that shift colors in light.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600&h=400"
    },
    {
      id: "transparent",
      name: "Transparent Stickers",
      description: "Clear stickers that create a 'floating' effect on any surface.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600&h=400"
    }
  ];

  return (
    <section className="py-16 bg-istickers-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Premium Materials</h2>
            <p className="text-gray-600 max-w-xl">
              Choose from our selection of high-quality materials to create stickers that stand out
            </p>
          </div>
          <Link to="/materials" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Materials
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div>
                <AspectRatio ratio={16 / 9}>
                  <img 
                    src={material.image} 
                    alt={material.name} 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-semibold mb-2">{material.name}</h3>
                <p className="text-gray-600 mb-4">{material.description}</p>
                <Link to={`/materials#${material.id}`} className="text-istickers-purple hover:underline inline-flex items-center">
                  Learn more
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;
