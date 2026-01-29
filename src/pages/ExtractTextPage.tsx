"use client";

import React from 'react';
import { ExtractTextForm } from '@/components/ExtractTextForm';
import Header from '@/components/Header';

const ExtractTextPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground">
      <Header />
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 flex-grow">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-primary dark:text-primary-foreground leading-tight">
          Extract Text from Image
        </h1>
        <p className="text-lg text-muted-foreground mb-6 text-center max-w-2xl"> {/* Reduced mb-8 to mb-6 */}
          Reveal the hidden message from an image file.
        </p>
        <div className="w-full max-w-2xl">
          <ExtractTextForm />
        </div>
        <p className="text-sm text-muted-foreground mt-6 text-center max-w-md"> {/* Reduced mt-8 to mt-6 */}
          For best results, use PNG images. JPEG compression can corrupt hidden data.
        </p>
      </div>
    </div>
  );
};

export default ExtractTextPage;