import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
const VideoSection = () => {
  const {
    data: videoSettings
  } = useQuery({
    queryKey: ['video-settings'],
    queryFn: async () => {
      const {
        data
      } = await supabase.from('site_settings').select('*').in('key', ['video_section_title', 'video_section_content', 'video_embed_url']);
      return data?.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>) || {};
    }
  });
  return;
};
export default VideoSection;