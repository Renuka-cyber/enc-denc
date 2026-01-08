import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Image as ImageIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 sm:p-8">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center text-primary dark:text-primary-foreground leading-tight">
        Enc-Denc
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-center max-w-2xl">
        Secure File Encryption & Image Steganography
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch">
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 ease-in-out shadow-lg">
          <Link to="/encrypt" className="flex items-center justify-center">
            <Lock className="mr-3 h-6 w-6" />
            Encrypt Files
          </Link>
        </Button>
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg border-blue-500 text-blue-700 bg-blue-100 hover:bg-blue-200 dark:border-blue-400 dark:text-blue-400 dark:bg-blue-900 dark:hover:bg-blue-800 transition-all duration-300 ease-in-out shadow-sm">
          <Link to="/decrypt" className="flex items-center justify-center">
            <Unlock className="mr-3 h-6 w-6" />
            Decrypt Files
          </Link>
        </Button>
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg border-blue-500 text-blue-700 bg-blue-100 hover:bg-blue-200 dark:border-blue-400 dark:text-blue-400 dark:bg-blue-900 dark:hover:bg-blue-800 transition-all duration-300 ease-in-out shadow-sm">
          <Link to="/steganography" className="flex items-center justify-center">
            <ImageIcon className="mr-3 h-6 w-6" />
            Steganography
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;