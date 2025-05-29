
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const VideoSection = () => {
  const { data: videoSettings } = useQuery({
    queryKey: ['video-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('key', ['video_section_title', 'video_section_content', 'video_embed_url']);
      
      return data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>) || {};
    }
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">
          {videoSettings?.video_section_title || 'See Our Stickers in Action'}
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          {videoSettings?.video_section_content || 'Watch how we create amazing custom stickers that bring your designs to life.'}
        </p>
        <div className="aspect-video">
          <iframe
            src={videoSettings?.video_embed_url || 'https://www.youtube.com/embed/WtPXc5w0MUc?controls=0&modestbranding=1&rel=0&showinfo=0'}
            className="w-full h-full rounded-lg shadow-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
