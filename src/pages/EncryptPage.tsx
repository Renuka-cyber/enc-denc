"use client";

import React from 'react';
import { CryptoForm } from '@/components/CryptoForm';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Header from '@/components/Header'; // Import Header

const EncryptPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Header /> {/* Add Header here */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 flex-grow"> {/* Added flex-grow to push content down */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-primary dark:text-primary-foreground leading-tight">
          Encrypt a File
        </h1>
        <p className="text-lg text-muted-foreground mb-6 text-center max-w-2xl"> {/* Reduced mb-8 to mb-6 */}
          Argon2id + AES-256-GCM Hybrid Encryption System
        </p>

        <Card className="w-full max-w-4xl mb-6 bg-warning border-warning-foreground/20 text-warning-foreground shadow-lg rounded-xl py-2"> {/* Reduced mb-10 to mb-6 */}
          <CardContent className="p-3 flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-warning-foreground" />
            <CardDescription className="text-sm font-medium text-warning-foreground">
              Your password and receiver email are required to decrypt this file. We do not store them.
            </CardDescription>
          </CardContent>
        </Card>

        <div className="w-full max-w-2xl">
          <CryptoForm defaultMode="encrypt" />
        </div>
      </div>
    </div>
  );
};

export default EncryptPage;