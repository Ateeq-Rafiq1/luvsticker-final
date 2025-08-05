
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Small Business Owner",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      comment: "Luvstickers truly exceeded my expectations! The quality of the custom stickers I ordered is simply outstanding, with vibrant colors that really pop. They made my brand stand out. I'll definitely be back for more!",
    },
    {
      id: 2,
      name: "Bob Williams",
      role: "Marketing Professional",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 5,
      comment: "I couldn't be happier with my experience at Luvstickers. The service was excellent, and my stickers arrived quickly. They matched my design perfectly. Just a suggestion—more material options would be great!",
    },
    {
      id: 3,
      name: "Charlie Brown",
      role: "Creative Designer",
      avatar: "https://i.pravatar.cc/150?img=14",
      rating: 5,
      comment: "The holographic stickers from Luvstickers are fantastic! They've become a conversation starter on my laptop and water bottle. The finish is shiny and stunning. Highly recommend for anyone looking to add some flair!",
    },
    {
      id: 4,
      name: "David Smith",
      role: "Event Planner",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 5,
      comment: "Luvstickers made it so easy to create custom stickers for my event! The cut-to-shape stickers came out beautifully, and the quality is top-notch. I received so many compliments—definitely a highlight of the occasion!",
    },
    {
      id: 5,
      name: "Emily Davis",
      role: "Influencer",
      avatar: "https://i.pravatar.cc/150?img=47",
      rating: 5,
      comment: "I'm super impressed with the square stickers I ordered from Luvstickers. They're perfect for packaging my products. The edges are sharp, and they look really professional. I'll be ordering regularly for my brand!",
    },
    {
      id: 6,
      name: "Frank Green",
      role: "Graphic Artist",
      avatar: "https://i.pravatar.cc/150?img=59",
      rating: 5,
      comment: "The die-cut stickers I ordered from Luvstickers were just what I needed! The vinyl quality is durable and waterproof, making them perfect for outdoor use. Loving how my designs come to life with them!",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <div className="flex items-center text-yellow-500 mt-1">
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
