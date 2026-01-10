"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Unlock, Eye, EyeOff } from 'lucide-react'; // Import Eye and EyeOff

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-card shadow-sm border-b border-border/50 dark:border-border/30 py-4 px-6 flex justify-center sticky top-0 z-50">
      <nav className="flex space-x-4 max-w-4xl w-full">
        <Button asChild variant={isActive('/') ? 'default' : 'ghost'}>
          <Link to="/" className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        <Button asChild variant={isActive('/encrypt') ? 'default' : 'ghost'}>
          <Link to="/encrypt" className="flex items-center">
            <Lock className="mr-2 h-4 w-4" />
            Encryption
          </Link>
        </Button>
        <Button asChild variant={isActive('/decrypt') ? 'default' : 'ghost'}>
          <Link to="/decrypt" className="flex items-center">
            <Unlock className="mr-2 h-4 w-4" />
            Decryption
          </Link>
        </Button>
        {/* New buttons for Steganography sections */}
        <Button asChild variant={isActive('/steganography') ? 'default' : 'ghost'}>
          <Link to="/steganography" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Embed Text
          </Link>
        </Button>
        <Button asChild variant={isActive('/steganography') ? 'default' : 'ghost'}>
          <Link to="/steganography" className="flex items-center">
            <EyeOff className="mr-2 h-4 w-4" />
            Extract Text
          </Link>
        </Button>
      </nav>
    </header>
  );
};

export default Header;