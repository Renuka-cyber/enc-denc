"use client";

import React from 'react';
import { EmbedTextForm } from '@/components/EmbedTextForm'; // Import the new EmbedTextForm
import { ExtractTextForm } from '@/components/ExtractTextForm'; // Import the new ExtractTextForm
import Header from '@/components/Header';

const SteganographyPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Header />
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 flex-grow">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-primary dark:text-primary-foreground leading-tight">
          Steganography Tool
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
          Securely hide secret information inside an image using LSB steganography.
        </p>

        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
          <div className="flex-1">
            <EmbedTextForm /> {/* Use the new EmbedTextForm */}
          </div>
          <div className="flex-1">
            <ExtractTextForm /> {/* Use the new ExtractTextForm */}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-8 text-center max-w-md">
          This tool adds an additional security layer by hiding encrypted data inside images.
        </p>
      </div>
    </div>
  );
};

export default SteganographyPage;