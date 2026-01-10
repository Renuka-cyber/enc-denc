"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, EyeOff, Image as ImageIcon } from 'lucide-react';

import { extractTextFromImage, loadImageData } from '@/modules/Steganography';

export const ExtractTextForm = () => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setImageFile(selectedFile);
    setExtractedText(''); // Clear extracted text on new image selection
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select an image file (e.g., PNG).',
        variant: 'destructive',
      });
      setImageFile(null);
    }
  };

  const handleExtract = useCallback(async () => {
    if (!imageFile) {
      toast({
        title: 'Missing Image',
        description: 'Missing: Image.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const imageData = await loadImageData(imageFile);
      const text = extractTextFromImage(imageData);
      setExtractedText(text);
      toast({
        title: 'Extraction Successful',
        description: 'Text extracted from the image.',
      });
    } catch (error) {
      setExtractedText('');
      toast({
        title: 'Extraction Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred during extraction. Image may not contain hidden data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, toast]);

  return (
    <Card className="w-full mx-auto shadow-xl rounded-xl border-border/50 dark:border-border/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-primary dark:text-primary-foreground">
          <ImageIcon className="mr-3 h-7 w-7 text-secondary dark:text-accent" />
          Extract Text from Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="extract-image-file" className="text-foreground">Image Input / Upload</Label>
          <Input id="extract-image-file" type="file" accept="image/png, image/jpeg" onChange={handleImageChange} className="file:text-primary file:font-medium file:bg-muted file:border-muted-foreground/20 file:rounded-md file:mr-2 file:py-1 file:px-3 hover:file:bg-muted-foreground/10 transition-colors" />
          {imageFile && <p className="text-sm text-muted-foreground">Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)</p>}
          <p className="text-xs text-muted-foreground">
            For best results, use PNG images. JPEG compression can corrupt hidden data.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="extracted-text" className="text-foreground">Extracted Text</Label>
          <Textarea
            id="extracted-text"
            placeholder="Extracted text will appear here..."
            value={extractedText}
            readOnly
            rows={4}
            className="bg-muted focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          {extractedText && (
            <Button
              onClick={() => navigator.clipboard.writeText(extractedText)}
              className="w-full mt-2"
              variant="secondary"
            >
              Copy Extracted Text
            </Button>
          )}
        </div>

        <Button
          onClick={handleExtract}
          disabled={isLoading || !imageFile}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 ease-in-out shadow-lg"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <EyeOff className="mr-2 h-4 w-4" />}
          Extract Text
        </Button>
      </CardContent>
    </Card>
  );
};