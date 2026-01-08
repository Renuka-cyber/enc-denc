import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Image as ImageIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-4 sm:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-primary dark:text-primary-foreground leading-tight">
        Welcome to Enc-Denc: Secure File & Image Tools
      </h1>

      <Card className="w-full max-w-4xl mb-10 bg-warning border-warning-foreground/20 text-warning-foreground shadow-lg rounded-xl">
        <CardContent className="p-4 flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 text-warning-foreground" />
          <CardDescription className="text-sm font-medium text-warning-foreground">
            <span className="font-bold">Important:</span> Always keep your passwords and keys safe. Lost credentials mean lost data.
          </CardDescription>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all duration-300 ease-in-out shadow-lg">
          <Link to="/encrypt" className="flex items-center justify-center">
            <Lock className="mr-3 h-6 w-6" />
            Encrypt Files
          </Link>
        </Button>
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg bg-gradient-to-r from-secondary to-accent text-secondary-foreground hover:from-secondary/90 hover:to-accent/90 transition-all duration-300 ease-in-out shadow-lg">
          <Link to="/decrypt" className="flex items-center justify-center">
            <Unlock className="mr-3 h-6 w-6" />
            Decrypt Files
          </Link>
        </Button>
        <Button asChild className="flex-1 max-w-xs h-auto py-4 text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out shadow-lg">
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