
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ArtworkUploadSectionProps {
  onArtworkChange: (file: File | null) => void;
  onEmailOptionChange: (useEmail: boolean) => void;
  onNext: () => void;
  selectedFile: File | null;
  emailOption: boolean;
}

const ArtworkUploadSection = ({ 
  onArtworkChange, 
  onEmailOptionChange, 
  onNext, 
  selectedFile,
  emailOption 
}: ArtworkUploadSectionProps) => {
  const [copied, setCopied] = useState(false);
  const email = "luvstickers3@gmail.com";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onArtworkChange(e.target.files[0]);
    }
  };

  const handleEmailOptionChange = (checked: boolean) => {
    onEmailOptionChange(checked);
    if (checked) {
      // Clear any selected file when switching to email option
      onArtworkChange(null);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast({
        title: "Email copied!",
        description: "The email address has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the email manually.",
        variant: "destructive",
      });
    }
  };

  const canProceed = selectedFile || emailOption;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Upload Your Artwork</h3>
        
        {!emailOption && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="artwork">Choose your artwork file</Label>
              <Input
                id="artwork"
                type="file"
                accept="image/*,.pdf,.ai,.eps,.svg"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email-artwork"
              checked={emailOption}
              onCheckedChange={handleEmailOptionChange}
            />
            <Label htmlFor="email-artwork" className="text-sm font-medium">
              Skip artwork upload and send by email
            </Label>
          </div>
          
          {emailOption && (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-600">
                Please send your artwork to the email address below:
              </p>
              <div className="flex items-center space-x-2 bg-white p-3 rounded border">
                <span className="font-mono text-sm flex-1">{email}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyEmail}
                  className="flex items-center space-x-1"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </Button>
              </div>
              <p className="text-sm text-amber-600">
                ⚠️ Make sure to include your order details when sending the artwork via email.
              </p>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full bg-orange-600 hover:bg-orange-700"
      >
        Continue to Review
      </Button>
    </div>
  );
};

export default ArtworkUploadSection;
