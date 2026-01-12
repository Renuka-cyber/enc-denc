"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle'; // Import ThemeToggle

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-card shadow-sm border-b border-border/30 dark:border-border/15 py-4 px-6 flex justify-center sticky top-0 z-50">
      <nav className="flex items-center space-x-4 max-w-4xl w-full"> {/* Added items-center */}
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
        <Button asChild variant={isActive('/steganography/embed') ? 'default' : 'ghost'}>
          <Link to="/steganography/embed" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Embed Text
          </Link>
        </Button>
        <Button asChild variant={isActive('/steganography/extract') ? 'default' : 'ghost'}>
          <Link to="/steganography/extract" className="flex items-center">
            <EyeOff className="mr-2 h-4 w-4" />
            Extract Text
          </Link>
        </Button>
        <div className="ml-auto"> {/* Pushes the ThemeToggle to the right */}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;