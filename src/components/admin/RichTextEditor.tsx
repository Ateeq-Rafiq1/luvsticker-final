
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link2, Image, Video } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const insertTag = (openTag: string, closeTag: string = '') => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = 
      value.substring(0, start) + 
      openTag + selectedText + closeTag + 
      value.substring(end);
    
    onChange(newValue);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newPos = start + openTag.length + selectedText.length + closeTag.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const insertImageTag = (imageUrl: string) => {
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const imageTag = `\n<div class="image-container my-6">\n  <img src="${imageUrl}" alt="Blog image" class="w-full rounded-lg shadow-md" />\n</div>\n`;
    
    const newValue = 
      value.substring(0, start) + 
      imageTag + 
      value.substring(start);
    
    onChange(newValue);
    setShowImageUpload(false);
    
    setTimeout(() => {
      textarea.focus();
      const newPos = start + imageTag.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const insertVideoTag = () => {
    if (!videoUrl.trim()) return;
    
    const textarea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    
    // Extract YouTube video ID from URL
    let videoId = '';
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoUrl.match(youtubeRegex);
    
    if (match) {
      videoId = match[1];
    }

    const videoTag = videoId 
      ? `\n<div class="video-container my-6">\n  <div class="relative w-full h-0 pb-[56.25%]">\n    <iframe src="https://www.youtube.com/embed/${videoId}" class="absolute top-0 left-0 w-full h-full rounded-lg" frameborder="0" allowfullscreen></iframe>\n  </div>\n</div>\n`
      : `\n<div class="video-container my-6">\n  <video controls class="w-full rounded-lg shadow-md">\n    <source src="${videoUrl}" type="video/mp4">\n    Your browser does not support the video tag.\n  </video>\n</div>\n`;
    
    const newValue = 
      value.substring(0, start) + 
      videoTag + 
      value.substring(start);
    
    onChange(newValue);
    setShowVideoInput(false);
    setVideoUrl("");
    
    setTimeout(() => {
      textarea.focus();
      const newPos = start + videoTag.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  const formatButtons = [
    { icon: Heading1, label: "H1", action: () => insertTag('<h1 class="text-3xl font-bold mb-4 mt-8">', '</h1>') },
    { icon: Heading2, label: "H2", action: () => insertTag('<h2 class="text-2xl font-semibold mb-3 mt-6">', '</h2>') },
    { icon: Heading3, label: "H3", action: () => insertTag('<h3 class="text-xl font-medium mb-2 mt-4">', '</h3>') },
    { icon: Bold, label: "Bold", action: () => insertTag('<strong>', '</strong>') },
    { icon: Italic, label: "Italic", action: () => insertTag('<em>', '</em>') },
    { icon: List, label: "Bullet List", action: () => insertTag('<ul class="list-disc list-inside my-4 space-y-2">\n<li>', '</li>\n</ul>') },
    { icon: ListOrdered, label: "Numbered List", action: () => insertTag('<ol class="list-decimal list-inside my-4 space-y-2">\n<li>', '</li>\n</ol>') },
    { icon: Quote, label: "Quote", action: () => insertTag('<blockquote class="border-l-4 border-orange-500 pl-4 italic my-4">', '</blockquote>') },
    { icon: Link2, label: "Link", action: () => insertTag('<a href="" class="text-orange-600 hover:underline">', '</a>') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap gap-2">
          {formatButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={button.action}
                className="h-8 px-3"
                title={button.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowImageUpload(true)}
            className="h-8 px-3"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowVideoInput(true)}
            className="h-8 px-3"
            title="Insert Video"
          >
            <Video className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className="text-sm"
        >
          {isPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {showImageUpload && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Insert Image</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowImageUpload(false)}
            >
              Cancel
            </Button>
          </div>
          <ImageUpload
            bucket="blogs"
            path="content"
            label=""
            onImageUploaded={insertImageTag}
            className="w-full"
          />
        </div>
      )}

      {showVideoInput && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Insert Video</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowVideoInput(false)}
            >
              Cancel
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                YouTube URL or Video File URL
              </label>
              <Input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or direct video URL"
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={insertVideoTag}
                disabled={!videoUrl.trim()}
                size="sm"
              >
                Insert Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {isPreview ? (
        <div 
          className="min-h-[300px] p-4 border rounded-md prose prose-sm max-w-none bg-gray-50"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <Textarea
          id="rich-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={20}
          className="font-mono text-sm"
        />
      )}

      <div className="text-xs text-gray-500 space-y-2">
        <p><strong>Quick Guide:</strong></p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div>
            <p className="font-medium mb-1">Text Formatting:</p>
            <span>• &lt;h1&gt;Main Heading&lt;/h1&gt;</span><br/>
            <span>• &lt;h2&gt;Sub Heading&lt;/h2&gt;</span><br/>
            <span>• &lt;strong&gt;Bold Text&lt;/strong&gt;</span><br/>
            <span>• &lt;em&gt;Italic Text&lt;/em&gt;</span><br/>
            <span>• &lt;p&gt;Paragraph&lt;/p&gt;</span><br/>
            <span>• &lt;a href="url"&gt;Link&lt;/a&gt;</span>
          </div>
          <div>
            <p className="font-medium mb-1">Media:</p>
            <span>• Use Image button to upload and insert images</span><br/>
            <span>• Use Video button for YouTube or video files</span><br/>
            <span>• Images and videos are automatically styled</span><br/>
            <span>• Position cursor where you want to insert media</span>
          </div>
        </div>
        <p className="text-orange-600 font-medium">
          💡 Tip: Click where you want to insert an image or video, then use the respective buttons in the toolbar.
        </p>
      </div>
    </div>
  );
};

export default RichTextEditor;
