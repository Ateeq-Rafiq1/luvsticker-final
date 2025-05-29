
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link2 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);

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

  const formatButtons = [
    { icon: Heading1, label: "H1", action: () => insertTag('<h1>', '</h1>') },
    { icon: Heading2, label: "H2", action: () => insertTag('<h2>', '</h2>') },
    { icon: Heading3, label: "H3", action: () => insertTag('<h3>', '</h3>') },
    { icon: Bold, label: "Bold", action: () => insertTag('<strong>', '</strong>') },
    { icon: Italic, label: "Italic", action: () => insertTag('<em>', '</em>') },
    { icon: List, label: "Bullet List", action: () => insertTag('<ul>\n<li>', '</li>\n</ul>') },
    { icon: ListOrdered, label: "Numbered List", action: () => insertTag('<ol>\n<li>', '</li>\n</ol>') },
    { icon: Quote, label: "Quote", action: () => insertTag('<blockquote>', '</blockquote>') },
    { icon: Link2, label: "Link", action: () => insertTag('<a href="">', '</a>') },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
          rows={15}
          className="font-mono text-sm"
        />
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Quick Guide:</strong></p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <span>• &lt;h1&gt;Main Heading&lt;/h1&gt;</span>
          <span>• &lt;h2&gt;Sub Heading&lt;/h2&gt;</span>
          <span>• &lt;strong&gt;Bold Text&lt;/strong&gt;</span>
          <span>• &lt;em&gt;Italic Text&lt;/em&gt;</span>
          <span>• &lt;p&gt;Paragraph&lt;/p&gt;</span>
          <span>• &lt;a href="url"&gt;Link&lt;/a&gt;</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
