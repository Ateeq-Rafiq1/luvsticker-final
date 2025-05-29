
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Material data
const materialTypes = [
  {
    id: "vinyl",
    name: "Vinyl Stickers",
    description: "Our most popular material. Durable, weather-resistant stickers perfect for indoor and outdoor use. These stickers are waterproof and UV resistant.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=400",
    features: ["Waterproof", "UV resistant", "3-5 year outdoor lifespan", "Scratch resistant"],
    popular: true,
    bestFor: ["Laptops", "Water bottles", "Outdoor equipment", "Car bumpers"]
  },
  {
    id: "holographic",
    name: "Holographic Stickers",
    description: "Eye-catching rainbow effect that shifts colors as light hits it from different angles. Perfect for adding a unique, premium look.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600&h=400",
    features: ["Rainbow effect", "Color-shifting", "Premium finish", "Water-resistant"],
    popular: false,
    bestFor: ["Notebooks", "Electronics", "Merchandise", "Brand packaging"]
  },
  {
    id: "transparent",
    name: "Transparent Stickers",
    description: "Clear stickers that let the surface show through. Ideal for glass, windows, and creating a 'floating' effect on any surface.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600&h=400",
    features: ["Crystal clear", "UV resistant", "Perfect for glass", "Seamless look"],
    popular: true,
    bestFor: ["Windows", "Glass surfaces", "Product packaging", "Electronic devices"]
  },
  {
    id: "glitter",
    name: "Glitter Stickers",
    description: "Add a touch of sparkle with our glitter stickers. These eye-catching stickers contain real glitter particles sealed under a protective coating.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600&h=400",
    features: ["Sparkly finish", "Sealed glitter", "Durable coating", "Indoor use"],
    popular: false,
    bestFor: ["Greeting cards", "Journals", "Arts & crafts", "Decorative items"]
  },
  {
    id: "mirror",
    name: "Mirror Stickers",
    description: "Highly reflective silver or gold finish that creates a mirror-like effect. Perfect for creating metallic accents and premium branding.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400",
    features: ["Reflective surface", "Premium look", "Gold or silver options", "Striking effect"],
    popular: false,
    bestFor: ["Premium packaging", "Specialty products", "High-end branding", "Limited editions"]
  },
  {
    id: "kraft",
    name: "Kraft Paper Stickers",
    description: "Eco-friendly brown kraft paper stickers with a natural, rustic look. Perfect for organic products and environmentally conscious brands.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=400",
    features: ["Eco-friendly", "Biodegradable", "Rustic feel", "Matte finish"],
    popular: false,
    bestFor: ["Organic products", "Handmade items", "Natural brands", "Gift packaging"]
  },
  {
    id: "aluminum",
    name: "Brushed Aluminum",
    description: "Metallic stickers with the look and texture of brushed aluminum. These premium stickers add a sophisticated, industrial feel to any surface.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600&h=400",
    features: ["Metallic finish", "Textured surface", "Industrial look", "Premium feel"],
    popular: false,
    bestFor: ["Tech products", "Appliances", "Industrial equipment", "Modern decor"]
  },
  {
    id: "glow",
    name: "Glow in the Dark",
    description: "These stickers absorb light and then glow in darkness. Perfect for safety signs, light switches, or creating fun nighttime effects.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=400",
    features: ["Photoluminescent", "Charges in light", "Glows 6-8 hours", "Indoor use"],
    popular: false,
    bestFor: ["Safety signage", "Kids' rooms", "Light switches", "Halloween items"]
  }
];

// Material categories for filtering
const categories = [
  { value: "all", label: "All Materials" },
  { value: "popular", label: "Popular" },
  { value: "waterproof", label: "Waterproof" },
  { value: "specialty", label: "Specialty" },
  { value: "eco-friendly", label: "Eco-friendly" }
];

