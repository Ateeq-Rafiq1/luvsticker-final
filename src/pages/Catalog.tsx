
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { List, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { stickerTypes } from "@/data/stickerData";

const Catalog = () => {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <>
      <Helmet>
        <title>Sticker Catalog - Luvstickers</title>
        <meta name="description" content="Browse our selection of custom stickers - die-cut, circle, rectangle, square, and cut to shape. Find the perfect sticker for your project." />
      </Helmet>

      <Header />

      <main className="min-h-screen">
        <div className="bg-istickers-light py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sticker Catalog</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Browse our selection of premium quality stickers in various shapes and sizes. 
              Find the perfect sticker for your project.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* View Toggle and Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">{stickerTypes.length} products found</p>
            <div className="flex items-center gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("grid")}
                title="Grid view"
              >
                <Square size={16} />
              </Button>
              
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("list")}
                title="List view"
              >
                <List size={16} />
              </Button>
            </div>
          </div>

          {/* Sticker Grid */}
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stickerTypes.map((sticker) => (
                <Card key={sticker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-ratio overflow-hidden bg-gray-100">
                    <img
                      src={sticker.image}
                      alt={sticker.name}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{sticker.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{sticker.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-istickers-purple">From ${sticker.price.toFixed(2)}</span>
                      <Button asChild size="sm">
                        <Link to={`/product/${sticker.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stickerTypes.map((sticker) => (
                <Card key={sticker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 overflow-hidden bg-gray-100">
                      <img
                        src={sticker.image}
                        alt={sticker.name}
                        className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="md:w-2/3 p-4">
                      <h3 className="font-semibold text-lg mb-2">{sticker.name}</h3>
                      <p className="text-gray-600 mb-4">{sticker.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-istickers-purple text-lg">From ${sticker.price.toFixed(2)}</span>
                        <Button asChild>
                          <Link to={`/product/${sticker.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Catalog;
