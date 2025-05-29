
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const VideoSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold leading-tight">
            Free shipping, free online proofs, fast turnaround
          </h1>

          <p className="text-lg text-gray-700">
            Sticker Mule is the easiest way to buy custom stickers & decals, labels, and other printing online.
            Order in 60 seconds and we'll turn your designs and illustrations into custom stickers, magnets,
            buttons, labels and packaging in days. We offer free online proofs, free worldwide shipping and
            super fast turnaround.
          </p>

          <div className="w-full mt-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.youtube.com/embed/WtPXc5w0MUc?controls=0&modestbranding=1&rel=0&showinfo=0"
                title="Custom Sticker Printing Process"
                className="w-full h-[400px] object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
