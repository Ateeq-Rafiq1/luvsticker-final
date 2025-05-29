
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  bucket: string;
  path?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  currentImage?: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export const ImageUpload = ({
  bucket,
  path = "",
  onImageUploaded,
  onImageRemoved,
  currentImage,
  label,
  accept = "image/*",
  multiple = false,
  className
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (multiple) {
      for (const file of files) {
        await uploadImage(file);
      }
    } else {
      await uploadImage(files[0]);
    }
  };

  const removeImage = async () => {
    if (currentImage && onImageRemoved) {
      onImageRemoved();
      toast({ title: "Image removed" });
    }
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">
        {currentImage ? (
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
            {onImageRemoved && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                onClick={removeImage}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
          </div>
        )}
        
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${bucket}-${path}`}
          />
          <Label
            htmlFor={`file-upload-${bucket}-${path}`}
            className="cursor-pointer"
          >
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="w-full"
              asChild
            >
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : `Upload ${label}`}
              </span>
            </Button>
          </Label>
        </div>
      </div>
    </div>
  );
};
