
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      comment: "iStickers made my custom sticker dreams come true! The quality is outstanding and the colors are so vibrant. Will definitely order again!",
    },
    {
      id: 2,
      name: "Bob Williams",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 4,
      comment: "Great service and fast shipping. The stickers were exactly as I designed them. Only wish there were more material options.",
    },
    {
      id: 3,
      name: "Charlie Brown",
      avatar: "https://i.pravatar.cc/150?img=14",
      rating: 5,
      comment: "The holographic stickers I ordered are a hit! They look amazing on my laptop and water bottle. Thanks, iStickers!",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-istickers-blue/10 text-istickers-blue font-medium text-sm mb-4">Trusted by Thousands</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-istickers-dark">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-700">
            We're proud to have so many happy customers. Here's what some of them have to say about their iStickers experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="w-10 h-10 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">"{testimonial.comment}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