const Materials = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredMaterials, setFilteredMaterials] = useState(materialTypes);
  const [selectedMaterial, setSelectedMaterial] = useState(materialTypes[0]);

  // Filter materials based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredMaterials(materialTypes);
    } else if (selectedCategory === "popular") {
      setFilteredMaterials(materialTypes.filter(material => material.popular));
    } else if (selectedCategory === "waterproof") {
      setFilteredMaterials(materialTypes.filter(material => 
        material.features.includes("Waterproof") || 
        material.features.includes("Water-resistant")
      ));
    } else if (selectedCategory === "specialty") {
      setFilteredMaterials(materialTypes.filter(material => 
        ["holographic", "glitter", "mirror", "glow"].includes(material.id)
      ));
    } else if (selectedCategory === "eco-friendly") {
      setFilteredMaterials(materialTypes.filter(material => 
        material.id === "kraft" || 
        material.features.includes("Eco-friendly") ||
        material.features.includes("Biodegradable")
      ));
    }
  }, [selectedCategory]);

  // Ensure selected material is in filtered list
  useEffect(() => {
    if (filteredMaterials.length > 0 && !filteredMaterials.includes(selectedMaterial)) {
      setSelectedMaterial(filteredMaterials[0]);
    }
  }, [filteredMaterials, selectedMaterial]);

  return (
    <>
      <Helmet>
        <title>Sticker Materials - iStickers</title>
        <meta name="description" content="Explore our range of premium sticker materials - vinyl, holographic, transparent, glitter, and more. Find the perfect finish for your custom stickers." />
      </Helmet>

      <Header />

      <main className="min-h-screen">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-istickers-violet/20 to-istickers-purple/20 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Premium Sticker Materials</h1>
              <p className="text-lg text-gray-700 mb-8">
                We use only the highest quality materials to ensure your stickers look great and last. 
                Explore our range of options to find the perfect material for your needs.
              </p>
              <div className="flex justify-center">
                <Button size="lg" className="mr-4">
                  Start Designing
                </Button>
                <Button size="lg" variant="outline">
                  Request Samples
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Materials content */}
        <section className="container mx-auto px-4 py-12">
          {/* Category filters */}
          <Tabs 
            defaultValue="all" 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="mb-10"
          >
            <div className="flex justify-center mb-6">
              <TabsList className="bg-istickers-light">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.value} 
                    value={category.value}
                    className="px-5 py-2.5"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          {/* Materials grid and details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Materials grid */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Select a Material</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {filteredMaterials.map((material) => (
                  <Card 
                    key={material.id}
                    className={`cursor-pointer transition-all ${
                      selectedMaterial.id === material.id 
                        ? "ring-2 ring-istickers-purple shadow-md" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedMaterial(material)}
                    id={material.id}
                  >
                    <div className="p-3 flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={material.image} 
                          alt={material.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{material.name}</h3>
                        {material.popular && (
                          <Badge className="bg-istickers-purple">Popular</Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Material details */}
            <div className="lg:col-span-2">
              <motion.div
                key={selectedMaterial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl overflow-hidden shadow-md"
              >
                <div className="relative">
                  <AspectRatio ratio={21 / 9}>
                    <img 
                      src={selectedMaterial.image} 
                      alt={selectedMaterial.name} 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  {selectedMaterial.popular && (
                    <Badge className="absolute top-4 right-4 bg-istickers-purple">
                      Popular Choice
                    </Badge>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-4">{selectedMaterial.name}</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    {selectedMaterial.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Key features */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                      <ul className="space-y-2">
                        {selectedMaterial.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="w-5 h-5 text-istickers-purple mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Best for */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Best For</h3>
                      <ul className="space-y-2">
                        {selectedMaterial.bestFor.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="w-5 h-5 text-istickers-amber mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1">
                      Design with {selectedMaterial.name}
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                      Request Sample
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-istickers-light py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Which material lasts the longest outdoors?</h3>
                  <p className="text-gray-700">Our vinyl stickers have the best outdoor durability, lasting 3-5 years in normal conditions. They're UV resistant and waterproof, making them perfect for outdoor applications.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Are your stickers removable?</h3>
                  <p className="text-gray-700">Yes, all our stickers are removable. However, they may leave some residue depending on the surface and how long they've been applied. For easy removal without residue, we recommend our removable vinyl option.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">Which material is best for water bottles?</h3>
                  <p className="text-gray-700">Both our vinyl and holographic stickers work excellently for water bottles. They're waterproof and can withstand repeated washing. For a classic look, choose vinyl; for something more eye-catching, go with holographic.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Materials;
