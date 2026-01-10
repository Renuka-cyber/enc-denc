"use client";

import React from 'react';
import { ExtractTextForm } from '@/components/ExtractTextForm';
import Header from '@/components/Header';

const ExtractTextPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Header />
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 flex-grow">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-primary dark:text-primary-foreground leading-tight">
          Extract Text from Image
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
          Reveal the hidden message from an image file.
        </p>
        <div className="w-full max-w-2xl">
          <ExtractTextForm />
        </div>
        <p className="text-sm text-muted-foreground mt-8 text-center max-w-md">
          For best results, use PNG images. JPEG compression can corrupt hidden data.
        </p>
      </div>
    </div>
  );
};

export default ExtractTextPage;