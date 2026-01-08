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
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg bg-gradient-to-r from-blue-300 to-blue-500 text-white hover:from-blue-400 hover:to-blue-600 transition-all duration-300 ease-in-out shadow-lg">
          <Link to="/encrypt" className="flex items-center justify-center">
            <Lock className="mr-3 h-6 w-6" />
            Encrypt Files
          </Link>
        </Button>
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg bg-gradient-to-r from-teal-200 to-cyan-400 text-white hover:from-teal-300 hover:to-cyan-500 transition-all duration-300 ease-in-out shadow-lg">
          <Link to="/decrypt" className="flex items-center justify-center">
            <Unlock className="mr-3 h-6 w-6" />
            Decrypt Files
          </Link>
        </Button>
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg bg-gradient-to-r from-purple-300 to-pink-300 text-white hover:from-purple-400 hover:to-pink-400 transition-all duration-300 ease-in-out shadow-lg">
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