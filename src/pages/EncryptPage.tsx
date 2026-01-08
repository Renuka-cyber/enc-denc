"use client";

import React from 'react';
import { CryptoForm } from '@/components/CryptoForm';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const EncryptPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 sm:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-primary dark:text-primary-foreground leading-tight">
        Encrypt a File
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
        Argon2id + AES-256-GCM Hybrid Encryption System
      </p>

      <Card className="w-full max-w-4xl mb-10 bg-warning border-warning-foreground/20 text-warning-foreground shadow-lg rounded-xl">
        <CardContent className="p-4 flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 text-warning-foreground" />
          <CardDescription className="text-sm font-medium text-warning-foreground">
            <span className="font-bold">Important:</span> Please keep your password and receiver email in a safe place. If lost, you will not be able to decrypt (recover) your file(s).
          </CardDescription>
        </CardContent>
      </Card>

      <div className="w-full max-w-2xl">
        <CryptoForm defaultMode="encrypt" />
      </div>
    </div>
  );
};

export default EncryptPage;