import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Image as ImageIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 sm:p-8">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center text-primary dark:text-primary-foreground leading-tight">
        HESS
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-center max-w-2xl">
        Hybrid Encryption & Steganography System
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg
          bg-encryptButton text-encryptButton-foreground border border-encryptButton/70 shadow-sm
          hover:bg-encryptButton-hover dark:bg-encryptButton-dark dark:hover:bg-encryptButton-dark-hover cursor-pointer">
          <Link to="/encrypt" className="flex items-center justify-center">
            <Lock className="mr-3 h-6 w-6" />
            Encrypt Files
          </Link>
        </Button>
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg
          bg-decryptButton text-decryptButton-foreground border border-decryptButton/70 shadow-sm
          hover:bg-decryptButton-hover dark:bg-decryptButton-dark dark:hover:bg-decryptButton-dark-hover cursor-pointer">
          <Link to="/decrypt" className="flex items-center justify-center">
            <Unlock className="mr-3 h-6 w-6" />
            Decrypt Files
          </Link>
        </Button>
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg
          bg-steganographyButton text-steganographyButton-foreground border border-steganographyButton/70 shadow-sm
          hover:bg-steganographyButton-hover dark:bg-steganographyButton-dark dark:hover:bg-steganographyButton-dark-hover cursor-pointer">
          <Link to="/steganography/embed" className="flex items-center justify-center">
            <ImageIcon className="mr-3 h-6 w-6" />
            Steganography
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;