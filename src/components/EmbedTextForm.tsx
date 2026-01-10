"use client";

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Eye, Image as ImageIcon } from 'lucide-react';

import { embedTextInImage, loadImageData, imageDataToBlob } from '@/modules/Steganography';
import { downloadFile } from '@/utils/download';

export const EmbedTextForm = () => {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setImageFile(selectedFile);
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select an image file (e.g., PNG).',
        variant: 'destructive',
      });
      setImageFile(null);
    }
  };

  const handleEmbed = useCallback(async () => {
    if (!imageFile || !textInput) {
      toast({
        title: 'Missing Inputs',
        description: 'Missing: Image, Text to embed.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const imageData = await loadImageData(imageFile);
      const embeddedImageData = embedTextInImage(imageData, textInput);
      const embeddedImageBlob = await imageDataToBlob(embeddedImageData);

      const newFileName = `embedded_${imageFile.name.split('.').slice(0, -1).join('.') || 'image'}.png`;
      downloadFile(embeddedImageBlob, newFileName);

      toast({
        title: 'Embedding Successful',
        description: `Text embedded and image saved as ${newFileName}. (Note: Use PNG for best results)`,
      });
    } catch (error) {
      toast({
        title: 'Embedding Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred during embedding.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, textInput, toast]);

  return (
    <Card className="w-full mx-auto shadow-xl rounded-xl border-border/50 dark:border-border/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-primary dark:text-primary-foreground">
          <ImageIcon className="mr-3 h-7 w-7 text-secondary dark:text-accent" />
          Embed Text in Image
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="embed-image-file" className="text-foreground">Image Input / Upload</Label>
          <Input id="embed-image-file" type="file" accept="image/png, image/jpeg" onChange={handleImageChange} className="file:text-primary file:font-medium file:bg-muted file:border-muted-foreground/20 file:rounded-md file:mr-2 file:py-1 file:px-3 hover:file:bg-muted-foreground/10 transition-colors" />
          {imageFile && <p className="text-sm text-muted-foreground">Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)</p>}
          <p className="text-xs text-muted-foreground mt-1">
            For best results, use PNG images. JPEG compression can corrupt hidden data.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-to-hide" className="text-foreground">Text to Hide</Label>
          <Textarea
            id="text-to-hide"
            placeholder="Enter secret message to embed inside the image... (Encrypt the text before embedding for higher security)"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={4}
            className="focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <Button
          onClick={handleEmbed}
          disabled={isLoading || !imageFile || !textInput}
          className="w-full bg-gradient-to-r from-secondary to-accent text-secondary-foreground hover:from-secondary/90 hover:to-accent/90 transition-all duration-300 ease-in-out shadow-lg"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
          Embed Text
        </Button>
      </CardContent>
    </Card>
  );
};