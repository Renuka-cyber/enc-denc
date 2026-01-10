"use client";

import React from 'react';
import { CryptoForm } from '@/components/CryptoForm';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Header from '@/components/Header'; // Import Header

const DecryptPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Header /> {/* Add Header here */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 flex-grow"> {/* Added flex-grow to push content down */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-primary dark:text-primary-foreground leading-tight">
          Decrypt a File
        </h1>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
          Argon2id + AES-256-GCM Hybrid Decryption System
        </p>

        <div className="w-full max-w-2xl">
          <CryptoForm defaultMode="decrypt" />
        </div>

        {/* Moved below CryptoForm and restyled */}
        <Card className="w-full max-w-4xl mt-8 bg-info border-info-foreground/20 text-info-foreground shadow-lg rounded-xl py-2">
          <CardContent className="p-3 flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-info-foreground" />
            <CardDescription className="text-sm font-medium text-info-foreground">
              Decryption requires the same password and email used during encryption.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DecryptPage;